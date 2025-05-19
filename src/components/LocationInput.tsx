import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Coordinates } from '../types';

interface LocationInputProps {
  onSubmit: (location: Coordinates) => void;
  defaultLocation?: Coordinates | null;
}

const LocationInput = ({ onSubmit, defaultLocation }: LocationInputProps) => {
  const [inputType, setInputType] = useState<'coordinates' | 'address'>('coordinates');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultLocation) {
      setLat(defaultLocation.lat.toString());
      setLon(defaultLocation.lon.toString());
    }
  }, [defaultLocation]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (inputType === 'coordinates') {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('Invalid coordinates');
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          throw new Error('Coordinates out of range');
        }

        onSubmit({ lat: latitude, lon: longitude });
      } else {
        // Using OpenStreetMap Nominatim API for geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error('Address not found');
        }

        onSubmit({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setInputType('coordinates')}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            inputType === 'coordinates'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Coordinates
        </button>
        <button
          type="button"
          onClick={() => setInputType('address')}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            inputType === 'address'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Address
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputType === 'coordinates' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                step="any"
                className="input-field w-full"
                placeholder="-90 to 90"
                required
              />
            </div>
            <div>
              <label htmlFor="lon" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="lon"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                step="any"
                className="input-field w-full"
                placeholder="-180 to 180"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field"
              placeholder="Enter address"
              required
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Set Starting Location
        </button>
      </form>
    </div>
  );
};

export default LocationInput; 