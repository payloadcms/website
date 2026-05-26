import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock de usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock de DocSearch
jest.mock('@docsearch/react', () => ({
  DocSearch: () => <div data-testid="docsearch" />,
}))

import { usePathname } from 'next/navigation'
import Component from './Component'

describe('DocSearch Component', () => {
  it('shows v2 badge when on v2 docs', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/docs/v2/getting-started')
    render(<Component />)
    expect(screen.getByText('Searching in v2 docs')).toBeInTheDocument()
  })

  it('shows v3 badge when on v3 docs', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/docs/getting-started')
    render(<Component />)
    expect(screen.getByText('Searching in v3 docs')).toBeInTheDocument()
  })
})
