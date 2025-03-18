# SpecChek

A modern web application with dark mode support that scans your computer's hardware and determines which games it can run based on minimum and recommended specifications. The game library includes a robust fallback to local data when API connection fails.

![SpecChek Screenshot](https://placehold.co/800x400?text=SpecChek+Screenshot)

## IGDB API Integration

This application uses the IGDB API to fetch game data, including system requirements, prices, screenshots, and more. To set up the API:

1. Create a Twitch Developer account at [https://dev.twitch.tv/](https://dev.twitch.tv/)
2. Register a new application at [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
3. Copy your Client ID and Client Secret
4. Create a `.env` file in the root directory based on `.env.example`
5. Add your IGDB Client ID and Client Secret to the `.env` file

Example `.env` file:
```
VITE_IGDB_CLIENT_ID=your_client_id_here
VITE_IGDB_CLIENT_SECRET=your_client_secret_here
```

### CORS Issues & Server-Side Proxy

Due to CORS restrictions, direct browser requests to the IGDB API may fail. The application includes:

1. Multiple CORS proxies that it tries when connecting to the API
2. A robust fallback to local mock data when API connections fail

For a more reliable production setup, consider implementing a server-side proxy:

1. Create a simple Express.js server with a proxy endpoint
2. Store your API credentials securely on the server
3. Forward requests from your frontend to the IGDB API through your server

Example server-side proxy code:
```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.text());

// Authentication
let authToken = null;
let tokenExpiry = 0;

async function getAuthToken() {
  if (authToken && tokenExpiry > Date.now()) {
    return authToken;
  }
  
  const response = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    null,
    {
      params: {
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    }
  );
  
  authToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
  return authToken;
}

// IGDB API proxy endpoint
app.post('/api/igdb/:endpoint', async (req, res) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `https://api.igdb.com/v4/${req.params.endpoint}`,
      req.body,
      {
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.IGDB_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('IGDB API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Internal server error' }
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Then update your frontend to use this proxy instead of direct API calls.

## Features

- **Hardware Scanning**: Detects your CPU, GPU, RAM, and storage specifications
- **Game Compatibility**: Checks if your system meets minimum or recommended requirements for games
- **Game Library**: Browse a collection of games with their system requirements
- **RAWG API Integration**: Connects to the RAWG API with local data fallback
- **Dark Mode Support**: Seamless switching between light and dark themes
- **Modern UI Design**: Clean, responsive interface with smooth animations
- **IGDB API Integration**: Connects to the IGDB API for additional game data

## Tech Stack

- React + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- NextUI components
- Framer Motion for animations
- React Router for navigation
- Axios for API requests
- RAWG API for game data
- Systeminformation for hardware detection
- IGDB API for additional game data

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- RAWG API Key (optional, application works with local data)

### Setting up RAWG API Access (Optional)

1. Go to [RAWG API](https://rawg.io/apidocs) and sign up
2. Get your API key from the dashboard
3. The application will work without an API key using local data, but connecting to the API provides more games

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/specchek.git
cd specchek
```

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file in the root directory (optional):
```
VITE_RAWG_API_KEY=your_api_key_here
```

4. Set up your environment variables as described above

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How It Works

1. The application uses browser APIs to detect your hardware specifications
2. It fetches game data from the RAWG API or uses local data when the API is unavailable
3. It compares your hardware against the game requirements
4. Results are displayed showing which games you can run at minimum or recommended settings

### Offline Capability

The application includes a comprehensive local database of popular games that will be used when:
- The API is unavailable
- The user is offline
- API rate limits are exceeded
- Search returns no results from the API

## Limitations

- Hardware detection requires permissions and may not work in all browsers
- Game compatibility is based on simplified comparisons and may not be 100% accurate
- The application currently only works on desktop browsers
- RAWG API has rate limits that may affect functionality if exceeded

## License

MIT

## Acknowledgements

- [RAWG API](https://rawg.io/apidocs) for game data
- [Tailwind CSS](https://tailwindcss.com/)
- [NextUI](https://nextui.org/)
- [Heroicons](https://heroicons.com/)
- [Axios](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/)
