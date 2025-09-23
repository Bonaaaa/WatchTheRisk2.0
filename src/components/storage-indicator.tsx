"use client";

import { useEffect, useState } from 'react';

export function StorageIndicator() {
  const [storageType, setStorageType] = useState<string>('');

  useEffect(() => {
    // This runs on the client, so we check for Netlify env vars
    const isNetlify = !!(
      process.env.NEXT_PUBLIC_NETLIFY || 
      window.location.hostname.includes('netlify')
    );
    setStorageType(isNetlify ? 'Netlify Blobs' : 'Local Storage');
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  if (!storageType) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm opacity-75 z-50">
      Storage: {storageType}
    </div>
  );
}
