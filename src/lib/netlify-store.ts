import { getStore } from '@netlify/blobs';

export function getCandidatesStore() {
  return getStore('candidates-store');
}
