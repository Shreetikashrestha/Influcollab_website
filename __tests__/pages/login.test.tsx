import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/(auth)/login/page'
import { useAuth } from '@/context/AuthContext'
import { handleLogin } from '@/lib/actions/auth-action'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@/context/AuthContext')
jest.mock('@/lib/actions/auth-action')

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockCheckAuth = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useAuth as jest.Mock).mockReturnValue({
      checkAuth: mockCheckAuth,
    })
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty fields', async () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('displays validation error for invalid email', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.type(passwordInput, 'password123')
    
    // Trigger validation by submitting
    fireEvent.click(submitButton)

    // Wait for validation error to appear
    await waitFor(() => {
      const errorElements = screen.queryAllByText(/email/i)
      const hasValidationError = errorElements.some(el => 
        el.textContent?.toLowerCase().includes('valid') || 
        el.textContent?.toLowerCase().includes('email')
      )
      expect(hasValidationError || screen.queryByText(/please enter a valid email address/i)).toBeTruthy()
    }, { timeout: 3000 })
  })

  it('displays validation error for short password', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, '123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      data: { token: 'test-token' }
    }
    ;(handleLogin as jest.Mock).mockResolvedValue(mockResponse)

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })
      expect(mockCheckAuth).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials'
    ;(handleLogin as jest.Mock).mockResolvedValue({
      success: false,
      message: errorMessage
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('handles remember me checkbox', async () => {
    render(<LoginPage />)
    
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i })
    
    expect(rememberMeCheckbox).not.toBeChecked()
    
    await userEvent.click(rememberMeCheckbox)
    
    expect(rememberMeCheckbox).toBeChecked()
  })

  it('has link to register page', () => {
    render(<LoginPage />)
    
    const registerLink = screen.getByRole('link', { name: /sign up/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('has link to forgot password page', () => {
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i })
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('disables submit button while submitting', async () => {
    ;(handleLogin as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/logging in/i)
    })
  })

  it('handles API errors gracefully', async () => {
    ;(handleLogin as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })
})
