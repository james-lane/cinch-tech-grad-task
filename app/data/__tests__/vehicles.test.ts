import { fetchVehicles, Vehicle, ApiResponse } from '../vehicles'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('vehicles.ts', () => {
  describe('fetchVehicles function', () => {
    const mockApiResponse: ApiResponse = {
      pageNumber: 1,
      pageSize: 32,
      searchResultsCount: 100,
      vehicleListings: [
        {
          vehicleId: '1',
          make: 'BMW',
          price: 25000,
          thumbnailUrl: 'https://example.com/image.jpg'
        },
        {
          vehicleId: '2',
          make: 'Audi',
          price: 30000,
          thumbnailUrl: 'https://example.com/image2.jpg'
        }
      ]
    }

    beforeEach(() => {
      mockFetch.mockClear()
    })

    it('should fetch vehicles with default parameters', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // Act
      const result = await fetchVehicles()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://search-api.snc-prod.aws.cinch.co.uk/vehicles?pageNumber=1&pageSize=32',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('should fetch vehicles with custom page and pageSize', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // Act
      const result = await fetchVehicles(2, 50)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://search-api.snc-prod.aws.cinch.co.uk/vehicles?pageNumber=2&pageSize=50',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('should include make parameter when provided', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // Act
      const result = await fetchVehicles(1, 32, 'BMW')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://search-api.snc-prod.aws.cinch.co.uk/vehicles?pageNumber=1&pageSize=32&make=BMW',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('should not include make parameter when "All Makes" is provided', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // Act
      const result = await fetchVehicles(1, 32, 'All Makes')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://search-api.snc-prod.aws.cinch.co.uk/vehicles?pageNumber=1&pageSize=32',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('should not include make parameter when empty string is provided', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      // Act
      const result = await fetchVehicles(1, 32, '')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://search-api.snc-prod.aws.cinch.co.uk/vehicles?pageNumber=1&pageSize=32',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('should throw error when API returns non-ok status', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      // Act & Assert
      await expect(fetchVehicles()).rejects.toThrow('HTTP error! status: 404')
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should throw error when fetch fails', async () => {
      // Arrange
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      // Act & Assert
      await expect(fetchVehicles()).rejects.toThrow('Network error')
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should log error and re-throw when fetch fails', async () => {
      // Arrange
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      // Act & Assert
      await expect(fetchVehicles()).rejects.toThrow('Network error')
      expect(console.error).toHaveBeenCalledWith('Error fetching vehicles:', networkError)
    })

    it('should handle API response with empty vehicle listings', async () => {
      // Arrange
      const emptyResponse: ApiResponse = {
        pageNumber: 1,
        pageSize: 32,
        searchResultsCount: 0,
        vehicleListings: []
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response)

      // Act
      const result = await fetchVehicles()

      // Assert
      expect(result).toEqual(emptyResponse)
      expect(result.vehicleListings).toHaveLength(0)
    })

    it('should handle vehicles with missing optional thumbnailUrl', async () => {
      // Arrange
      const responseWithoutThumbnail: ApiResponse = {
        pageNumber: 1,
        pageSize: 32,
        searchResultsCount: 1,
        vehicleListings: [
          {
            vehicleId: '1',
            make: 'BMW',
            price: 25000
            // thumbnailUrl is optional and missing
          }
        ]
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithoutThumbnail,
      } as Response)

      // Act
      const result = await fetchVehicles()

      // Assert
      expect(result).toEqual(responseWithoutThumbnail)
      expect(result.vehicleListings[0]).not.toHaveProperty('thumbnailUrl')
    })
  })

  describe('Vehicle interface', () => {
    it('should allow creation of valid Vehicle objects', () => {
      // Arrange & Act
      const vehicle: Vehicle = {
        vehicleId: 'test-id',
        make: 'BMW',
        price: 25000,
        thumbnailUrl: 'https://example.com/image.jpg'
      }

      // Assert
      expect(vehicle.vehicleId).toBe('test-id')
      expect(vehicle.make).toBe('BMW')
      expect(vehicle.price).toBe(25000)
      expect(vehicle.thumbnailUrl).toBe('https://example.com/image.jpg')
    })

    it('should allow Vehicle objects without optional thumbnailUrl', () => {
      // Arrange & Act
      const vehicle: Vehicle = {
        vehicleId: 'test-id',
        make: 'Audi',
        price: 30000
      }

      // Assert
      expect(vehicle.vehicleId).toBe('test-id')
      expect(vehicle.make).toBe('Audi')
      expect(vehicle.price).toBe(30000)
      expect(vehicle.thumbnailUrl).toBeUndefined()
    })
  })

  describe('ApiResponse interface', () => {
    it('should allow creation of valid ApiResponse objects', () => {
      // Arrange & Act
      const apiResponse: ApiResponse = {
        pageNumber: 1,
        pageSize: 32,
        searchResultsCount: 100,
        vehicleListings: [
          {
            vehicleId: '1',
            make: 'BMW',
            price: 25000,
            thumbnailUrl: 'https://example.com/image.jpg'
          }
        ]
      }

      // Assert
      expect(apiResponse.pageNumber).toBe(1)
      expect(apiResponse.pageSize).toBe(32)
      expect(apiResponse.searchResultsCount).toBe(100)
      expect(apiResponse.vehicleListings).toHaveLength(1)
      expect(apiResponse.vehicleListings[0].make).toBe('BMW')
    })
  })
})