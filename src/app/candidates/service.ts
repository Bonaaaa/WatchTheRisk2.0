"use server";

import fs from 'fs';
import path from 'path';

export type Candidate = {
    id: string;
    name: string;
    email: string;
    risk: "Low" | "Medium" | "High";
    creditScore: number;
    loanAmount: number;
    status: "Approved" | "Rejected";
};

// Use a JSON file for persistence.
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'candidates.json');

function readData(): Candidate[] {
    try {
        if (fs.existsSync(dataFilePath)) {
            const jsonString = fs.readFileSync(dataFilePath, 'utf-8');
            return JSON.parse(jsonString);
        }
        return [];
    } catch (error) {
        console.error("Error reading candidates data:", error);
        return [];
    }
}

function writeData(data: Candidate[]) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(dataFilePath, jsonString, 'utf-8');
    } catch (error) {
        console.error("Error writing candidates data:", error);
    }
}

// Initialize the file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    writeData([]);
}


export async function getCandidates(): Promise<Candidate[]> {
    const candidates = readData();
    // Sort by ID descending to show newest first
    return candidates.sort((a, b) => Number(b.id.split('-')[1]) - Number(a.id.split('-')[1]));
}

export async function addCandidate(data: Omit<Candidate, 'id'>) {
    const candidates = readData();
    
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
    writeData(candidates);
    
    return newCandidate;
}