import type { Coordinates } from '../types';

export function generateGPX(startLocation: Coordinates, waypoints: Coordinates[]): string {
  const points = [startLocation, ...waypoints];
  const date = new Date().toISOString();
  
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="cacheroute.io"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Optimized Geocaching Route</name>
    <time>${date}</time>
  </metadata>
  ${points.map((point, index) => `
  <wpt lat="${point.lat}" lon="${point.lon}">
    <name>Point ${index + 1}</name>
    <time>${date}</time>
  </wpt>`).join('')}
</gpx>`;

  return gpx;
}

export function downloadGPX(gpxContent: string, filename: string = 'optimized-route.gpx'): void {
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 