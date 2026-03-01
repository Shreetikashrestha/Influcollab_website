import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CampaignCard from '@/components/CampaignCard'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
})

describe('CampaignCard Component', () => {
  const defaultProps = {
    id: '1',
    title: 'Test Campaign',
    brand: 'Test Brand',
    category: 'Fashion',
    reward: 'NPR 10,000 - 20,000',
    deadline: '2026-12-31',
    location: 'Kathmandu',
    applicants: 15,
    description: 'Test description for the campaign'
  }

  it('renders campaign title', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
  })

  it('renders brand name', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Fashion')).toBeInTheDocument()
  })

  it('renders reward amount', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('NPR 10,000 - 20,000')).toBeInTheDocument()
  })

  it('renders deadline', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Due: 2026-12-31')).toBeInTheDocument()
  })

  it('renders location', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Kathmandu')).toBeInTheDocument()
  })

  it('renders applicant count', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('15 applicants')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<CampaignCard {...defaultProps} />)
    expect(screen.getByText('Test description for the campaign')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { description, ...propsWithoutDescription } = defaultProps
    render(<CampaignCard {...propsWithoutDescription} />)
    expect(screen.queryByText('Test description for the campaign')).not.toBeInTheDocument()
  })

  it('renders View Details link when href is provided', () => {
    render(<CampaignCard {...defaultProps} href="/campaigns/1" />)
    const link = screen.getByText('View Details')
    expect(link.closest('a')).toHaveAttribute('href', '/campaigns/1')
  })

  it('renders View Details button when onViewDetails is provided', () => {
    const mockClick = jest.fn()
    render(<CampaignCard {...defaultProps} onViewDetails={mockClick} />)
    const button = screen.getByText('View Details')
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders heart and bookmark buttons', () => {
    render(<CampaignCard {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    // Heart and Bookmark buttons (+ View Details button if no href)
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders with zero applicants', () => {
    render(<CampaignCard {...defaultProps} applicants={0} />)
    expect(screen.getByText('0 applicants')).toBeInTheDocument()
  })
})
