module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'OK',
      service: 'MSFS Flight Data API',
      timestamp: new Date().toISOString(),
      message: 'API is running and ready to serve flight data'
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}; 