import hashlib
import random

def generate_biometric_vector(fingerprint_hash: str):
    """
    Simulates converting a fingerprint hash into a high-dimensional vector.
    In a real system, this would use a deep learning model (e.g., DeepFace or FingerNet).
    For the hackathon, we generate a stable vector based on the hash.
    """
    # Use seed for reproducibility for the same fingerprint
    seed = int(hashlib.md5(fingerprint_hash.encode()).hexdigest(), 16) % 2**32
    random.seed(seed)
    
    # Generate a 128-dimensional vector
    vector = [round(random.uniform(-1, 1), 4) for _ in range(128)]
    
    return vector

def verify_similarity(vector1, vector2):
    """
    Simulates a similarity score between two biometric vectors.
    In real life, this would use Cosine Similarity or Euclidean Distance.
    """
    # For prototype: simple cosine-like similarity
    dot_product = sum(v1 * v2 for v1, v2 in zip(vector1, vector2))
    mag1 = sum(v * v for v in vector1) ** 0.5
    mag2 = sum(v * v for v in vector2) ** 0.5
    
    if mag1 == 0 or mag2 == 0:
        return False, 0.0
        
    similarity = dot_product / (mag1 * mag2)
    # Threshold for a match in this prototype is 0.95
    return similarity > 0.95, similarity
