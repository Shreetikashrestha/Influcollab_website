import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { fetchNotifications, fetchUnreadNotificationCount } from '@/lib/api/notification'
import { useSocket } from '@/context/SocketContext'

// Mock the API functions
jest.mock('@/lib/api/notification')
jest.mock('@/context/SocketContext')

const mockFetchNotifications = fetchNotifications as jest.MockedFunction<typeof fetchNotifications>
const mockFetchUnreadCount = fetchUnreadNotificationCount as jest.MockedFunction<typeof fetchUnreadNotificationCount>
const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>

describe('NotificationDropdown Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSocket.mockReturnValue({ socket: null, isConnected: false })
  })

  it('renders notification bell icon', () => {
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 0 })
    mockFetchNotifications.mockResolvedValue({ success: true, notifications: [] })

    render(<NotificationDropdown />)
    
    const bellIcon = screen.getByRole('button')
    expect(bellIcon).toBeInTheDocument()
  })

  it('displays unread count badge when there are unread notifications', async () => {
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 5 })
    mockFetchNotifications.mockResolvedValue({ success: true, notifications: [] })

    render(<NotificationDropdown />)
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('fetches notifications on mount', async () => {
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 0 })
    mockFetchNotifications.mockResolvedValue({ 
      success: true, 
      notifications: [
        {
          _id: '1',
          title: 'Test Notification',
          message: 'Test message',
          type: 'application',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ] 
    })

    render(<NotificationDropdown />)
    
    await waitFor(() => {
      expect(mockFetchNotifications).toHaveBeenCalled()
      expect(mockFetchUnreadCount).toHaveBeenCalled()
    })
  })

  it('handles empty notifications state', async () => {
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 0 })
    mockFetchNotifications.mockResolvedValue({ success: true, notifications: [] })

    render(<NotificationDropdown />)
    
    await waitFor(() => {
      expect(mockFetchNotifications).toHaveBeenCalled()
    })
  })
})
