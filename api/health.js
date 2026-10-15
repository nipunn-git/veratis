/**
 * VERATIS Intelligence API - Health Check Endpoint
 * Vercel Serverless Function / Chrome Extension API
 */
export default function handler(req, res) {
  // Set CORS headers for Vercel web app and Chrome Extension
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    status: 'online',
    service: 'VERATIS Intelligence API',
    version: '1.0.0',
    capabilities: ['truth-tribunal', 'digital-twin-simulator'],
    timestamp: new Date().toISOString()
  });
}
