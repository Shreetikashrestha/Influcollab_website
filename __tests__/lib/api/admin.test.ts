import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getAdminStats } from '@/lib/api/admin'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should fetch all users without filters', async () => {
      const mockResponse = {
        data: { success: true, users: [{ _id: '1', fullName: 'User 1' }], total: 1 }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await getAllUsers()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch users with search and pagination', async () => {
      const mockResponse = { data: { success: true, users: [], total: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await getAllUsers({ page: 1, limit: 10, search: 'test', role: 'user' })
      expect(mockedAxios.get).toHaveBeenCalled()
    })

    it('should fetch users filtered by influencer status', async () => {
      const mockResponse = { data: { success: true, users: [], total: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await getAllUsers({ isInfluencer: true })
      expect(mockedAxios.get).toHaveBeenCalled()
    })

    it('should return structured error on network failure', async () => {
      mockedAxios.get.mockRejectedValue({ code: 'ERR_NETWORK' })
      const result: any = await getAllUsers()
      expect(result.success).toBe(false)
      expect(result.message).toContain('Cannot connect to server')
    })

    it('should return structured error on 401', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 401 } })
      const result: any = await getAllUsers()
      expect(result.success).toBe(false)
      expect(result.message).toContain('Unauthorized')
    })

    it('should return structured error on 403', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 403 } })
      const result: any = await getAllUsers()
      expect(result.success).toBe(false)
      expect(result.message).toContain('Access denied')
    })

    it('should return general error response', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 500, data: { message: 'Server error' } } })
      const result: any = await getAllUsers()
      expect(result.success).toBe(false)
      expect(result.message).toBe('Server error')
    })
  })

  describe('getUserById', () => {
    it('should fetch user by ID', async () => {
      const mockResponse = { data: { success: true, data: { _id: '1', fullName: 'User' } } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await getUserById('1')
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when user not found', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'User not found' } } })
      await expect(getUserById('invalid')).rejects.toThrow('User not found')
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockResponse = { data: { success: true, data: { _id: 'new1' } } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const formData = new FormData()
      formData.append('email', 'new@test.com')
      formData.append('fullName', 'New User')
      const result = await createUser(formData)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        formData,
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Email exists' } } })
      await expect(createUser(new FormData())).rejects.toThrow('Email exists')
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.put.mockResolvedValue(mockResponse)
      const formData = new FormData()
      formData.append('fullName', 'Updated')
      const result = await updateUser('1', formData)
      expect(mockedAxios.put).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.put.mockRejectedValue({ response: { data: { message: 'Not authorized' } } })
      await expect(updateUser('1', new FormData())).rejects.toThrow('Not authorized')
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockResponse = { data: { success: true, message: 'User deleted' } }
      mockedAxios.delete.mockResolvedValue(mockResponse)
      const result = await deleteUser('1')
      expect(mockedAxios.delete).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.delete.mockRejectedValue({ response: { data: { message: 'Cannot delete' } } })
      await expect(deleteUser('1')).rejects.toThrow('Cannot delete')
    })
  })

  describe('getAdminStats', () => {
    it('should fetch admin stats', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { totalUsers: 100, influencers: 60, brands: 35, admins: 5 }
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await getAdminStats()
      expect(result).toEqual(mockResponse.data)
    })

    it('should return default stats on failure', async () => {
      mockedAxios.get.mockRejectedValue({ message: 'Server down' })
      const result: any = await getAdminStats()
      expect(result.success).toBe(false)
      expect(result.data.totalUsers).toBe(0)
    })
  })
})
