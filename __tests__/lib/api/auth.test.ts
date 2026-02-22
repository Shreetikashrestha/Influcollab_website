import { loginUser, registerUser, fetchWhoAmI } from '@/lib/api/auth'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loginUser', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'mock-token',
            user: {
              _id: '123',
              email: 'test@example.com',
              fullName: 'Test User'
            }
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await loginUser({ email: 'test@example.com', password: 'password123' })

      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failed login', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      })

      await expect(loginUser({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials')
    })
  })

  describe('registerUser', () => {
    it('should register new user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'mock-token',
            user: {
              _id: '123',
              email: 'new@example.com',
              fullName: 'New User'
            }
          }
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const userData = {
        email: 'new@example.com',
        password: 'password123',
        fullName: 'New User',
        isInfluencer: false
      }

      const result = await registerUser(userData)

      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('fetchWhoAmI', () => {
    it('should fetch current user data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: '123',
            email: 'test@example.com',
            fullName: 'Test User'
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await fetchWhoAmI()

      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })
  })
})
