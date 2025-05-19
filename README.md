# cacheroute.io

A web application for optimizing geocaching routes by finding the most efficient path between multiple waypoints.

## Features

- Upload GPX files containing waypoints
- Enter starting location via coordinates or address
- Optimize route using Traveling Salesman Problem (TSP) algorithm
- Display route on an interactive map
- Export optimized route to Google Maps
- Modern, responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cacheroute.git
cd cacheroute
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

1. Upload a GPX file containing waypoints using the file upload button
2. Enter your starting location using either:
   - Latitude/Longitude coordinates
   - Street address (geocoded using OpenStreetMap)
3. Click "Optimize Route" to calculate the most efficient path
4. View the optimized route on the map
5. Click "Export to Google Maps" to open the route in Google Maps

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet (mapping)
- OpenStreetMap (geocoding)
- GPX Parser

## License

MIT License - See LICENSE file for details
