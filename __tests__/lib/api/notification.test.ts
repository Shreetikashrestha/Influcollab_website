import { fetchNotifications, fetchUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/lib/api/notification'
import axiosInstance from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('Notification API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchNotifications', () => {
    it('should fetch all notifications', async () => {
      const mockResponse = {
        data: {
          success: true,
          notifications: [
            { _id: '1', title: 'New Application', message: 'You have a new application', isRead: false },
            { _id: '2', title: 'Application Accepted', message: 'Your application was accepted', isRead: true }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchNotifications()
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { message: 'Server error' } } })
      await expect(fetchNotifications()).rejects.toThrow('Server error')
    })

    it('should use fallback error message', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchNotifications()).rejects.toThrow('Failed to fetch notifications')
    })
  })

  describe('fetchUnreadNotificationCount', () => {
    it('should fetch unread count', async () => {
      const mockResponse = { data: { success: true, count: 5 } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchUnreadNotificationCount()
      expect(result).toEqual({ success: true, count: 5 })
    })

    it('should return zero when no unread', async () => {
      const mockResponse = { data: { success: true, count: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)
      const result = await fetchUnreadNotificationCount()
      expect(result.count).toBe(0)
    })

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValue({})
      await expect(fetchUnreadNotificationCount()).rejects.toThrow('Failed to fetch unread count')
    })
  })

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await markNotificationAsRead('notif1')
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({ response: { data: { message: 'Notification not found' } } })
      await expect(markNotificationAsRead('invalid')).rejects.toThrow('Notification not found')
    })

    it('should use fallback error message', async () => {
      mockedAxios.patch.mockRejectedValue({})
      await expect(markNotificationAsRead('x')).rejects.toThrow('Failed to mark as read')
    })
  })

  describe('markAllNotificationsAsRead', () => {
    it('should mark all as read', async () => {
      const mockResponse = { data: { success: true, message: 'All notifications marked as read' } }
      mockedAxios.patch.mockResolvedValue(mockResponse)
      const result = await markAllNotificationsAsRead()
      expect(mockedAxios.patch).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.patch.mockRejectedValue({})
      await expect(markAllNotificationsAsRead()).rejects.toThrow('Failed to mark all as read')
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.delete.mockResolvedValue(mockResponse)
      const result = await deleteNotification('notif1')
      expect(mockedAxios.delete).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on failure', async () => {
      mockedAxios.delete.mockRejectedValue({ response: { data: { message: 'Not found' } } })
      await expect(deleteNotification('invalid')).rejects.toThrow('Not found')
    })

    it('should use fallback error message', async () => {
      mockedAxios.delete.mockRejectedValue({})
      await expect(deleteNotification('x')).rejects.toThrow('Failed to delete notification')
    })
  })
})
