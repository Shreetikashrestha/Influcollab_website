import { fetchInfluencers } from '@/lib/api/influencer'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Influencer API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchInfluencers', () => {
    it('should fetch all influencers without filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { _id: '1', fullName: 'Influencer 1', niche: 'Fashion' },
            { _id: '2', fullName: 'Influencer 2', niche: 'Tech' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchInfluencers()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch influencers with niche filter', async () => {
      const mockResponse = { data: { success: true, data: [{ _id: '1', niche: 'Fashion' }] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await fetchInfluencers({ niche: 'Fashion' })
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { niche: 'Fashion' } })
    })

    it('should fetch influencers with search filter', async () => {
      const mockResponse = { data: { success: true, data: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await fetchInfluencers({ search: 'test' })
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { search: 'test' } })
    })

    it('should fetch influencers with category filter', async () => {
      const mockResponse = { data: { success: true, data: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      await fetchInfluencers({ category: 'Beauty' })
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params: { category: 'Beauty' } })
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Server error' } } })
      await expect(fetchInfluencers()).rejects.toThrow('Server error')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchInfluencers()).rejects.toThrow('Failed to fetch influencers')
    })
  })
})
