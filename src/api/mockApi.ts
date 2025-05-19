import type { Coordinates, RouteData, OptimizedRoute } from '../types';

// Simple nearest neighbor algorithm for demonstration
function nearestNeighbor(start: Coordinates, points: Coordinates[]): number[] {
  const unvisited = [...Array(points.length).keys()];
  const route: number[] = [];
  let currentPoint = start;

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (const index of unvisited) {
      const point = points[index];
      const distance = calculateDistance(currentPoint, point);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    }

    route.push(nearestIndex);
    currentPoint = points[nearestIndex];
    unvisited.splice(unvisited.indexOf(nearestIndex), 1);
  }

  return route;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

async function getRoutePoints(start: Coordinates, end: Coordinates): Promise<Coordinates[]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    // Extract coordinates from the route geometry
    return data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
      lat: coord[1],
      lon: coord[0]
    }));
  } catch (error) {
    console.error('Failed to get route:', error);
    // Fallback to direct line if routing fails
    return [start, end];
  }
}

export async function optimizeRoute(routeData: RouteData): Promise<OptimizedRoute> {
  const { start, waypoints } = routeData;

  // Simple nearest neighbor algorithm
  const unvisited = [...waypoints];
  const visited: Coordinates[] = [];
  const order: number[] = [];
  let current = start;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Number.MAX_VALUE;

    // Find the nearest unvisited point
    for (let i = 0; i < unvisited.length; i++) {
      const dist = Math.sqrt(
        Math.pow(current.lat - unvisited[i].lat, 2) +
        Math.pow(current.lon - unvisited[i].lon, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    // Add the nearest point to the route
    const nextPoint = unvisited[nearestIdx];
    visited.push(nextPoint);
    order.push(waypoints.indexOf(nextPoint));
    unvisited.splice(nearestIdx, 1);
    current = nextPoint;
  }

  // Get detailed route points between each pair of points
  const detailedRoute: Coordinates[] = [];
  let previousPoint = start;

  for (const point of visited) {
    const routeSegment = await getRoutePoints(previousPoint, point);
    // Add all points except the last one (it will be added as the start of the next segment)
    detailedRoute.push(...routeSegment.slice(0, -1));
    previousPoint = point;
  }
  // Add the final point
  detailedRoute.push(visited[visited.length - 1]);

  return {
    order,
    waypoints: detailedRoute
  };
} 