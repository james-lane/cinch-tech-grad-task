export interface Vehicle {
  vehicleId: string;
  make: string;
  price: number;
  thumbnailUrl?: string;
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