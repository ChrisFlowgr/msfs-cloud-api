// In-memory storage for flight data
let currentFlightPlan = null;
let currentPositionData = null;
let lastUpdate = null;

module.exports = (req, res) => {
  // Set CORS headers to allow access from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple API key check
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  // Handle different HTTP methods
  if (req.method === 'POST') {
    try {
      // Store the flight plan and position data from the MSFS bridge
      const data = req.body;
      
      // Update the stored data
      if (data.flightPlan) {
        currentFlightPlan = data.flightPlan;
      }
      
      if (data.position) {
        currentPositionData = data.position;
      }
      
      lastUpdate = new Date().toISOString();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Flight data stored successfully',
        timestamp: lastUpdate
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to store flight data',
        message: error.message
      });
    }
  } 
  else if (req.method === 'GET') {
    // Return the stored flight plan to the mobile app
    if (!currentFlightPlan && !currentPositionData) {
      return res.status(404).json({ 
        error: 'No flight data available',
        message: 'No flight data has been uploaded yet'
      });
    }
    
    return res.status(200).json({
      flightPlan: currentFlightPlan,
      position: currentPositionData,
      lastUpdate
    });
  } 
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}; 