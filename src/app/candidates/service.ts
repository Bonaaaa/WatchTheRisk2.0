"use server";

import { isNetlifyEnvironment } from '@/lib/storage-config';
import { getCandidatesStore } from '@/lib/netlify-store';
import { 
  getLocalCandidates, 
  saveLocalCandidates, 
  getLocalCounter, 
  saveLocalCounter 
} from '@/lib/local-store';

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

// Storage abstraction layer
const storage = {
  async readCandidates(): Promise<Candidate[]> {
    if (isNetlifyEnvironment()) {
      // Use Netlify Blobs in production or netlify dev
      try {
        const store = getCandidatesStore();
        const data = await store.get(CANDIDATES_KEY, { type: 'json' });
        return (data as Candidate[]) || [];
      } catch (error) {
        console.error("Error reading from Netlify Blob:", error);
        return [];
      }
    } else {
      // Use local file storage in development
      return await getLocalCandidates();
    }
  },

  async writeCandidates(candidates: Candidate[]): Promise<void> {
    if (isNetlifyEnvironment()) {
      const store = getCandidatesStore();
      await store.setJSON(CANDIDATES_KEY, candidates);
    } else {
      await saveLocalCandidates(candidates);
    }
  },

  async getNextId(): Promise<string> {
    if (isNetlifyEnvironment()) {
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
        console.error("Error with Netlify counter:", error);
        return `CAND-${Date.now()}`;
      }
    } else {
      // Local file storage
      const counter = await getLocalCounter();
      const newCounter = counter + 1;
      await saveLocalCounter(newCounter);
      return `CAND-${String(newCounter).padStart(3, '0')}`;
    }
  }
};

// Public API remains the same
export async function getCandidates(): Promise<Candidate[]> {
    const candidates = await storage.readCandidates();
    
    return candidates.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });
}

export async function addCandidate(data: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate> {
    try {
        const candidates = await storage.readCandidates();
        const newId = await storage.getNextId();
        
        const newCandidate: Candidate = {
            ...data,
            id: newId,
            createdAt: new Date().toISOString(),
        };
        
        candidates.push(newCandidate);
        await storage.writeCandidates(candidates);
        
        console.log(`Successfully saved candidate: ${newId} (Storage: ${isNetlifyEnvironment() ? 'Netlify' : 'Local'})`);
        return newCandidate;
    } catch (error) {
        console.error("Error adding candidate:", error);
        throw new Error("Failed to save candidate");
    }
}

export async function deleteCandidate(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        const candidates = await storage.readCandidates();
        const filteredCandidates = candidates.filter(c => c.id !== id);
        
        if (filteredCandidates.length === candidates.length) {
            return { success: false, message: "Candidate not found" };
        }
        
        await storage.writeCandidates(filteredCandidates);
        return { success: true };
    } catch (error) {
        console.error("Error deleting candidate:", error);
        return { success: false, message: "Failed to delete candidate" };
    }
}

export async function getCandidate(id: string): Promise<Candidate | null> {
    try {
        const candidates = await storage.readCandidates();
        return candidates.find(c => c.id === id) || null;
    } catch (error) {
        console.error("Error getting candidate:", error);
        return null;
    }
}

export async function initializeStore(): Promise<void> {
    const storageType = isNetlifyEnvironment() ? 'Netlify Blobs' : 'Local Storage';
    console.log(`Initializing ${storageType} store...`);
    
    if (isNetlifyEnvironment()) {
        try {
            const store = getCandidatesStore();
            const data = await store.get(CANDIDATES_KEY, { type: 'json' });
            
            if (!data) {
                await store.setJSON(CANDIDATES_KEY, []);
                await store.setJSON(COUNTER_KEY, { value: 0 });
                console.log("Netlify store initialized successfully");
            }
        } catch (error) {
            console.error("Error initializing Netlify store:", error);
        }
    } else {
        console.log("Local storage ready (auto-initializes)");
    }
}
