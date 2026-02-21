// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder (required for Next.js)
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js cache
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn),
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()
  const mockPrefetch = jest.fn()
  const mockBack = jest.fn()
  
  return {
    useRouter: jest.fn(() => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: mockBack,
      pathname: '/',
      query: {},
      asPath: '/',
    })),
    usePathname: jest.fn(() => '/'),
    useSearchParams: jest.fn(() => new URLSearchParams()),
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}
