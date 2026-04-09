from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import hashlib
import uuid
from datetime import datetime

import models, schemas, auth, database, blockchain_utils, biometric_db, biometric_utils
from database import engine
from biometric_db import get_biometric_db, VoterBiometricVector

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Voting App Backend API", description="Backend for Blockchain Voting Hackathon Project")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        hashed_password = auth.get_password_hash("admin123")
        voter_id_hash = hashlib.sha256(b"admin").hexdigest()
        new_admin = models.User(
            username="admin", 
            hashed_password=hashed_password,
            voter_id_hash=voter_id_hash
        )
        db.add(new_admin)
        db.commit()
    db.close()

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/candidates")
def get_candidates():
    try:
        candidates = blockchain_utils.get_all_candidates()
        result = []
        for c in candidates:
            result.append({
                "id": c[0],
                "name": c[1],
                "voteCount": c[2]
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vote")
def cast_vote(vote_req: schemas.VoteRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.has_voted:
        raise HTTPException(status_code=400, detail="User has already voted")
    
    try:
        # Cast vote on the blockchain
        receipt = blockchain_utils.cast_vote(current_user.voter_id_hash, vote_req.candidate_id)
        
        # Update user in DB
        current_user.has_voted = True
        db.commit()
        
        return {"status": "success", "tx_receipt": receipt.transactionHash.hex(), "message": "Vote successfully cast on blockchain"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify-qr")
def verify_qr(req: schemas.VerifyQRRequest, db: Session = Depends(database.get_db)):
    elector = db.query(models.Elector).filter(models.Elector.voter_id == req.voter_id).first()
    if not elector:
        raise HTTPException(status_code=404, detail="Voter ID not found in master records")
    
    if elector.is_verified:
        raise HTTPException(status_code=400, detail="Voter already verified and likely voted")
        
    return {"status": "success", "message": "QR Scan Successful, Proceed to Biometrics"}

@app.post("/verify-biometric")
def verify_biometric(
    req: schemas.BiometricRequest, 
    db: Session = Depends(database.get_db),
    bio_db: Session = Depends(get_biometric_db)
):
    elector = db.query(models.Elector).filter(models.Elector.voter_id == req.voter_id).first()
    if not elector:
        raise HTTPException(status_code=404, detail="Voter not found in registration record")
    
    # Generate high-dimensional vector for the current request
    current_vector = biometric_utils.generate_biometric_vector(req.fingerprint_data)

    # SECURE DEDUPLICATION: Check for physically similar biometrics across all voters
    # In a production system, you'd use a vector database (Milvus/Pinecone)
    # For this prototype, we cross-reference against all stored vectors in the biometric_vectors.db
    all_stored_vectors = bio_db.query(VoterBiometricVector).all()
    
    for stored in all_stored_vectors:
        # Check if this physical biometric matches someone ELSE's record
        if stored.voter_id != req.voter_id:
            is_match, similarity = biometric_utils.verify_similarity(current_vector, stored.vector_data)
            if is_match:
                raise HTTPException(
                    status_code=403, 
                    detail=f"FRAUD DETECTED: Physical biometric match ({similarity:.2%}) found in database under Voter ID: {stored.voter_id}! Access Denied."
                )

    # 1. Update Core Database (Mark as verified if first time)
    if not elector.is_verified:
        elector.fingerprint_hash = req.fingerprint_data
        elector.is_verified = True
        db.commit()

    # 2. Store in Separate Biometric Vector Database with Finger Labeling
    # Count existing fingers for this voter to determine label (Finger 1, 2, 3...)
    existing_finger_count = bio_db.query(VoterBiometricVector).filter(VoterBiometricVector.voter_id == req.voter_id).count()
    next_finger_label = f"Finger {existing_finger_count + 1}"
    
    # Generate high-dimensional vector
    vector = biometric_utils.generate_biometric_vector(req.fingerprint_data)
    
    new_vector = VoterBiometricVector(
        voter_id=req.voter_id,
        finger_label=next_finger_label,
        vector_data=vector
    )
    bio_db.add(new_vector)
    bio_db.commit()
    
    return {
        "status": "success", 
        "message": f"{next_finger_label} Verified & Vectorized",
        "finger": next_finger_label,
        "vector_count": existing_finger_count + 1,
        "db": "biometric_vectors.db"
    }

@app.post("/sync-electors")
def sync_electors(elector_list: list[schemas.ElectorBase], db: Session = Depends(database.get_db)):
    for e in elector_list:
        existing = db.query(models.Elector).filter(models.Elector.voter_id == e.voter_id).first()
        if not existing:
            new_e = models.Elector(
                voter_id=e.voter_id,
                voter_name=e.voter_name,
                father_name=e.father_name
            )
            db.add(new_e)
    db.commit()
    return {"status": "success", "count": len(elector_list)}

@app.get("/electors")
def get_electors(db: Session = Depends(database.get_db)):
    return db.query(models.Elector).all()
@app.post("/remote-verify/start")
def start_remote_verify(req: schemas.RemoteSessionCreate, db: Session = Depends(database.get_db)):
    session_id = str(uuid.uuid4())
    new_session = models.RemoteSession(
        session_id=session_id,
        voter_id=req.voter_id,
        status="pending",
        timestamp=datetime.now().isoformat()
    )
    db.add(new_session)
    db.commit()
    return {"session_id": session_id}

@app.get("/remote-verify/status/{session_id}")
def get_remote_status(session_id: str, db: Session = Depends(database.get_db)):
    session = db.query(models.RemoteSession).filter(models.RemoteSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "status": session.status,
        "fingerprint_data": session.fingerprint_data
    }

@app.post("/remote-verify/submit")
def submit_remote_verify(req: schemas.RemoteSessionSubmit, db: Session = Depends(database.get_db)):
    session = db.query(models.RemoteSession).filter(models.RemoteSession.session_id == req.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.fingerprint_data = req.fingerprint_data
    session.status = "completed"
    db.commit()
    return {"status": "success"}
