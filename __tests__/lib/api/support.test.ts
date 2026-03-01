import { createSupportTicket, getMyTickets } from '@/lib/api/support'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Support API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createSupportTicket', () => {
    it('should create a support ticket successfully', async () => {
      const mockResponse = {
        data: { success: true, data: { _id: 'ticket1', category: 'Technical', message: 'Help me' } }
      }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await createSupportTicket('Technical', 'Help me')
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        { category: 'Technical', message: 'Help me' }
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Invalid category' } } })
      await expect(createSupportTicket('Invalid', 'msg')).rejects.toThrow('Invalid category')
    })

    it('should use fallback error message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(createSupportTicket('Technical', 'msg')).rejects.toThrow('Failed to create support ticket')
    })
  })

  describe('getMyTickets', () => {
    it('should fetch user tickets', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { _id: 't1', category: 'Technical', status: 'open' },
            { _id: 't2', category: 'Billing', status: 'resolved' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await getMyTickets()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(getMyTickets()).rejects.toThrow('Unauthorized')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(getMyTickets()).rejects.toThrow('Failed to fetch tickets')
    })
  })
})
