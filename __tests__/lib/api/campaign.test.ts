import { fetchCampaigns, createCampaign, updateCampaign, fetchCampaignDetails, joinCampaign, fetchBrandCampaigns, fetchBrandStats } from '@/lib/api/campaign'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Campaign API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchCampaigns', () => {
    it('should fetch all campaigns successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { _id: '1', title: 'Campaign 1' },
            { _id: '2', title: 'Campaign 2' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchCampaigns()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Failed to fetch campaigns' } } })
      await expect(fetchCampaigns()).rejects.toThrow('Failed to fetch campaigns')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchCampaigns()).rejects.toThrow('Failed to fetch campaigns')
    })
  })

  describe('fetchCampaignDetails', () => {
    it('should fetch campaign details by ID', async () => {
      const mockResponse = {
        data: { success: true, data: { _id: '123', title: 'Test Campaign', description: 'Test' } }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchCampaignDetails('123')
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error when campaign not found', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Campaign not found' } } })
      await expect(fetchCampaignDetails('invalid')).rejects.toThrow('Campaign not found')
    })
  })

  describe('createCampaign', () => {
    it('should create campaign successfully', async () => {
      const campaignData = {
        title: 'New Campaign',
        brandName: 'Test Brand',
        category: 'Fashion',
        budgetMin: 5000,
        budgetMax: 15000,
        deadline: '2026-12-31',
        location: 'Kathmandu',
        description: 'Test description',
        requirements: ['Requirement 1']
      }
      const mockResponse = { data: { success: true, data: { _id: '123', ...campaignData } } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await createCampaign(campaignData)
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on creation failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Validation failed' } } })
      await expect(createCampaign({})).rejects.toThrow('Validation failed')
    })
  })

  describe('updateCampaign', () => {
    it('should update campaign successfully', async () => {
      const mockResponse = { data: { success: true, data: { _id: '123', title: 'Updated' } } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await updateCampaign('123', { title: 'Updated' })
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on update failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Not authorized' } } })
      await expect(updateCampaign('123', {})).rejects.toThrow('Not authorized')
    })
  })

  describe('joinCampaign', () => {
    it('should join campaign successfully', async () => {
      const mockResponse = { data: { success: true, message: 'Application submitted' } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await joinCampaign('123', 'I am interested')
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should join without a message', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await joinCampaign('123')
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), { message: undefined })
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on join failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Already applied' } } })
      await expect(joinCampaign('123')).rejects.toThrow('Already applied')
    })
  })

  describe('fetchBrandCampaigns', () => {
    it('should fetch brand campaigns and normalize response', async () => {
      const mockResponse = { data: { success: true, data: [{ _id: '1', title: 'My Campaign' }] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchBrandCampaigns()
      expect(result).toEqual({ success: true, campaigns: [{ _id: '1', title: 'My Campaign' }] })
    })

    it('should handle campaigns key in response', async () => {
      const mockResponse = { data: { success: true, campaigns: [{ _id: '2' }] } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchBrandCampaigns()
      expect(result).toEqual({ success: true, campaigns: [{ _id: '2' }] })
    })

    it('should handle empty data', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchBrandCampaigns()
      expect(result).toEqual({ success: true, campaigns: [] })
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(fetchBrandCampaigns()).rejects.toThrow('Unauthorized')
    })
  })

  describe('fetchBrandStats', () => {
    it('should fetch brand stats successfully', async () => {
      const mockResponse = { data: { success: true, data: { totalCampaigns: 5, totalApplicants: 20 } } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchBrandStats()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Server error' } } })
      await expect(fetchBrandStats()).rejects.toThrow('Server error')
    })
  })
})
