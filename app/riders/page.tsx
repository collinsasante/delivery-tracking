'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Rider, Zone } from '@/types';
import Link from 'next/link';

export default function RidersPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [riderForm, setRiderForm] = useState({
    riderId: '',
    name: '',
    phone: '',
    zone: '',
    active: true,
    joinedDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [zonesRes, ridersRes] = await Promise.all([
        fetch('/api/zones'),
        fetch('/api/riders'),
      ]);

      const zonesData = await zonesRes.json();
      const ridersData = await ridersRes.json();

      setZones(Array.isArray(zonesData) ? zonesData : []);
      setRiders(Array.isArray(ridersData) ? ridersData : []);

      // Auto-generate next Rider ID
      if (Array.isArray(ridersData) && ridersData.length > 0) {
        const lastRider = ridersData[ridersData.length - 1];
        const lastIdNumber = parseInt(lastRider.riderId.replace(/\D/g, '')) || 0;
        const nextId = `R-${String(lastIdNumber + 1).padStart(3, '0')}`;
        setRiderForm(prev => ({ ...prev, riderId: nextId }));
      } else {
        setRiderForm(prev => ({ ...prev, riderId: 'R-001' }));
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/riders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderId: riderForm.riderId,
          name: riderForm.name,
          phone: riderForm.phone || undefined,
          zone: riderForm.zone ? [riderForm.zone] : undefined,
          active: riderForm.active,
          joinedDate: riderForm.joinedDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create rider');
      }

      setSuccess(`Rider "${riderForm.name}" created successfully!`);

      // Reset form
      setRiderForm({
        riderId: '',
        name: '',
        phone: '',
        zone: '',
        active: true,
        joinedDate: format(new Date(), 'yyyy-MM-dd'),
      });

      // Reload riders list and auto-generate new ID
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create rider');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Riders</h1>
            <p className="text-gray-600">Add new riders and view existing ones</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Rider Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Rider</h2>

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
                  Rider ID * (Auto-generated)
                </label>
                <input
                  required
                  type="text"
                  value={riderForm.riderId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Automatically generated unique identifier
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={riderForm.name}
                  onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={riderForm.phone}
                  onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                  placeholder="e.g., +233 123 456 789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Zone
                </label>
                <select
                  value={riderForm.zone}
                  onChange={(e) => setRiderForm({ ...riderForm, zone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select zone (optional)</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.zoneName}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Primary delivery zone for this rider
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joined Date
                </label>
                <input
                  type="date"
                  value={riderForm.joinedDate}
                  onChange={(e) => setRiderForm({ ...riderForm, joinedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={riderForm.active}
                  onChange={(e) => setRiderForm({ ...riderForm, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active (currently employed)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Creating Rider...' : 'Add Rider'}
              </button>
            </form>
          </div>

          {/* Riders List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Riders ({riders.length})
            </h2>

            {riders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">👥</div>
                <p className="text-gray-600">No riders added yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Add your first rider using the form
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {riders.map((rider) => (
                  <div
                    key={rider.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{rider.name}</h3>
                          {rider.active ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">ID: {rider.riderId}</p>
                        {rider.phone && (
                          <p className="text-sm text-gray-600">📞 {rider.phone}</p>
                        )}
                        {rider.joinedDate && (
                          <p className="text-sm text-gray-500">
                            Joined: {format(new Date(rider.joinedDate), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Riders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{riders.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Riders</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {riders.filter((r) => r.active).length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Zones</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{zones.length}</p>
              </div>
              <div className="text-4xl">📍</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
