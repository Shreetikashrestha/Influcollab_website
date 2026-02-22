import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import RoleSelector from '@/components/RoleSelector'

describe('RoleSelector Component', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders both role options', () => {
    render(<RoleSelector selectedRole="Influencer" onChange={mockOnChange} />)
    
    expect(screen.getByText('Influencer')).toBeInTheDocument()
    expect(screen.getByText('Brand')).toBeInTheDocument()
  })

  it('highlights the selected role', () => {
    const { rerender } = render(<RoleSelector selectedRole="Influencer" onChange={mockOnChange} />)
    
    const influencerButton = screen.getByText('Influencer').closest('button')
    expect(influencerButton).toHaveClass('border-purple-500')
    
    rerender(<RoleSelector selectedRole="Brand" onChange={mockOnChange} />)
    
    const brandButton = screen.getByText('Brand').closest('button')
    expect(brandButton).toHaveClass('border-purple-500')
  })

  it('calls onChange with "Influencer" when Influencer is clicked', () => {
    render(<RoleSelector selectedRole="Brand" onChange={mockOnChange} />)
    
    const influencerButton = screen.getByText('Influencer').closest('button')
    fireEvent.click(influencerButton!)
    
    expect(mockOnChange).toHaveBeenCalledWith('Influencer')
  })

  it('calls onChange with "Brand" when Brand is clicked', () => {
    render(<RoleSelector selectedRole="Influencer" onChange={mockOnChange} />)
    
    const brandButton = screen.getByText('Brand').closest('button')
    fireEvent.click(brandButton!)
    
    expect(mockOnChange).toHaveBeenCalledWith('Brand')
  })

  it('displays label text', () => {
    render(<RoleSelector selectedRole="Influencer" onChange={mockOnChange} />)
    
    expect(screen.getByText('I am a:')).toBeInTheDocument()
  })
})
