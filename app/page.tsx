"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import Link from "next/link";
import RiderSelector from "@/components/RiderSelector";
import DateRangePicker from "@/components/DateRangePicker";
import PerformanceReport from "@/components/PerformanceReport";
import { Rider, PerformanceMetrics } from "@/types";

export default function Home() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState("");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [riderName, setRiderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch riders on component mount
  useEffect(() => {
    async function loadRiders() {
      try {
        const response = await fetch("/api/riders");
        if (!response.ok) throw new Error("Failed to fetch riders");
        const data = await response.json();
        setRiders(data);
      } catch (err) {
        setError(
          "Failed to load riders. Please check your Airtable configuration."
        );
        console.error(err);
      }
    }
    loadRiders();
  }, []);

  // Fetch performance metrics when rider or dates change
  const fetchPerformance = async () => {
    if (!selectedRider || !startDate || !endDate) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/riders/${selectedRider}/performance?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) throw new Error("Failed to fetch performance data");

      const data = await response.json();
      setMetrics(data.metrics);
      setRiderName(data.rider.name);
    } catch (err) {
      setError("Failed to load performance data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Reliability Tracker
              </h1>
              <p className="text-gray-600">
                Track and analyze rider performance metrics over time
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/riders"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Manage Riders
            </Link>
            <Link
              href="/zones"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Manage Zones
            </Link>
            <Link
              href="/input"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Add Data
            </Link>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <RiderSelector
            riders={riders}
            selectedRider={selectedRider}
            onSelectRider={setSelectedRider}
          />

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <button
            onClick={fetchPerformance}
            disabled={!selectedRider || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? "Loading..." : "Generate Performance Report"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Performance Report */}
        {metrics && riderName && (
          <div className="animate-fadeIn">
            <PerformanceReport riderName={riderName} metrics={metrics} />
          </div>
        )}

        {/* Instructions */}
        {!metrics && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Getting Started
            </h3>
            <ul className="text-blue-800 space-y-2 list-disc list-inside">
              <li>Select a rider from the dropdown menu</li>
              <li>Choose a date range for the performance period</li>
              <li>Click Generate Performance Report to view metrics</li>
              <li>
                The system will calculate scores based on punctuality,
                availability, and delivery performance
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
