"use server";

import { getCandidatesStore } from '@/lib/netlify-store';

export type Candidate = {
    id: string;
    name: string;
    email: string;
    risk: "Low" | "Medium" | "High";
    creditScore: number;
    loanAmount: number;
    status: "Approved" | "Rejected";
    riskFactors: string;
    createdAt: string;
};

const CANDIDATES_KEY = 'candidates-data';
const COUNTER_KEY = 'candidates-counter';

async function readCandidates(): Promise<Candidate[]> {
    try {
        const store = getCandidatesStore();
        const data = await store.get(CANDIDATES_KEY, { type: 'json' });
        
        if (!data) {
            return [];
        }
        
        return data as Candidate[];
    } catch (error) {
        console.error("Error reading candidates from Netlify Blob:", error);
        return [];
    }
}

async function writeCandidates(candidates: Candidate[]): Promise<void> {
    try {
        const store = getCandidatesStore();
        await store.setJSON(CANDIDATES_KEY, candidates);
    } catch (error) {
        console.error("Error writing candidates to Netlify Blob:", error);
        throw new Error("Failed to save data");
    }
}

async function getNextId(): Promise<string> {
    try {
        const store = getCandidatesStore();
        
        const counterData = await store.get(COUNTER_KEY, { type: 'json' });
        let counter = 1;
        
        if (counterData && typeof counterData === 'object' && 'value' in counterData) {
            counter = (counterData as { value: number }).value + 1;
        }
        
        await store.setJSON(COUNTER_KEY, { value: counter });
        
        return `CAND-${String(counter).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generating ID:", error);
        return `CAND-${Date.now()}`;
    }
}

export async function getCandidates(): Promise<Candidate[]> {
    const candidates = await readCandidates();
    
    return candidates.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });
}

export async function addCandidate(data: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate> {
    try {
        const candidates = await readCandidates();
        const newId = await getNextId();
        
        const newCandidate: Candidate = {
            ...data,
            id: newId,
            createdAt: new Date().toISOString(),
        };
        
        candidates.push(newCandidate);
        await writeCandidates(candidates);
        
        console.log(`Successfully saved candidate: ${newId}`);
        return newCandidate;
    } catch (error) {
        console.error("Error adding candidate:", error);
        throw new Error("Failed to save candidate");
    }
}

export async function deleteCandidate(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        const candidates = await readCandidates();
        const filteredCandidates = candidates.filter(c => c.id !== id);
        
        if (filteredCandidates.length === candidates.length) {
            return { success: false, message: "Candidate not found" };
        }
        
        await writeCandidates(filteredCandidates);
        return { success: true };
    } catch (error) {
        console.error("Error deleting candidate:", error);
        return { success: false, message: "Failed to delete candidate" };
    }
}

export async function getCandidate(id: string): Promise<Candidate | null> {
    try {
        const candidates = await readCandidates();
        return candidates.find(c => c.id === id) || null;
    } catch (error) {
        console.error("Error getting candidate:", error);
        return null;
    }
}

export async function initializeStore(): Promise<void> {
    try {
        const store = getCandidatesStore();
        const data = await store.get(CANDIDATES_KEY, { type: 'json' });
        
        if (!data) {
            console.log("Initializing empty candidates store...");
            await store.setJSON(CANDIDATES_KEY, []);
            await store.setJSON(COUNTER_KEY, { value: 0 });
            console.log("Store initialized successfully");
        } else {
            console.log("Store already initialized");
        }
    } catch (error) {
        console.error("Error initializing store:", error);
    }
}
