import { fetchMyProfile, fetchUserProfile, updateProfile, updateProfileWithImage } from '@/lib/api/profile'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchMyProfile', () => {
    it('should fetch current user profile', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '123', fullName: 'Test User', bio: 'Hello', niche: 'Fashion' }
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchMyProfile()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(fetchMyProfile()).rejects.toThrow('Unauthorized')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchMyProfile()).rejects.toThrow('Failed to fetch profile')
    })
  })

  describe('fetchUserProfile', () => {
    it('should fetch another user profile by ID', async () => {
      const mockResponse = {
        data: { success: true, data: { _id: '456', fullName: 'Other User' } }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchUserProfile('456')
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when user not found', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'User not found' } } })
      await expect(fetchUserProfile('invalid')).rejects.toThrow('User not found')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchUserProfile('x')).rejects.toThrow('Failed to fetch user profile')
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockResponse = { data: { success: true, data: { fullName: 'Updated' } } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await updateProfile({ fullName: 'Updated' })
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Validation error' } } })
      await expect(updateProfile({})).rejects.toThrow('Validation error')
    })

    it('should use fallback error message', async () => {
      mockedAxios.patch.mockRejectedValue({})
      await expect(updateProfile({})).rejects.toThrow('Failed to update profile')
    })
  })

  describe('updateProfileWithImage', () => {
    it('should update profile with image', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)

      const profileData = { fullName: 'Test', bio: 'Bio' }
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' })

      const result = await updateProfileWithImage(profileData, mockFile)
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should update profile without image', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await updateProfileWithImage({ fullName: 'Test' })
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle object values by stringifying them', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      await updateProfileWithImage({ socialLinks: { instagram: '@test' } })
      expect(mockedAxios.patch).toHaveBeenCalled()
    })

    it('should skip null and undefined values', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      await updateProfileWithImage({ fullName: 'Test', bio: null, niche: undefined })
      expect(mockedAxios.patch).toHaveBeenCalled()
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'File too large' } } })
      await expect(updateProfileWithImage({})).rejects.toThrow('File too large')
    })
  })
})
