import { getStore } from '@netlify/blobs';

export function getCandidatesStore() {
  // Add site ID for production reliability
  const siteId = process.env.NETLIFY_SITE_ID;
  
  if (siteId) {
    return getStore({
      name: 'candidates-store',
      siteID: siteId
    });
  }
  
  // Fallback for local development
  return getStore('candidates-store');
}
