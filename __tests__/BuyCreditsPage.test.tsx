import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BuyCreditsPage from '../pages/BuyCreditsPage';
import { useAppContext } from '../contexts/AppContext';
import usePaystack from '../hooks/usePaystack';

jest.mock('../contexts/AppContext');
jest.mock('../hooks/usePaystack');

const mockUseAppContext = useAppContext as jest.Mock;
const mockUsePaystack = usePaystack as jest.Mock;

describe('BuyCreditsPage', () => {
  it('should call payWithPaystack when a buy button is clicked', () => {
    const payWithPaystack = jest.fn();
    mockUseAppContext.mockReturnValue({
      user: { email: 'test@example.com' },
    });
    mockUsePaystack.mockReturnValue(payWithPaystack);

    const originalImportMeta = (global as any).importMeta;
    (global as any).importMeta = { env: { VITE_PAYSTACK_PUBLIC_KEY: 'pk_test_123' } } as any;

    render(<BuyCreditsPage />);

    fireEvent.click(screen.getAllByText('Buy Now')[0]);

    expect(payWithPaystack).toHaveBeenCalled();

    (global as any).importMeta = originalImportMeta;
  });
});
