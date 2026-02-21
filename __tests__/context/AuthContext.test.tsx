import { render, screen, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { getAuthToken, getUserData, clearAuthCookies, setUserData } from '@/lib/cookie'
import { fetchWhoAmI } from '@/lib/api/auth'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@/lib/cookie')
jest.mock('@/lib/api/auth')

// Test component that uses the auth context
function TestComponent() {
  const { isAuthenticated, user, loading, logout, refreshUser } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <button onClick={logout}>Logout</button>
      <button onClick={refreshUser}>Refresh</button>
    </div>
  )
}

describe('AuthContext', () => {
  const mockPush = jest.fn()
  const mockUser = {
    userId: '123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'influencer'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('initializes with loading state', () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
  })

  it('sets authenticated state when token exists', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('sets unauthenticated state when no token', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue(null)
    ;(getUserData as jest.Mock).mockResolvedValue(null)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })
  })

  it('handles logout correctly', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)
    ;(clearAuthCookies as jest.Mock).mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    const logoutButton = screen.getByText('Logout')
    
    await act(async () => {
      logoutButton.click()
    })

    await waitFor(() => {
      expect(clearAuthCookies).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/login')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })
  })

  it('refreshes user data correctly', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)
    
    const updatedUser = { ...mockUser, fullName: 'Updated User' }
    ;(fetchWhoAmI as jest.Mock).mockResolvedValue({
      success: true,
      data: updatedUser
    })
    ;(setUserData as jest.Mock).mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    const refreshButton = screen.getByText('Refresh')
    
    await act(async () => {
      refreshButton.click()
    })

    await waitFor(() => {
      expect(fetchWhoAmI).toHaveBeenCalled()
      expect(setUserData).toHaveBeenCalledWith(updatedUser)
    })
  })

  it('handles refresh user error gracefully', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)
    ;(fetchWhoAmI as jest.Mock).mockRejectedValue(new Error('Network error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    const refreshButton = screen.getByText('Refresh')
    
    await act(async () => {
      refreshButton.click()
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Refresh user failed:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('handles logout error gracefully', async () => {
    ;(getAuthToken as jest.Mock).mockResolvedValue('test-token')
    ;(getUserData as jest.Mock).mockResolvedValue(mockUser)
    ;(clearAuthCookies as jest.Mock).mockRejectedValue(new Error('Clear cookies failed'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    const logoutButton = screen.getByText('Logout')
    
    await act(async () => {
      logoutButton.click()
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
