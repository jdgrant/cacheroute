import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Coordinates } from '../types';
import GpxParser from 'gpxparser';

interface FileUploadProps {
  onUpload: (coordinates: Coordinates[]) => void;
}

interface GpxPoint {
  lat: number;
  lon: number;
}

interface GpxTrack {
  points: GpxPoint[];
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pointCount, setPointCount] = useState<number>(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const gpx = new GpxParser();
      gpx.parse(e.target?.result as string);
      
      // Get coordinates from tracks
      const trackCoordinates: Coordinates[] = gpx.tracks.flatMap((track: GpxTrack) =>
        track.points.map((point: GpxPoint) => ({
          lat: point.lat,
          lon: point.lon
        }))
      );

      // Get coordinates from waypoints
      const waypointCoordinates: Coordinates[] = gpx.waypoints.map((point: GpxPoint) => ({
        lat: point.lat,
        lon: point.lon
      }));

      // Combine both sets of coordinates
      const allCoordinates = [...trackCoordinates, ...waypointCoordinates];

      setPointCount(allCoordinates.length);
      onUpload(allCoordinates);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Upload GPX File
        <span className="block text-xs text-gray-500 mt-1">
          The first point will be used as the starting location
        </span>
      </label>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".gpx"
          className="hidden"
          id="gpx-upload"
        />
        <label
          htmlFor="gpx-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Choose File
        </label>
        <span className="ml-3 text-sm text-gray-500">
          {fileInputRef.current?.files?.[0]?.name || 'No file selected'}
          {pointCount > 0 && ` (${pointCount} points)`}
        </span>
      </div>
    </div>
  );
};

export default FileUpload; 