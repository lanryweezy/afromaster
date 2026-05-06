import { renderHook } from '@testing-library/react';
import usePaystack from '../hooks/usePaystack';
import { useAppContext } from '../contexts/AppContext';

jest.mock('@paystack/inline-js', () => {
  return jest.fn().mockImplementation(() => ({
    newTransaction: jest.fn()
  }));
});

jest.mock('../contexts/AppContext');

const mockUseAppContext = useAppContext as jest.Mock;

describe('usePaystack', () => {
  it('should initialize successfully', () => {
    mockUseAppContext.mockReturnValue({
      user: { email: 'test@example.com' },
    });

    const { result } = renderHook(() => usePaystack());
    expect(typeof result.current).toBe('function');
  });
});
