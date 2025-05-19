import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinates, OptimizedRoute } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface RouteMapProps {
  startLocation: Coordinates | null;
  waypoints: Coordinates[];
  optimizedRoute: OptimizedRoute | null;
}

// Helper component to update map bounds
const MapBounds = ({ coordinates }: { coordinates: Coordinates[] }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(
        coordinates.map(coord => [coord.lat, coord.lon])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
};

const RouteMap = ({ startLocation, waypoints, optimizedRoute }: RouteMapProps) => {
  const allPoints = [
    ...(startLocation ? [startLocation] : []),
    ...waypoints
  ];

  const center = allPoints.length > 0
    ? [allPoints[0].lat, allPoints[0].lon]
    : [0, 0];

  const getRoutePoints = () => {
    if (!optimizedRoute || !startLocation) return [];
    
    return [
      [startLocation.lat, startLocation.lon],
      ...optimizedRoute.waypoints.map(wp => [wp.lat, wp.lon])
    ];
  };

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {startLocation && (
        <CircleMarker
          center={[startLocation.lat, startLocation.lon]}
          radius={8}
          fillColor="#2563eb"
          fillOpacity={1}
          color="#1d4ed8"
          weight={2}
        >
        </CircleMarker>
      )}

      {waypoints.map((point, index) => (
        <CircleMarker
          key={`waypoint-${index}`}
          center={[point.lat, point.lon]}
          radius={6}
          fillColor="#60a5fa"
          fillOpacity={1}
          color="#3b82f6"
          weight={2}
        >
        </CircleMarker>
      ))}

      {optimizedRoute && (
        <Polyline
          positions={getRoutePoints() as [number, number][]}
          color="#2563eb"
          weight={3}
          opacity={0.7}
        />
      )}

      <MapBounds coordinates={allPoints} />
    </MapContainer>
  );
};

export default RouteMap; 