# Frontend Testing Guide

## Overview

This project uses Jest and React Testing Library for testing Next.js components, pages, and utilities. The testing setup follows industry best practices and is inspired by modern React testing patterns.

## Test Structure

```
__tests__/
├── pages/                    # Page component tests
│   ├── login.test.tsx       # Login page tests
│   └── register.test.tsx    # Register page tests
├── context/                  # Context tests
│   └── AuthContext.test.tsx # Auth context tests
└── lib/                      # Utility/API tests
    └── api/
        └── auth.test.ts     # Auth API tests
```

## Running Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test login.test

# Run tests matching pattern
npm test -- --testNamePattern="should login"
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'context/**/*.{js,jsx,ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Test Setup (`jest.setup.js`)

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
}))
```

## Writing Tests

### Testing Pages

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      // Assert expected behavior
    })
  })
})
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import AuthInput from '@/components/AuthInput'

describe('AuthInput', () => {
  it('renders with label and placeholder', () => {
    render(
      <AuthInput
        label="Email"
        placeholder="Enter email"
        type="email"
        register={{}}
      />
    )
    
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(
      <AuthInput
        label="Email"
        placeholder="Enter email"
        type="email"
        error="Invalid email"
        register={{}}
      />
    )
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })
})
```

### Testing Context

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'

function TestComponent() {
  const { isAuthenticated, user } = useAuth()
  return (
    <div>
      <div data-testid="auth">{isAuthenticated ? 'Yes' : 'No'}</div>
      <div data-testid="user">{user?.email || 'None'}</div>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides authentication state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth')).toHaveTextContent('Yes')
    })
  })
})
```

### Testing API Functions

```typescript
import { loginUser } from '@/lib/api/auth'
import axios from '@/lib/api/axios'

jest.mock('@/lib/api/axios')

describe('Auth API', () => {
  it('successfully logs in user', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { token: 'test-token' }
      }
    }
    ;(axios.post as jest.Mock).mockResolvedValue(mockResponse)

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(axios.post).toHaveBeenCalledWith('/auth/login', expect.any(Object))
    expect(result.success).toBe(true)
  })
})
```

## Common Testing Patterns

### 1. Form Validation

```typescript
it('displays validation errors', async () => {
  render(<LoginPage />)
  
  const submitButton = screen.getByRole('button', { name: /login/i })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
  })
})
```

### 2. User Interactions

```typescript
it('handles user input', async () => {
  render(<LoginPage />)
  
  const emailInput = screen.getByPlaceholderText('Enter your email')
  
  await userEvent.type(emailInput, 'test@example.com')
  
  expect(emailInput).toHaveValue('test@example.com')
})
```

### 3. Async Operations

```typescript
it('handles async submission', async () => {
  const mockLogin = jest.fn().mockResolvedValue({ success: true })
  
  render(<LoginPage />)
  
  // Fill form and submit
  
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalled()
  })
})
```

### 4. Error Handling

```typescript
it('displays error message', async () => {
  const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'))
  
  render(<LoginPage />)
  
  // Fill form and submit
  
  await waitFor(() => {
    expect(screen.getByText(/login failed/i)).toBeInTheDocument()
  })
})
```

### 5. Navigation

```typescript
it('navigates on success', async () => {
  const mockPush = jest.fn()
  ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  
  render(<LoginPage />)
  
  // Fill form and submit
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
```

### 6. Loading States

```typescript
it('shows loading state', async () => {
  render(<LoginPage />)
  
  const submitButton = screen.getByRole('button', { name: /login/i })
  
  // Fill form and submit
  
  await waitFor(() => {
    expect(submitButton).toHaveTextContent(/logging in/i)
    expect(submitButton).toBeDisabled()
  })
})
```

## Best Practices

### 1. Use Testing Library Queries

✅ **Do:**
```typescript
screen.getByRole('button', { name: /login/i })
screen.getByPlaceholderText('Enter your email')
screen.getByText(/error message/i)
```

❌ **Don't:**
```typescript
container.querySelector('.login-button')
container.querySelector('#email-input')
```

### 2. Test User Behavior

✅ **Do:**
```typescript
await userEvent.type(emailInput, 'test@example.com')
await userEvent.click(submitButton)
```

❌ **Don't:**
```typescript
emailInput.value = 'test@example.com'
submitButton.click()
```

### 3. Use waitFor for Async

✅ **Do:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

❌ **Don't:**
```typescript
setTimeout(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
}, 1000)
```

### 4. Mock External Dependencies

```typescript
jest.mock('@/lib/api/auth')
jest.mock('next/navigation')
jest.mock('@/context/AuthContext')
```

### 5. Clean Up After Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  cleanup()
})
```

## Testing Checklist

### For Each Page/Component

- [ ] Renders correctly
- [ ] Displays all required elements
- [ ] Handles user input
- [ ] Validates form data
- [ ] Displays validation errors
- [ ] Submits data correctly
- [ ] Handles success response
- [ ] Handles error response
- [ ] Shows loading states
- [ ] Navigates correctly
- [ ] Has proper accessibility

### For Each API Function

- [ ] Calls correct endpoint
- [ ] Sends correct data
- [ ] Returns correct response
- [ ] Handles success
- [ ] Handles errors
- [ ] Throws appropriate errors

### For Each Context

- [ ] Provides correct initial state
- [ ] Updates state correctly
- [ ] Handles async operations
- [ ] Handles errors
- [ ] Throws error when used outside provider

## Debugging Tests

### View Rendered Output

```typescript
import { screen, debug } from '@testing-library/react'

it('test', () => {
  render(<Component />)
  screen.debug() // Prints DOM to console
})
```

### Find Elements

```typescript
// Find what's available
screen.logTestingPlaygroundURL()

// Check if element exists
expect(screen.queryByText('Text')).toBeInTheDocument()
expect(screen.queryByText('Text')).not.toBeInTheDocument()
```

### Wait for Elements

```typescript
// Wait for element to appear
await screen.findByText('Text')

// Wait for condition
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled()
})
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Common Issues

### Issue: "Cannot find module"
**Solution:** Check `moduleNameMapper` in jest.config.js

### Issue: "useRouter is not a function"
**Solution:** Mock next/navigation in jest.setup.js

### Issue: "window is not defined"
**Solution:** Use `testEnvironment: 'jsdom'`

### Issue: "Act warnings"
**Solution:** Wrap state updates in `act()` or use `waitFor()`

## Resources

- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
