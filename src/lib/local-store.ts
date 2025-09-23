import { Candidate } from '@/app/candidates/service';
import fs from 'fs/promises';
import path from 'path';

// Use a local JSON file for development
const LOCAL_STORAGE_PATH = path.join(process.cwd(), '.local-storage');
const CANDIDATES_FILE = path.join(LOCAL_STORAGE_PATH, 'candidates.json');
const COUNTER_FILE = path.join(LOCAL_STORAGE_PATH, 'counter.json');

// Ensure storage directory exists
async function ensureStorageDirectory() {
  try {
    await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
}

export async function getLocalCandidates(): Promise<Candidate[]> {
  try {
    await ensureStorageDirectory();
    const data = await fs.readFile(CANDIDATES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty
    return [];
  }
}

export async function saveLocalCandidates(candidates: Candidate[]): Promise<void> {
  await ensureStorageDirectory();
  await fs.writeFile(CANDIDATES_FILE, JSON.stringify(candidates, null, 2));
}

export async function getLocalCounter(): Promise<number> {
  try {
    await ensureStorageDirectory();
    const data = await fs.readFile(COUNTER_FILE, 'utf-8');
    return JSON.parse(data).value || 0;
  } catch (error) {
    return 0;
  }
}

export async function saveLocalCounter(value: number): Promise<void> {
  await ensureStorageDirectory();
  await fs.writeFile(COUNTER_FILE, JSON.stringify({ value }, null, 2));
}
