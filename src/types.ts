export interface Coordinates {
  lat: number;
  lon: number;
}

export interface RouteData {
  start: Coordinates;
  waypoints: Coordinates[];
}

export interface OptimizedRoute {
  order: number[];
  waypoints: Coordinates[];
} 