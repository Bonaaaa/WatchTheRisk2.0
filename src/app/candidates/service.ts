// This is a simple in-memory "database" for the prototype.
// In a real application, you would use a proper database like Firestore.

export type Candidate = {
    id: string;
    name: string;
    email: string;
    risk: "Low" | "Medium" | "High";
    creditScore: number;
    loanAmount: number;
    status: "Approved" | "Rejected";
};
  
let candidates: Candidate[] = [];

let nextId = 1;

export function getCandidates(): Candidate[] {
    // Return a copy to prevent direct modification of the in-memory store
    return [...candidates].sort((a, b) => Number(b.id.split('-')[1]) - Number(a.id.split('-')[1]));
}

export function addCandidate(data: Omit<Candidate, 'id'>) {
    const newId = `CAND-${String(nextId++).padStart(3, '0')}`;
    const newCandidate: Candidate = {
        ...data,
        id: newId,
    };
    candidates.push(newCandidate);
    return newCandidate;
}
