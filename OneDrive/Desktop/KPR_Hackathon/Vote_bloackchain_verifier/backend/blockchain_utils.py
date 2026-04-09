import hashlib

def get_all_candidates():
    # Mock candidates
    return [
        (1, "Candidate A", 10),
        (2, "Candidate B", 15),
        (3, "Candidate C", 5)
    ]

class MockReceipt:
    class MockHash:
        def hex(self):
            return "0x" + hashlib.sha256(b"mock_tx").hexdigest()
    
    def __init__(self):
        self.transactionHash = self.MockHash()

def cast_vote(voter_id_hash, candidate_id):
    # Mock cast vote
    return MockReceipt()
