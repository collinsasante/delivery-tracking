'use client';

import { PerformanceMetrics } from '@/types';

interface PerformanceReportProps {
  riderName: string;
  metrics: PerformanceMetrics;
}

export default function PerformanceReport({ riderName, metrics }: PerformanceReportProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Overall Performance — {riderName}
        </h1>
      </div>

      {/* Work Period */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Work Period</span>
          <span className="text-gray-900 font-semibold">{metrics.workPeriod}</span>
        </div>
      </div>

      {/* Average Ride Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Average Ride Score</span>
          <span className="text-3xl font-bold text-blue-600">
            {metrics.averageRideScore} / 10
          </span>
        </div>
      </div>

      {/* Total Trips */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Trips</span>
          <span className="text-gray-900 font-bold text-2xl">{metrics.totalTrips}</span>
        </div>
      </div>

      {/* Top Day */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Top Day</span>
          <span className="text-gray-900 font-semibold">
            {metrics.topDay.date}{' '}
            <span className="text-green-600">(Score: {metrics.topDay.score})</span>
          </span>
        </div>
      </div>

      {/* Most Frequent Zone */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium">Most Frequent Zone</span>
          <span className="text-gray-900 font-semibold text-right">
            {metrics.mostFrequentZone}
          </span>
        </div>
      </div>

      {/* Punctuality */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium">Punctuality</span>
          <div className="text-right">
            {metrics.punctuality.reportsBefore830 ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="text-gray-900 font-semibold">
                  Reports before 8:30 a.m. daily
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-gray-900 font-semibold">
                  {metrics.punctuality.punctualDaysCount} / {metrics.punctuality.totalDays} days
                  punctual
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium">Availability</span>
          <div className="text-right">
            {metrics.availability.isActive ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="text-gray-900 font-semibold">
                  Active and consistent on all {metrics.availability.activeDays} workdays
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-gray-900 font-semibold">
                  Active {metrics.availability.activeDays} / {metrics.availability.totalWorkdays}{' '}
                  workdays
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="mt-8 pt-6 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-bold text-xl">Overall Rating</span>
          <span className="text-4xl font-bold text-blue-600">
            {metrics.overallRating} / 10
          </span>
        </div>
      </div>

      {/* Rating Visual */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(metrics.overallRating / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
