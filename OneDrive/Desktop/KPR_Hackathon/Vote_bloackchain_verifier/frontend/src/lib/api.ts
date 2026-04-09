export const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://voter-verifier-system.onrender.com";

// Add typed models and API wrapper methods as needed.
export interface User {
    id: number;
    username: string;
    has_voted: boolean;
    voter_id_hash: string;
}

export interface Candidate {
    id: number;
    name: string;
    voteCount: number;
}
