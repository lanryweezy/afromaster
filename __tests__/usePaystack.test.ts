<<<<<<< HEAD
import { renderHook } from '@testing-library/react';
=======
import { render } from '@testing-library/react';
>>>>>>> main
import usePaystack from '../hooks/usePaystack';
import Paystack from '@paystack/inline-js';
import { useAppContext } from '../contexts/AppContext';

jest.mock('@paystack/inline-js');
jest.mock('../contexts/AppContext');

const mockUseAppContext = useAppContext as jest.Mock;

describe('usePaystack', () => {
  it('should call Paystack checkout with the correct options', () => {
    mockUseAppContext.mockReturnValue({
      user: { email: 'test@example.com' },
    });

<<<<<<< HEAD
    const { result } = renderHook(() => usePaystack());
    const payWithPaystack = result.current;

    const options = {
      publicKey: 'pk_test_123',
      email: 'test@example.com',
      amount: 1000,
      currency: 'NGN',
      onSuccess: jest.fn(),
      onClose: jest.fn(),
    };

    payWithPaystack(options);
=======
    const TestComponent = () => {
      const payWithPaystack = usePaystack();
      const options = {
        publicKey: 'pk_test_123',
        email: 'test@example.com',
        amount: 1000,
        onSuccess: jest.fn(),
        onClose: jest.fn(),
      };
      payWithPaystack(options);
      return null;
    };

    render(<TestComponent />);
>>>>>>> main

    expect(Paystack).toHaveBeenCalledTimes(1);
    const paystackInstance = (Paystack as jest.Mock).mock.instances[0];
    expect(paystackInstance.checkout).toHaveBeenCalledWith({
<<<<<<< HEAD
      ...options,
      email: 'test@example.com',
=======
      publicKey: 'pk_test_123',
      email: 'test@example.com',
      amount: 1000,
      onSuccess: expect.any(Function),
      onClose: expect.any(Function),
>>>>>>> main
    });
  });
});
