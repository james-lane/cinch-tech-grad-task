import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '../data/vehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageUrl = vehicle.thumbnailUrl || '/api/placeholder/300/200';

  return (
    <Link href={`/vehicle/${vehicle.vehicleId}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <Image
          src={imageUrl}
          alt={`${vehicle.make} vehicle`}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          unoptimized={vehicle.thumbnailUrl ? true : false}
        />

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {vehicle.modelYear} {vehicle.make} {vehicle.model}
          </h3>

          <p className="text-gray-900 capitalize mb-3">
            {`${vehicle.mileage} miles | ${vehicle.colour?.toLowerCase()} | ${
              vehicle.transmissionType
            } | ${vehicle.fuelType}`}
          </p>

          <p className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              £{vehicle.price.toLocaleString()}
            </span>

            <span className="text-xl font-bold text-gray-400">
              £{vehicle.quoteRegularPaymentInPence / 100} p/m
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
