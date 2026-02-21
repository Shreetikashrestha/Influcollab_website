import { registerUser, loginUser, fetchWhoAmI, updateUserProfile } from '@/lib/api/auth'
import axios from '@/lib/api/axios'

// Mock axios
jest.mock('@/lib/api/axios')

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    it('successfully registers a user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registration successful',
          data: {
            userId: '123',
            email: 'test@example.com'
          }
        }
      }
      ;(axios.post as jest.Mock).mockResolvedValue(mockResponse)

      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'influencer'
      }

      const result = await registerUser(registerData)

      expect(axios.post).toHaveBeenCalledWith('api/auth/register', registerData)
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error on registration failure', async () => {
      const errorMessage = 'Email already exists'
      ;(axios.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage
          }
        }
      })

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'influencer'
      }

      await expect(registerUser(registerData)).rejects.toThrow(errorMessage)
    })

    it('throws fallback error when no error message', async () => {
      ;(axios.post as jest.Mock).mockRejectedValue(new Error())

      await expect(registerUser({})).rejects.toThrow('Registration failed')
    })
  })

  describe('loginUser', () => {
    it('successfully logs in a user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            token: 'test-token',
            user: {
              userId: '123',
              email: 'test@example.com'
            }
          }
        }
      }
      ;(axios.post as jest.Mock).mockResolvedValue(mockResponse)

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await loginUser(loginData)

      expect(axios.post).toHaveBeenCalledWith('api/auth/login', loginData)
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error on login failure', async () => {
      const errorMessage = 'Invalid credentials'
      ;(axios.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage
          }
        }
      })

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      await expect(loginUser(loginData)).rejects.toThrow(errorMessage)
    })

    it('throws fallback error when no error message', async () => {
      ;(axios.post as jest.Mock).mockRejectedValue(new Error())

      await expect(loginUser({})).rejects.toThrow('Login failed')
    })
  })

  describe('fetchWhoAmI', () => {
    it('successfully fetches user info', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            userId: '123',
            email: 'test@example.com',
            fullName: 'Test User'
          }
        }
      }
      ;(axios.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await fetchWhoAmI()

      expect(axios.get).toHaveBeenCalledWith('api/auth/whoami')
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error on fetch failure', async () => {
      const errorMessage = 'Unauthorized'
      ;(axios.get as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage
          }
        }
      })

      await expect(fetchWhoAmI()).rejects.toThrow(errorMessage)
    })

    it('throws fallback error when no error message', async () => {
      ;(axios.get as jest.Mock).mockRejectedValue(new Error())

      await expect(fetchWhoAmI()).rejects.toThrow('Fetching user info failed')
    })
  })

  describe('updateUserProfile', () => {
    it('successfully updates user profile', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Profile updated',
          data: {
            userId: '123',
            fullName: 'Updated Name'
          }
        }
      }
      ;(axios.put as jest.Mock).mockResolvedValue(mockResponse)

      const updateData = {
        fullName: 'Updated Name'
      }

      const result = await updateUserProfile(updateData)

      expect(axios.put).toHaveBeenCalledWith(
        'api/users/update',
        updateData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error on update failure', async () => {
      const errorMessage = 'Update failed'
      ;(axios.put as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage
          }
        }
      })

      await expect(updateUserProfile({})).rejects.toThrow(errorMessage)
    })

    it('throws fallback error when no error message', async () => {
      ;(axios.put as jest.Mock).mockRejectedValue(new Error())

      await expect(updateUserProfile({})).rejects.toThrow('Update profile failed')
    })
  })
})
