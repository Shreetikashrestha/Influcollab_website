import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { fetchNotifications, fetchUnreadNotificationCount } from '@/lib/api/notification'
import { useSocket } from '@/context/SocketContext'

jest.mock('@/lib/api/notification')
jest.mock('@/context/SocketContext')
jest.mock('react-toastify', () => ({
  toast: { info: jest.fn(), error: jest.fn() }
}))

const mockFetchNotifications = fetchNotifications as jest.MockedFunction<typeof fetchNotifications>
const mockFetchUnreadCount = fetchUnreadNotificationCount as jest.MockedFunction<typeof fetchUnreadNotificationCount>
const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>

describe('NotificationDropdown Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSocket.mockReturnValue({ socket: null, isConnected: false } as any)
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

  it('does not display badge when unread count is zero', async () => {
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 0 })
    mockFetchNotifications.mockResolvedValue({ success: true, notifications: [] })

    render(<NotificationDropdown />)

    await waitFor(() => {
      expect(mockFetchUnreadCount).toHaveBeenCalled()
    })

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('fetches notifications and unread count on mount', async () => {
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

  it('handles API error gracefully', async () => {
    mockFetchUnreadCount.mockRejectedValue(new Error('Network error'))
    mockFetchNotifications.mockRejectedValue(new Error('Network error'))

    render(<NotificationDropdown />)

    await waitFor(() => {
      expect(mockFetchNotifications).toHaveBeenCalled()
    })

    // Should still render without crashing
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles socket events for real-time notifications', async () => {
    const mockOn = jest.fn()
    const mockOff = jest.fn()
    mockUseSocket.mockReturnValue({
      socket: { on: mockOn, off: mockOff } as any,
      isConnected: true
    } as any)
    mockFetchUnreadCount.mockResolvedValue({ success: true, count: 0 })
    mockFetchNotifications.mockResolvedValue({ success: true, notifications: [] })

    render(<NotificationDropdown />)

    await waitFor(() => {
      expect(mockOn).toHaveBeenCalledWith('new_notification', expect.any(Function))
    })
  })
})
