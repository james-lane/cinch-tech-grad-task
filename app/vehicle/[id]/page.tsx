"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchVehicles, Vehicle, ApiResponse } from "../../data/vehicles";

interface VehicleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setVehicleId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!vehicleId) return;

    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response: ApiResponse = await fetchVehicles(1, 100);
        const foundVehicle = response.vehicleListings.find(
          (v) => v.vehicleId === vehicleId
        );
        
        if (foundVehicle) {
          setVehicle(foundVehicle);
        } else {
          setError("Vehicle not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicle');
        console.error('Error loading vehicle:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    src="/cinch-logo.png"
                    alt="Cinch Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-1/4"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    src="/cinch-logo.png"
                    alt="Cinch Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error || "Vehicle not found"}</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to vehicles
          </Link>
        </main>
      </div>
    );
  }

  const imageUrl = vehicle.thumbnailUrl || '/api/placeholder/800/600';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/cinch-logo.png"
                  alt="Cinch Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to vehicles
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <Image
              src={imageUrl}
              alt={`${vehicle.make} vehicle`}
              width={800}
              height={600}
              className="w-full h-96 object-cover"
              unoptimized={vehicle.thumbnailUrl ? true : false}
              priority
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {vehicle.make}
            </h1>

            <div className="text-5xl font-bold text-gray-900">
              £{vehicle.price.toLocaleString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}