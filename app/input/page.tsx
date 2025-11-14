'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Rider, Zone } from '@/types';
import Link from 'next/link';
import { autoCalculateDistance, calculateExpectedDeliveryTime } from '@/lib/distance-calculator';

export default function InputPage() {
  const [activeTab, setActiveTab] = useState<'trip' | 'daily'>('trip');
  const [riders, setRiders] = useState<Rider[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Trip form state
  const [tripForm, setTripForm] = useState({
    rider: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    period: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupTime: '',
    arrivalTime: '',
    deliveryTimeRider: '',
    deliveryTimeCustomer: '',
    distance: '',
    expectedDeliveryTime: '',
    customerConfirmed: false,
    notes: '',
  });

  // Daily summary form state
  const [dailyForm, setDailyForm] = useState({
    rider: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    reportingTime: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [ridersRes, zonesRes] = await Promise.all([
          fetch('/api/riders'),
          fetch('/api/zones'),
        ]);

        const ridersData = await ridersRes.json();
        const zonesData = await zonesRes.json();

        setRiders(ridersData);
        setZones(zonesData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Auto-calculate distance when zones are selected
  useEffect(() => {
    if (tripForm.pickupLocation && tripForm.deliveryLocation) {
      const pickupZone = zones.find(z => z.id === tripForm.pickupLocation);
      const deliveryZone = zones.find(z => z.id === tripForm.deliveryLocation);

      const calculatedDistance = autoCalculateDistance(pickupZone || null, deliveryZone || null);

      if (calculatedDistance !== null) {
        setTripForm(prev => ({
          ...prev,
          distance: calculatedDistance.toString(),
          expectedDeliveryTime: calculateExpectedDeliveryTime(calculatedDistance).toString(),
        }));
      }
    }
  }, [tripForm.pickupLocation, tripForm.deliveryLocation, zones]);

  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider: [tripForm.rider],
          date: tripForm.date,
          period: tripForm.period || undefined,
          pickupLocation: tripForm.pickupLocation ? [tripForm.pickupLocation] : undefined,
          deliveryLocation: tripForm.deliveryLocation ? [tripForm.deliveryLocation] : undefined,
          pickupTime: tripForm.pickupTime || undefined,
          arrivalTime: tripForm.arrivalTime || undefined,
          deliveryTimeRider: tripForm.deliveryTimeRider || undefined,
          deliveryTimeCustomer: tripForm.deliveryTimeCustomer || undefined,
          distance: tripForm.distance ? parseFloat(tripForm.distance) : undefined,
          expectedDeliveryTime: tripForm.expectedDeliveryTime
            ? parseInt(tripForm.expectedDeliveryTime)
            : undefined,
          customerConfirmed: tripForm.customerConfirmed,
          notes: tripForm.notes || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create trip');

      setSuccess('Trip created successfully!');
      // Reset form
      setTripForm({
        rider: tripForm.rider,
        date: format(new Date(), 'yyyy-MM-dd'),
        period: tripForm.period,
        pickupLocation: '',
        deliveryLocation: '',
        pickupTime: '',
        arrivalTime: '',
        deliveryTimeRider: '',
        deliveryTimeCustomer: '',
        distance: '',
        expectedDeliveryTime: '',
        customerConfirmed: false,
        notes: '',
      });
    } catch (err) {
      setError('Failed to create trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/daily-summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider: [dailyForm.rider],
          date: dailyForm.date,
          reportingTime: dailyForm.reportingTime || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create daily summary');

      setSuccess('Daily summary created successfully!');
      // Reset form
      setDailyForm({
        rider: dailyForm.rider,
        date: format(new Date(), 'yyyy-MM-dd'),
        reportingTime: '',
      });
    } catch (err) {
      setError('Failed to create daily summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Data Input</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('trip')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'trip'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Trip
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'daily'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Daily Summary
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-md p-6">
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

          {activeTab === 'trip' ? (
            <form onSubmit={handleTripSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rider *
                  </label>
                  <select
                    required
                    value={tripForm.rider}
                    onChange={(e) => setTripForm({ ...tripForm, rider: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select rider...</option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    required
                    type="date"
                    value={tripForm.date}
                    onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <input
                    type="text"
                    value={tripForm.period}
                    onChange={(e) => setTripForm({ ...tripForm, period: e.target.value })}
                    placeholder="e.g., 06/11/2025 – 12/11/2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <select
                    value={tripForm.pickupLocation}
                    onChange={(e) => setTripForm({ ...tripForm, pickupLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select zone...</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zoneName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <select
                    value={tripForm.deliveryLocation}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, deliveryLocation: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select zone...</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zoneName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    value={tripForm.pickupTime}
                    onChange={(e) => setTripForm({ ...tripForm, pickupTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Time
                  </label>
                  <input
                    type="datetime-local"
                    value={tripForm.arrivalTime}
                    onChange={(e) => setTripForm({ ...tripForm, arrivalTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time (Rider)
                  </label>
                  <input
                    type="datetime-local"
                    value={tripForm.deliveryTimeRider}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, deliveryTimeRider: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time (Customer)
                  </label>
                  <input
                    type="datetime-local"
                    value={tripForm.deliveryTimeCustomer}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, deliveryTimeCustomer: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={tripForm.distance}
                      onChange={(e) => setTripForm({ ...tripForm, distance: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-green-50"
                    />
                    {tripForm.distance && (
                      <span className="absolute right-3 top-2 text-xs text-green-600 font-medium">
                        ✓ Auto-calculated
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-calculated when zones are selected. You can edit if needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Time (mins)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tripForm.expectedDeliveryTime}
                      onChange={(e) =>
                        setTripForm({ ...tripForm, expectedDeliveryTime: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-green-50"
                    />
                    {tripForm.expectedDeliveryTime && (
                      <span className="absolute right-3 top-2 text-xs text-green-600 font-medium">
                        ✓ Auto-calculated
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on distance and average speed of 30 km/h. You can edit if needed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="customerConfirmed"
                  checked={tripForm.customerConfirmed}
                  onChange={(e) =>
                    setTripForm({ ...tripForm, customerConfirmed: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="customerConfirmed" className="text-sm font-medium text-gray-700">
                  Customer Confirmed
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={tripForm.notes}
                  onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Create Trip'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleDailySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rider *
                  </label>
                  <select
                    required
                    value={dailyForm.rider}
                    onChange={(e) => setDailyForm({ ...dailyForm, rider: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select rider...</option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    required
                    type="date"
                    value={dailyForm.date}
                    onChange={(e) => setDailyForm({ ...dailyForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Time
                  </label>
                  <input
                    type="time"
                    value={dailyForm.reportingTime}
                    onChange={(e) => setDailyForm({ ...dailyForm, reportingTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Punctual if before 8:30 AM
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Create Daily Summary'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
