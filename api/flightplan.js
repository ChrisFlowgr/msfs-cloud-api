// Global variables to store the latest flight data
// In a production environment, you would use a database
let flightPlanData = null;
let positionData = null;
let lastUpdate = null;

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle POST request (update flight data)
  if (req.method === 'POST') {
    try {
      // Validate API key
      const apiKey = req.headers.authorization || '';
      const expectedApiKey = process.env.API_KEY || 'flight-manager-secret-key';
      
      if (apiKey !== `Bearer ${expectedApiKey}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const data = req.body;
      
      if (!data) {
        return res.status(400).json({ error: 'No data provided' });
      }
      
      // Store the flight data
      if (data.flightPlan) {
        flightPlanData = data.flightPlan;
      }
      
      if (data.position) {
        positionData = data.position;
      }
      
      lastUpdate = new Date().toISOString();
      
      return res.status(200).json({
        message: 'Flight data updated successfully',
        timestamp: lastUpdate
      });
    } catch (error) {
      console.error('Error processing flight data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle GET request (retrieve flight data)
  if (req.method === 'GET') {
    try {
      if (!flightPlanData && !positionData) {
        return res.status(200).json({
          message: 'No flight data available',
          hasData: false,
          lastUpdate: null
        });
      }
      
      return res.status(200).json({
        flightPlan: flightPlanData,
        position: positionData,
        hasData: true,
        lastUpdate
      });
    } catch (error) {
      console.error('Error retrieving flight data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle other request types
  return res.status(405).json({ error: 'Method not allowed' });
}; 