import { fetchConversations, fetchConversationMessages, sendMessage, markMessageAsRead, markConversationAsRead } from '@/lib/api/message'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Message API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchConversations', () => {
    it('should fetch all conversations', async () => {
      const mockResponse = {
        data: {
          success: true,
          conversations: [
            { _id: 'conv1', participants: ['user1', 'user2'], lastMessage: 'Hello' },
            { _id: 'conv2', participants: ['user1', 'user3'], lastMessage: 'Hi' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchConversations()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })
      await expect(fetchConversations()).rejects.toThrow('Unauthorized')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchConversations()).rejects.toThrow('Failed to fetch conversations')
    })
  })

  describe('fetchConversationMessages', () => {
    it('should fetch messages for a conversation', async () => {
      const mockResponse = {
        data: {
          success: true,
          messages: [
            { _id: 'msg1', content: 'Hello', sender: 'user1' },
            { _id: 'msg2', content: 'Hi there', sender: 'user2' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchConversationMessages('conv1')
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Conversation not found' } } })
      await expect(fetchConversationMessages('invalid')).rejects.toThrow('Conversation not found')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchConversationMessages('x')).rejects.toThrow('Failed to fetch messages')
    })
  })

  describe('sendMessage', () => {
    it('should send a text message', async () => {
      const messageData = { receiverId: 'user2', content: 'Hello!' }
      const mockResponse = { data: { success: true, data: { _id: 'msg1', ...messageData } } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await sendMessage(messageData)
      expect(mockedAxios.post).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should send a message with conversationId', async () => {
      const messageData = { conversationId: 'conv1', content: 'Reply' }
      const mockResponse = { data: { success: true } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await sendMessage(messageData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should send FormData with multipart header', async () => {
      const formData = new FormData()
      formData.append('content', 'File message')
      formData.append('receiverId', 'user2')
      const mockResponse = { data: { success: true } }
      mockedAxios.post.mockResolvedValue(mockResponse)
      const result = await sendMessage(formData)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        formData,
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Message too long' } } })
      await expect(sendMessage({ content: 'x', receiverId: 'y' })).rejects.toThrow('Message too long')
    })

    it('should use fallback error message', async () => {
      mockedAxios.post.mockRejectedValue({})
      await expect(sendMessage({ content: 'x', receiverId: 'y' })).rejects.toThrow('Failed to send message')
    })
  })

  describe('markMessageAsRead', () => {
    it('should mark message as read', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await markMessageAsRead('msg1')
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Not found' } } })
      await expect(markMessageAsRead('invalid')).rejects.toThrow('Not found')
    })
  })

  describe('markConversationAsRead', () => {
    it('should mark conversation as read', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await markConversationAsRead('conv1')
      expect(result).toEqual(mockResponse.data)
    })

    it('should return success false on failure (silent fail)', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Error' } } })
      const result = await markConversationAsRead('invalid')
      expect(result).toEqual({ success: false })
    })
  })
})
