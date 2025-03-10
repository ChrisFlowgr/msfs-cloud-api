# MSFS Cloud API

This is a serverless API that facilitates communication between Microsoft Flight Simulator and the Flight Manager mobile app. It acts as a bridge to transfer flight plan and position data.

## How It Works

1. The MSFS Connector running on the PC with Microsoft Flight Simulator sends flight data to this API
2. This API stores the data in memory (for free tier deployment)
3. The Flight Manager mobile app retrieves the data from this API

## Deployment Instructions

### Prerequisites
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- [Node.js](https://nodejs.org) (version 18 or higher)
- [Vercel CLI](https://vercel.com/cli) installed globally (`npm install -g vercel`)

### Steps to Deploy

1. **Login to Vercel from the CLI**
   ```bash
   vercel login
   ```

2. **Deploy the API**
   ```bash
   # From the msfs-cloud-api directory
   vercel
   ```
   - Follow the prompts to link to your Vercel account
   - Choose to deploy to your account

3. **Set Up Environment Variables**
   - After deployment, go to the Vercel dashboard
   - Navigate to your project
   - Go to "Settings" > "Environment Variables"
   - Add an environment variable:
     - Name: `API_KEY`
     - Value: `flight-manager-secret-key` (use the same value as in the MSFS Connector)

4. **Get Your API URL**
   - Vercel will provide a URL like `https://msfs-cloud-api.vercel.app`
   - Your API endpoints will be:
     - `https://msfs-cloud-api.vercel.app/api/flightplan`
     - `https://msfs-cloud-api.vercel.app/api/status`

5. **Update MSFS Connector Configuration**
   - Update the `.env` file in your `msfs-connect` project with your new API URL

## API Endpoints

### GET /api/status
- Check if the API is running
- No authentication required

### GET /api/flightplan
- Retrieve the current flight plan and position data
- No authentication required (for client apps)

### POST /api/flightplan
- Submit flight plan and position data
- Requires API key authentication

## Testing

To ensure everything is working:

1. Deploy this API to Vercel
2. Start the MSFS Connector on your PC
3. Visit your API status endpoint in a browser (e.g., `https://msfs-cloud-api.vercel.app/api/status`)
4. Open the Flight Manager app with the updated API URL

## Free Tier Considerations

- Vercel's free tier has a limit of 100 GB-hours per month
- For personal use, this is typically more than sufficient
- Data is stored in memory and will be lost when the function goes cold (after periods of inactivity)
- For production use, consider adding a persistent database 