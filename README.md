# SpecChek

A brutalist-style web application that scans your computer's hardware and determines which games it can run based on minimum and recommended specifications.

![SpecChek Screenshot](https://placehold.co/800x400?text=SpecChek+Screenshot)

## Features

- **Hardware Scanning**: Detects your CPU, GPU, RAM, and storage specifications
- **Game Compatibility**: Checks if your system meets minimum or recommended requirements for games
- **Game Library**: Browse a collection of games with their system requirements
- **Brutalist Design**: Modern brutalist UI with minimal animations

## Tech Stack

- React + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Query for data fetching
- Systeminformation for hardware detection

## Getting Started

### Prerequisites

- Node.js 16+ and npm

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How It Works

1. The application uses the `systeminformation` library to detect your hardware specifications
2. It compares your hardware against a database of game requirements
3. Results are displayed showing which games you can run at minimum or recommended settings

## Limitations

- Hardware detection requires permissions and may not work in all browsers
- Game compatibility is based on simplified comparisons and may not be 100% accurate
- The application currently only works on desktop browsers

## License

MIT

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Systeminformation](https://systeminformation.io/)
- [React Query](https://tanstack.com/query/latest)
- [Framer Motion](https://www.framer.com/motion/)
