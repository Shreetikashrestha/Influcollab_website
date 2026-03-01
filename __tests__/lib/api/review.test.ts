import { createReview, fetchUserReviews } from '@/lib/api/review'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Review API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const reviewData = { userId: 'user1', rating: 5, comment: 'Great work!' }
      const mockResponse = { data: { success: true, data: { _id: 'rev1', ...reviewData } } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await createReview(reviewData)
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Already reviewed' } } })
      await expect(createReview({})).rejects.toThrow('Already reviewed')
    })

    it('should use fallback error message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(createReview({})).rejects.toThrow('Failed to submit review')
    })
  })

  describe('fetchUserReviews', () => {
    it('should fetch reviews for a user', async () => {
      const mockResponse = {
        data: { success: true, data: [{ _id: 'rev1', rating: 5 }, { _id: 'rev2', rating: 4 }] }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchUserReviews('user1')
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { page: 1, limit: 10 } })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch reviews with custom pagination', async () => {
      const mockResponse = { data: { success: true, data: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await fetchUserReviews('user1', 2, 5)
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { page: 2, limit: 5 } })
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'User not found' } } })
      await expect(fetchUserReviews('invalid')).rejects.toThrow('User not found')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchUserReviews('x')).rejects.toThrow('Failed to fetch reviews')
    })
  })
})
