import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IncentiveFinderPage } from '../IncentiveFinderPage';
import { AppProvider } from '../../../context/AppContext';

// Mock window.open
const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

describe('IncentiveFinderPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders all incentive schemes from initial data', () => {
    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    expect(screen.getByText(/Maharashtra Government Incentive Finder/i)).toBeInTheDocument();
    expect(screen.getByText(/Chief Minister Employment Generation Programme \(CMEGP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Maharashtra Package Scheme of Incentives/i)).toBeInTheDocument();
  });

  it('1. Modal opens when clicking Apply Scheme on a valid scheme card', () => {
    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    // Find Apply Scheme buttons
    const applyButtons = screen.getAllByRole('button', { name: /Apply for/i });
    expect(applyButtons.length).toBeGreaterThan(0);

    // Click Apply Scheme on CMEGP scheme
    fireEvent.click(applyButtons[2]);

    // Modal title should appear
    expect(screen.getByText(/Continue to Official Website\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Chief Minister Employment Generation Programme/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('maha-cmegp.gov.in').length).toBeGreaterThan(0);
  });

  it('2. Cancel closes the confirmation modal without opening a new tab', () => {
    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    const applyButtons = screen.getAllByRole('button', { name: /Apply for/i });
    fireEvent.click(applyButtons[0]);

    // Modal is open
    expect(screen.getByText(/Continue to Official Website\?/i)).toBeInTheDocument();

    // Click Cancel
    const cancelButton = screen.getByRole('button', { name: /^Cancel$/i });
    fireEvent.click(cancelButton);

    // Modal should be closed and window.open not called
    expect(screen.queryByText(/Continue to Official Website\?/i)).not.toBeInTheDocument();
    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('3. Continue opens the correct official URL in a new tab via window.open', () => {
    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    const applyButtons = screen.getAllByRole('button', { name: /Apply for/i });
    fireEvent.click(applyButtons[2]); // CMEGP scheme

    const continueButton = screen.getByRole('button', { name: /Continue to Official Website for/i });
    fireEvent.click(continueButton);

    // Verify window.open was called with correct official URL and security flags
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://maha-cmegp.gov.in',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('4. Missing or invalid URLs show fallback error and disable button', () => {
    // Override local storage with an invalid scheme URL
    const mockSchemes = [
      {
        id: 'invalid-scheme',
        schemeName: 'Invalid Test Scheme',
        department: 'Test Dept',
        shortDesc: 'Test desc',
        eligibilityStatus: 'ELIGIBLE' as const,
        estimatedBenefit: '₹10,00,000',
        eligibilityReason: 'Reason',
        nextAction: 'Action',
        tags: ['Test'],
        officialUrl: 'invalid-url-without-https'
      }
    ];
    localStorage.setItem('pfn_incentive_schemes', JSON.stringify(mockSchemes));

    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    expect(screen.getByText('Invalid Test Scheme')).toBeInTheDocument();
    expect(
      screen.getByText(/Official application link currently unavailable/i)
    ).toBeInTheDocument();

    const applyBtn = screen.getByRole('button', { name: /Apply for Invalid Test Scheme/i });
    expect(applyBtn).toBeDisabled();
  });

  it('5. Scheme names and URLs cannot be mixed up across multiple schemes', () => {
    render(
      <AppProvider>
        <IncentiveFinderPage />
      </AppProvider>
    );

    const applyButtons = screen.getAllByRole('button', { name: /Apply for/i });

    // Open first scheme (PSI)
    fireEvent.click(applyButtons[0]);
    expect(screen.getAllByText('industry.maharashtra.gov.in').length).toBeGreaterThan(0);
    
    // Cancel first modal
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }));

    // Open second scheme (Electricity Duty)
    fireEvent.click(applyButtons[1]);
    expect(screen.getAllByText('industry.maharashtra.gov.in').length).toBeGreaterThan(0);

    // Cancel second modal
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }));

    // Open third scheme (CMEGP)
    fireEvent.click(applyButtons[2]);
    expect(screen.getAllByText('maha-cmegp.gov.in').length).toBeGreaterThan(0);

    // Confirm CMEGP opens maha-cmegp.gov.in
    fireEvent.click(screen.getByRole('button', { name: /Continue to Official Website for/i }));
    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      'https://maha-cmegp.gov.in',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
