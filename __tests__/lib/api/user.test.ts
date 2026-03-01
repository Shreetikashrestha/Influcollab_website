import { updateMyProfile, searchUsersForMessaging } from '@/lib/api/user'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateMyProfile', () => {
    it('should update profile successfully', async () => {
      const mockResponse = { data: { success: true, data: { _id: '123', fullName: 'Updated' } } }
      mockedAxios.put.mockResolvedValue(mockResponse)
      const formData = new FormData()
      formData.append('fullName', 'Updated')
      const result = await updateMyProfile('123', formData)
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.any(String),
        formData,
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.put.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(updateMyProfile('123', new FormData())).rejects.toThrow('Unauthorized')
    })

    it('should use fallback error message', async () => {
      mockedAxios.put.mockRejectedValue({})
      await expect(updateMyProfile('123', new FormData())).rejects.toThrow('Failed to update profile')
    })
  })

  describe('searchUsersForMessaging', () => {
    it('should search users successfully', async () => {
      const mockResponse = {
        data: { success: true, data: [{ _id: '1', fullName: 'Test User' }] }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await searchUsersForMessaging('test')
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { q: 'test' } })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle empty results', async () => {
      const mockResponse = { data: { success: true, data: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await searchUsersForMessaging('nonexistent')
      expect(result.data).toEqual([])
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Server error' } } })
      await expect(searchUsersForMessaging('test')).rejects.toThrow('Server error')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(searchUsersForMessaging('test')).rejects.toThrow('Failed to search users')
    })
  })
})
