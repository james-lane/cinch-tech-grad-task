"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import VehicleCard from "./components/VehicleCard";
import { fetchVehicles, Vehicle, ApiResponse } from "./data/vehicles";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMake, setSelectedMake] = useState<string>('All Makes');
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);

  const loadVehicles = async (make?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse = await fetchVehicles(1, 32, make);
      setVehicles(response.vehicleListings || []);
      setTotalCount(response.searchResultsCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMakes = async () => {
    try {
      const response: ApiResponse = await fetchVehicles(1, 1);
      const data = response as any;
      if (data.facets && data.facets.makes) {
        const makes = data.facets.makes.map((make: any) => make.name).sort();
        setAvailableMakes(['All Makes', ...makes]);
      }
    } catch (err) {
      console.error('Error loading makes:', err);
    }
  };

  useEffect(() => {
    loadVehicles();
    loadMakes();
  }, []);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    loadVehicles(make === 'All Makes' ? undefined : make);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/cinch-logo.png"
                alt="Cinch Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Find a car</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Part exchange</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Car finance</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Help</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All of the essentials sorted</h2>
          <p className="text-xl text-gray-600 mb-2">The biggest range, free 90-day warranty</p>
          {totalCount > 0 && (
            <p className="text-sm text-gray-500">{totalCount.toLocaleString()} cars available</p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              value={selectedMake}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">Error loading vehicles: {error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))}
          </div>
        )}

        {!loading && vehicles.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vehicles found</p>
          </div>
        )}
      </main>
    </div>
  );
}
