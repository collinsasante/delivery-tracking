'use client';

import { Rider } from '@/types';

interface RiderSelectorProps {
  riders: Rider[];
  selectedRider: string;
  onSelectRider: (riderId: string) => void;
}

export default function RiderSelector({
  riders,
  selectedRider,
  onSelectRider,
}: RiderSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="rider-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Rider
      </label>
      <select
        id="rider-select"
        value={selectedRider}
        onChange={(e) => onSelectRider(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Choose a rider...</option>
        {riders.map((rider) => (
          <option key={rider.id} value={rider.id}>
            {rider.name} ({rider.riderId})
          </option>
        ))}
      </select>
    </div>
  );
}
