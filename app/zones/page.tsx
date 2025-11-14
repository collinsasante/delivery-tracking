'use client';

import { useState, useEffect } from 'react';
import { Zone } from '@/types';
import Link from 'next/link';

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [zoneForm, setZoneForm] = useState({
    zoneName: '',
    defaultDistance: '',
    coordinates: '',
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const response = await fetch('/api/zones');
      const data = await response.json();
      setZones(data);
    } catch (err) {
      setError('Failed to load zones');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/zones/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName: zoneForm.zoneName,
          defaultDistance: zoneForm.defaultDistance ? parseFloat(zoneForm.defaultDistance) : undefined,
          coordinates: zoneForm.coordinates || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create zone');
      }

      setSuccess(`Zone "${zoneForm.zoneName}" created successfully!`);

      // Reset form
      setZoneForm({
        zoneName: '',
        defaultDistance: '',
        coordinates: '',
      });

      // Reload zones list
      loadZones();
    } catch (err: any) {
      setError(err.message || 'Failed to create zone');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Zones</h1>
            <p className="text-gray-600">Add delivery zones with GPS coordinates for accurate distance calculation</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Zone Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Zone</h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name *
                </label>
                <input
                  required
                  type="text"
                  value={zoneForm.zoneName}
                  onChange={(e) => setZoneForm({ ...zoneForm, zoneName: e.target.value })}
                  placeholder="e.g., Madina, Kasoa, Accra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPS Coordinates (Optional)
                </label>
                <input
                  type="text"
                  value={zoneForm.coordinates}
                  onChange={(e) => setZoneForm({ ...zoneForm, coordinates: e.target.value })}
                  placeholder="e.g., 5.6037,-0.1870"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: latitude,longitude (e.g., 5.6037,-0.1870 for Accra)
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  💡 Tip: Use Google Maps - right-click location → Click coordinates to copy
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Distance (km) (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={zoneForm.defaultDistance}
                  onChange={(e) => setZoneForm({ ...zoneForm, defaultDistance: e.target.value })}
                  placeholder="e.g., 15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Fallback distance used when coordinates aren't available
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  How Distance Calculation Works:
                </h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>If both zones have GPS coordinates → Uses precise calculation</li>
                  <li>If not → Uses pre-configured Ghana distance matrix</li>
                  <li>If not in matrix → Uses default distance from pickup zone</li>
                </ol>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Creating Zone...' : 'Add Zone'}
              </button>
            </form>
          </div>

          {/* Zones List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Zones ({zones.length})
            </h2>

            {zones.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">📍</div>
                <p className="text-gray-600">No zones added yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Add your first delivery zone using the form
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          📍 {zone.zoneName}
                        </h3>
                        {zone.coordinates && (
                          <div className="mb-1">
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                              ✓ GPS Enabled
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                              Coords: {zone.coordinates}
                            </p>
                          </div>
                        )}
                        {zone.defaultDistance && (
                          <p className="text-sm text-gray-600 mt-1">
                            Default Distance: {zone.defaultDistance} km
                          </p>
                        )}
                        {!zone.coordinates && !zone.defaultDistance && (
                          <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                            ⚠️ Using distance matrix
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Common Ghana Zone Coordinates Reference */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📌 Common Ghana Zone Coordinates (Reference)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Accra Central</h4>
              <p className="text-sm text-gray-600">5.6037,-0.1870</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Madina</h4>
              <p className="text-sm text-gray-600">5.6803,-0.1676</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Kasoa</h4>
              <p className="text-sm text-gray-600">5.5368,-0.4206</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Tema</h4>
              <p className="text-sm text-gray-600">5.6698,0.0166</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Legon</h4>
              <p className="text-sm text-gray-600">5.6507,-0.1870</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Achimota</h4>
              <p className="text-sm text-gray-600">5.6108,-0.2267</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Kumasi</h4>
              <p className="text-sm text-gray-600">6.6666,-1.6163</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <h4 className="font-semibold text-gray-900">Takoradi</h4>
              <p className="text-sm text-gray-600">4.8845,-1.7554</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            💡 Copy these coordinates to use for accurate distance calculations
          </p>
        </div>
      </div>
    </div>
  );
}
