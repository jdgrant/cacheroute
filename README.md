# Cacheroute.io

A web application for optimizing geocaching routes. Upload your GPX files or enter coordinates manually, and get an optimized route that follows actual roads.

## Features

- GPX file upload support
- Manual coordinate/address input
- Route optimization using nearest neighbor algorithm
- Road-following routes using OSRM
- Interactive map with Leaflet
- Export routes to Google Maps
- Modern UI with Tailwind CSS

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
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

4. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Usage

1. Upload a GPX file or enter coordinates manually
2. The first point will be set as the starting location
3. Click "Optimize Route" to generate the best path
4. Use "Export to Google Maps" to open the route in Google Maps

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet/React-Leaflet
- OSRM (Open Source Routing Machine)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
