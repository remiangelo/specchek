# SpecChek

A brutalist-style web application that scans your computer's hardware and determines which games it can run based on minimum and recommended specifications. The game library uses the IGDB API to display comprehensive game information.

![SpecChek Screenshot](https://placehold.co/800x400?text=SpecChek+Screenshot)

## Features

- **Hardware Scanning**: Detects your CPU, GPU, RAM, and storage specifications
- **Game Compatibility**: Checks if your system meets minimum or recommended requirements for games
- **Game Library**: Browse a collection of games with their system requirements
- **IGDB Integration**: Connects to the IGDB API for up-to-date game data
- **Brutalist Design**: Modern brutalist UI with minimal animations

## Tech Stack

- React + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API requests
- IGDB API for game data
- Systeminformation for hardware detection

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Twitch Developer Account (for IGDB API access)

### Setting up IGDB API Access

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps) and sign in
2. Create a new application:
   - Name: SpecChek (or your preferred name)
   - OAuth Redirect URL: http://localhost:5173 (or your local dev URL)
   - Category: Website Integration
3. After registration, you'll receive a Client ID
4. Generate a Client Secret from your application page
5. Copy both the Client ID and Client Secret

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

3. Create an `.env` file in the root directory:
```
VITE_IGDB_CLIENT_ID=your_client_id_here
VITE_IGDB_CLIENT_SECRET=your_client_secret_here
```

4. Test the IGDB API connection:
```bash
node src/services/testIGDB.js
```
If successful, you should see a list of games and confirmation that the API is working.

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

1. The application uses the `systeminformation` library to detect your hardware specifications
2. It fetches game data from the IGDB API, including system requirements
3. It compares your hardware against the game requirements
4. Results are displayed showing which games you can run at minimum or recommended settings

## Limitations

- Hardware detection requires permissions and may not work in all browsers
- Game compatibility is based on simplified comparisons and may not be 100% accurate
- The application currently only works on desktop browsers
- IGDB API has rate limits that may affect functionality if exceeded

## License

MIT

## Acknowledgements

- [IGDB API](https://api.igdb.com/) for game data
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Systeminformation](https://systeminformation.io/)
- [Axios](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/)
