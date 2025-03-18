# SpecChek

A modern web application with dark mode support that scans your computer's hardware and determines which games it can run based on minimum and recommended specifications. The game library includes a robust fallback to local data when API connection fails.

![SpecChek Screenshot](https://placehold.co/800x400?text=SpecChek+Screenshot)

## Features

- **Hardware Scanning**: Detects your CPU, GPU, RAM, and storage specifications
- **Game Compatibility**: Checks if your system meets minimum or recommended requirements for games
- **Game Library**: Browse a collection of games with their system requirements
- **RAWG API Integration**: Connects to the RAWG API with local data fallback
- **Dark Mode Support**: Seamless switching between light and dark themes
- **Modern UI Design**: Clean, responsive interface with smooth animations

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

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

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
