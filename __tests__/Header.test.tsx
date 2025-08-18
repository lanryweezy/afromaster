import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext');

const mockUseAppContext = useAppContext as jest.Mock;

describe('Header', () => {
  it('should display login button when user is not authenticated', () => {
    mockUseAppContext.mockReturnValue({
      isAuthenticated: false,
    });
    render(<Header />);
    expect(screen.getByText('Log In / Sign Up')).toBeInTheDocument();
  });

  it('should display logout button when user is authenticated', () => {
    mockUseAppContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com' },
    });
    render(<Header />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
