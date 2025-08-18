import { render } from '@testing-library/react';
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

    expect(Paystack).toHaveBeenCalledTimes(1);
    const paystackInstance = (Paystack as jest.Mock).mock.instances[0];
    expect(paystackInstance.checkout).toHaveBeenCalledWith({
      publicKey: 'pk_test_123',
      email: 'test@example.com',
      amount: 1000,
      onSuccess: expect.any(Function),
      onClose: expect.any(Function),
    });
  });
});
