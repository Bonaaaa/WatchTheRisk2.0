export function isNetlifyEnvironment(): boolean {
  // Check if running in Netlify (production or netlify dev)
  return !!(
    process.env.NETLIFY || 
    process.env.NETLIFY_DEV ||
    process.env.NETLIFY_LOCAL
  );
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
