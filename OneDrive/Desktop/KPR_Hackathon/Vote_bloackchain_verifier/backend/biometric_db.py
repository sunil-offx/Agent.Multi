from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./biometric_vectors.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class VoterBiometricVector(Base):
    __tablename__ = "voter_biometric_vectors"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String, index=True)
    finger_label = Column(String)
    vector_data = Column(JSON)

Base.metadata.create_all(bind=engine)

def get_biometric_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
