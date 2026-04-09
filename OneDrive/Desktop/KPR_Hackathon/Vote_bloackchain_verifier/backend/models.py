from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    has_voted = Column(Boolean, default=False)
    voter_id_hash = Column(String, unique=True, index=True) # Used on blockchain

class Elector(Base):
    __tablename__ = "electors"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String, unique=True, index=True) # EPIC Number
    voter_name = Column(String)
    father_name = Column(String)
    fingerprint_hash = Column(String, nullable=True) # Stored after biometric step
    is_verified = Column(Boolean, default=False)
    timestamp = Column(String, nullable=True)
class RemoteSession(Base):
    __tablename__ = "remote_sessions"

    session_id = Column(String, primary_key=True, index=True)
    voter_id = Column(String, index=True)
    status = Column(String, default="pending") # pending, completed, failed
    fingerprint_data = Column(String, nullable=True)
    timestamp = Column(String, nullable=True)
