export const API_BASE_URL = "/api";

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
