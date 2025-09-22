import '@testing-library/jest-dom'

// Mock fetch globally to prevent any actual network requests
global.fetch = jest.fn(() =>
  Promise.reject(new Error('Unmocked fetch call detected. All fetch calls should be mocked in tests.'))
)

// Mock console methods to keep test output clean
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks()
  
  // Restore console.error for specific tests that need to verify it
  if (global.console.error.mockRestore) {
    global.console.error.mockRestore()
  }
  global.console.error = jest.fn()
})