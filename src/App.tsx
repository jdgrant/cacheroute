import { useState } from 'react'
import type { Coordinates, RouteData, OptimizedRoute } from './types'
import FileUpload from './components/FileUpload'
import LocationInput from './components/LocationInput'
import RouteMap from './components/RouteMap'
import { optimizeRoute } from './api/mockApi'

function App() {
  const [startLocation, setStartLocation] = useState<Coordinates | null>(null)
  const [waypoints, setWaypoints] = useState<Coordinates[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (coordinates: Coordinates[]) => {
    if (coordinates.length > 0) {
      const [firstPoint, ...remainingPoints] = coordinates
      setStartLocation(firstPoint)
      setWaypoints(remainingPoints)
    } else {
      setWaypoints([])
    }
    setOptimizedRoute(null)
    setError(null)
  }

  const handleLocationSubmit = (location: Coordinates) => {
    setStartLocation(location)
    setOptimizedRoute(null)
    setError(null)
  }

  const handleOptimizeRoute = async () => {
    if (!startLocation || waypoints.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const routeData: RouteData = {
        start: startLocation,
        waypoints
      }

      const result = await optimizeRoute(routeData)
      setOptimizedRoute(result)
    } catch (err) {
      setError('Failed to optimize route. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportToGoogleMaps = () => {
    if (!optimizedRoute || !startLocation) return
    
    // Format: origin/destination/waypoints
    const origin = `${startLocation.lat},${startLocation.lon}`
    const destination = `${optimizedRoute.waypoints[optimizedRoute.waypoints.length - 1].lat},${optimizedRoute.waypoints[optimizedRoute.waypoints.length - 1].lon}`
    
    // Remove the last waypoint as it's now the destination
    const intermediatePoints = optimizedRoute.waypoints
      .slice(0, -1)
      .map(wp => `${wp.lat},${wp.lon}`)
      .join('/')
    
    const url = `https://www.google.com/maps/dir/${origin}/${intermediatePoints ? intermediatePoints + '/' : ''}${destination}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#027D46] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">cacheroute.io</h1>
          <p className="mt-1 text-sm text-white">Optimize your geocaching adventures</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <FileUpload onUpload={handleFileUpload} />
              <LocationInput onSubmit={handleLocationSubmit} defaultLocation={startLocation} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleOptimizeRoute}
                  disabled={!startLocation || waypoints.length === 0 || isLoading}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Optimizing...' : 'Optimize Route'}
                </button>
                
                <button
                  onClick={handleExportToGoogleMaps}
                  disabled={!optimizedRoute}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export to Google Maps
                </button>
              </div>

              <div className="text-sm text-gray-500">
                {waypoints.length > 0 && (
                  <p>{waypoints.length} waypoints loaded</p>
                )}
                {startLocation && (
                  <p>Start location: {startLocation.lat.toFixed(6)}, {startLocation.lon.toFixed(6)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-[600px]">
            <RouteMap
              startLocation={startLocation}
              waypoints={waypoints}
              optimizedRoute={optimizedRoute}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
