import { fetchCampaigns, createCampaign, updateCampaign, fetchCampaignDetails } from '@/lib/api/campaign'
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
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await fetchCampaigns()

      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle fetch error', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          data: {
            message: 'Failed to fetch campaigns'
          }
        }
      })

      await expect(fetchCampaigns()).rejects.toThrow('Failed to fetch campaigns')
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

      const mockResponse = {
        data: {
          success: true,
          data: { _id: '123', ...campaignData }
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await createCampaign(campaignData)

      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateCampaign', () => {
    it('should update campaign successfully', async () => {
      const campaignId = '123'
      const updateData = { title: 'Updated Title' }

      const mockResponse = {
        data: {
          success: true,
          data: { _id: campaignId, ...updateData }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockedAxios.patch.mockResolvedValue(mockResponse)

      const result = await updateCampaign(campaignId, updateData)

      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('fetchCampaignDetails', () => {
    it('should fetch campaign details by ID', async () => {
      const campaignId = '123'
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: campaignId,
            title: 'Test Campaign',
            description: 'Test description'
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await fetchCampaignDetails(campaignId)

      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })
  })
})
