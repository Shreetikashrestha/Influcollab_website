import { createApplication, submitApplication, fetchMyApplications, fetchCampaignApplications, updateApplicationStatus, fetchInfluencerStats } from '@/lib/api/application'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Application API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createApplication', () => {
    it('should create application successfully', async () => {
      const applicationData = { campaignId: 'camp1', message: 'I am interested' }
      const mockResponse = { data: { success: true, data: { _id: 'app1', ...applicationData } } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await createApplication(applicationData)
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Already applied' } } })
      await expect(createApplication({})).rejects.toThrow('Already applied')
    })

    it('should use fallback error message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(createApplication({})).rejects.toThrow('Failed to submit application')
    })
  })

  describe('submitApplication alias', () => {
    it('should be the same function as createApplication', () => {
      expect(submitApplication).toBe(createApplication)
    })
  })

  describe('fetchMyApplications', () => {
    it('should fetch user applications', async () => {
      const mockResponse = {
        data: { success: true, data: [{ _id: 'app1', status: 'pending' }, { _id: 'app2', status: 'accepted' }] }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchMyApplications()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(fetchMyApplications()).rejects.toThrow('Unauthorized')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchMyApplications()).rejects.toThrow('Failed to fetch your applications')
    })
  })

  describe('fetchCampaignApplications', () => {
    it('should fetch applications for a campaign', async () => {
      const mockResponse = {
        data: { success: true, data: [{ _id: 'app1', campaignId: 'camp1' }] }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchCampaignApplications('camp1')
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Campaign not found' } } })
      await expect(fetchCampaignApplications('invalid')).rejects.toThrow('Campaign not found')
    })
  })

  describe('updateApplicationStatus', () => {
    it('should accept an application', async () => {
      const mockResponse = { data: { success: true, data: { _id: 'app1', status: 'accepted' } } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await updateApplicationStatus('app1', 'accepted')
      expect(mockedAxios.patch).toHaveBeenCalledWith(expect.any(String), { status: 'accepted' })
      expect(result).toEqual(mockResponse.data)
    })

    it('should reject an application', async () => {
      const mockResponse = { data: { success: true, data: { _id: 'app1', status: 'rejected' } } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await updateApplicationStatus('app1', 'rejected')
      expect(mockedAxios.patch).toHaveBeenCalledWith(expect.any(String), { status: 'rejected' })
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Not authorized' } } })
      await expect(updateApplicationStatus('app1', 'accepted')).rejects.toThrow('Not authorized')
    })
  })

  describe('fetchInfluencerStats', () => {
    it('should fetch influencer stats', async () => {
      const mockResponse = {
        data: { success: true, data: { totalApplications: 10, accepted: 5, pending: 3, rejected: 2 } }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchInfluencerStats()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Server error' } } })
      await expect(fetchInfluencerStats()).rejects.toThrow('Server error')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchInfluencerStats()).rejects.toThrow('Failed to fetch stats')
    })
  })
})
