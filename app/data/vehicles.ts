export interface AdditionalImage {
  title: string;
  url: string;
}

export interface Vehicle {
  updatedAt?: string;
  updatedBy?: string;
  firstPublishedDate?: string;
  vehicleId: string;
  modelYear?: number;
  vehicleYear?: number;
  bodyType?: string;
  colour?: string;
  doors?: number;
  engineCapacityCc?: number;
  fuelType?: string;
  vrm?: string;
  published?: boolean;
  isReserved?: boolean;
  make: string;
  mileage?: number;
  price: number;
  seats?: number;
  model?: string;
  stockType?: string;
  trim?: string;
  variant?: string;
  thumbnailUrl?: string;
  additionalImages?: AdditionalImage[];
  transmissionType?: string;
  milesPerGallon?: number;
  driveType?: string;
  tags?: string[];
  discountInPence?: number;
  depositContributionInPence?: number;
  promotionId?: string | null;
  site?: string;
  priceIncludingAdminFee?: number;
  engineSize?: number;
  fullRegistration?: string;
  isAvailable?: boolean;
  selectedModel?: string;
  quoteType?: string;
  quoteAnnualMiles?: number;
  quoteBalanceInPence?: number;
  quoteApr?: number;
  quoteRegularPaymentInPence?: number;
  quoteTermMonths?: number;
  quoteDepositInPence?: number;
  quoteChargesInPence?: number;
  quoteResidualValueInPence?: number;
  quoteExcessMileage?: string;
  isAvailableInStore?: boolean;
}

export interface ApiResponse {
  pageNumber: number;
  pageSize: number;
  searchResultsCount: number;
  vehicleListings: Vehicle[];
}

export async function fetchVehicles(
  page: number = 1, 
  pageSize: number = 32, 
  make?: string
): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (make && make !== 'All Makes') {
      params.append('make', make);
    }

    const response = await fetch(
      `https://search-api.snc-prod.aws.cinch.co.uk/vehicles?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}