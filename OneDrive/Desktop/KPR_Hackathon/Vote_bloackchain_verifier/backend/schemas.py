from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    has_voted: bool
    voter_id_hash: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class VoteRequest(BaseModel):
    candidate_id: int

class ElectorBase(BaseModel):
    voter_id: str
    voter_name: str
    father_name: str

class Elector(ElectorBase):
    id: int
    is_verified: bool
    fingerprint_hash: str | None = None

    class Config:
        from_attributes = True

class VerifyQRRequest(BaseModel):
    qr_content: str
    voter_id: str

class BiometricRequest(BaseModel):
    voter_id: str
    fingerprint_data: str # Base64 or hash string
class RemoteSessionCreate(BaseModel):
    voter_id: str

class RemoteSessionResponse(BaseModel):
    session_id: str
    status: str
    fingerprint_data: str | None = None

class RemoteSessionSubmit(BaseModel):
    session_id: str
    fingerprint_data: str
