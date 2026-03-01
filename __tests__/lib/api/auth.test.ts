import { loginUser, registerUser, fetchWhoAmI, updateUserProfile, changePassword } from '@/lib/api/auth'
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
            user: { _id: '123', email: 'test@example.com', fullName: 'Test User' }
          }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await loginUser({ email: 'test@example.com', password: 'password123' })
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failed login', async () => {
      mockedAxios.post.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } }
      })

      await expect(loginUser({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials')
    })

    it('should throw fallback error when no backend message', async () => {
      mockedAxios.post.mockRejectedValue({ message: 'Network Error' })
      await expect(loginUser({ email: 'a@b.com', password: 'x' })).rejects.toThrow('Network Error')
    })

    it('should use default fallback message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(loginUser({ email: 'a@b.com', password: 'x' })).rejects.toThrow()
    })
  })

  describe('registerUser', () => {
    it('should register new user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { token: 'mock-token', user: { _id: '123', email: 'new@example.com', fullName: 'New User' } }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await registerUser({ email: 'new@example.com', password: 'password123', fullName: 'New User', isInfluencer: false })
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when email already exists', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Email already exists' } } })
      await expect(registerUser({ email: 'x@y.com', password: 'p' })).rejects.toThrow('Email already exists')
    })

    it('should use fallback message on registration failure', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(registerUser({ email: 'x@y.com', password: 'p' })).rejects.toThrow()
    })
  })

  describe('fetchWhoAmI', () => {
    it('should fetch current user data', async () => {
      const mockResponse = {
        data: { success: true, data: { _id: '123', email: 'test@example.com', fullName: 'Test User' } }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchWhoAmI()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when unauthorized', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(fetchWhoAmI()).rejects.toThrow('Unauthorized')
    })

    it('should use fallback message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchWhoAmI()).rejects.toThrow()
    })
  })

  describe('updateUserProfile', () => {
    it('should update profile successfully', async () => {
      const mockResponse = {
        data: { success: true, data: { _id: '123', fullName: 'Updated User' } }
      }
      mockedAxios.put.mockResolvedValue(mockResponse)
      const result = await updateUserProfile({ fullName: 'Updated User' })
      expect(mockedAxios.put).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should send multipart/form-data header', async () => {
      mockedAxios.put.mockResolvedValue({ data: { success: true } })
      await updateUserProfile({ fullName: 'Test' })
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      )
    })

    it('should throw error on update failure', async () => {
      mockedAxios.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } })
      await expect(updateUserProfile({ fullName: 'Test' })).rejects.toThrow('Update failed')
    })
  })

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockResponse = { data: { success: true, message: 'Password changed' } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await changePassword('oldpass', 'newpass')
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), { currentPassword: 'oldpass', newPassword: 'newpass' })
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when current password is wrong', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Current password is incorrect' } } })
      await expect(changePassword('wrong', 'newpass')).rejects.toThrow('Current password is incorrect')
    })

    it('should use fallback message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(changePassword('a', 'b')).rejects.toThrow()
    })
  })
})
