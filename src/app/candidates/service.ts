"use server";

import { getStore } from '@netlify/sdk';

export type Candidate = {
    id: string;
    name: string;
    email: string;
    risk: "Low" | "Medium" | "High";
    creditScore: number;
    loanAmount: number;
    status: "Approved" | "Rejected";
    riskFactors: string;
};

// Define the key for the blob store
const CANDIDATES_KEY = "candidates";

async function readData(): Promise<Candidate[]> {
    try {
        const store = getStore(CANDIDATES_KEY);
        const data = await store.get(CANDIDATES_KEY, { type: 'json' });
        return (data as Candidate[]) || [];
    } catch (error) {
        console.error("Error reading candidates data from blob store:", error);
        // If the store is empty or there's an error, return an empty array
        return [];
    }
}

async function writeData(data: Candidate[]) {
    try {
        const store = getStore(CANDIDATES_KEY);
        await store.setJSON(CANDIDATES_KEY, data);
    } catch (error) {
        console.error("Error writing candidates data to blob store:", error);
    }
}


export async function getCandidates(): Promise<Candidate[]> {
    const candidates = await readData();
    // Sort by ID descending to show newest first
    return candidates.sort((a, b) => {
        const idA = a.id.split('-')[1] || '0';
        const idB = b.id.split('-')[1] || '0';
        return Number(idB) - Number(idA);
    });
}

export async function addCandidate(data: Omit<Candidate, 'id'>) {
    const candidates = await readData();
    
    // Determine the next ID
    const nextIdNumber = candidates.reduce((maxId, candidate) => {
        const currentId = parseInt(candidate.id.split('-')[1], 10);
        return currentId > maxId ? currentId : maxId;
    }, 0) + 1;

    const newId = `CAND-${String(nextIdNumber).padStart(3, '0')}`;
    
    const newCandidate: Candidate = {
        ...data,
        id: newId,
    };
    
    candidates.push(newCandidate);
    await writeData(candidates);
    
    return newCandidate;
}

export async function deleteCandidate(id: string) {
    let candidates = await readData();
    const initialLength = candidates.length;
    candidates = candidates.filter(candidate => candidate.id !== id);

    if (candidates.length < initialLength) {
        await writeData(candidates);
        return { success: true };
    }
    return { success: false, message: "Candidate not found." };
}
