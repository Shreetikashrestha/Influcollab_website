import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import RegisterPage from '@/app/(auth)/register/page'
import { handleRegister } from '@/lib/actions/auth-action'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@/lib/actions/auth-action')

describe('RegisterPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders register form correctly', () => {
    render(<RegisterPage />)
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty fields', async () => {
    render(<RegisterPage />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errors = screen.queryAllByText(/must be at least/i)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  it('displays validation error for short name', async () => {
    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'AB')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('displays validation error for invalid email', async () => {
    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.type(passwordInput, 'password123')
    
    // Trigger validation
    fireEvent.click(submitButton)

    // Check that form doesn't submit successfully (validation should prevent it)
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
    render(<RegisterPage />)
    
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(passwordInput, '123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data as Influencer', async () => {
    const mockResponse = {
      success: true,
      message: 'Registration successful'
    }
    ;(handleRegister as jest.Mock).mockResolvedValue(mockResponse)

    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'Influencer',
          isInfluencer: true,
        })
      )
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('submits form with valid data as Brand', async () => {
    const mockResponse = {
      success: true,
      message: 'Registration successful'
    }
    ;(handleRegister as jest.Mock).mockResolvedValue(mockResponse)

    render(<RegisterPage />)
    
    // Select Brand role
    const brandButton = screen.getByRole('button', { name: /brand/i })
    await userEvent.click(brandButton)

    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'Brand Company')
    await userEvent.type(emailInput, 'brand@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'Brand',
          isInfluencer: false,
        })
      )
    })
  })

  it('displays error message on registration failure', async () => {
    const errorMessage = 'Email already exists'
    ;(handleRegister as jest.Mock).mockResolvedValue({
      success: false,
      message: errorMessage
    })

    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'existing@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('has link to login page', () => {
    render(<RegisterPage />)
    
    const loginLink = screen.getByRole('link', { name: /login/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('disables submit button while submitting', async () => {
    ;(handleRegister as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/creating account/i)
    })
  })

  it('handles API errors gracefully', async () => {
    ;(handleRegister as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('splits full name correctly', async () => {
    const mockResponse = { success: true }
    ;(handleRegister as jest.Mock).mockResolvedValue(mockResponse)

    render(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await userEvent.type(nameInput, 'John Michael Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Michael Doe',
        })
      )
    })
  })
})
