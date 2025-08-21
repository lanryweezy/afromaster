import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from '../pages/AuthPage';
import * as firebaseAuth from 'firebase/auth';
import * as AppContextModule from '../contexts/AppContext';

jest.mock('firebase/auth');
jest.mock('../src/firebaseConfig', () => ({
  auth: {},
}));

jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
  setCurrentPage: jest.fn(),
  isAuthenticated: false,
  user: null,
});

jest.spyOn(firebaseAuth, 'onAuthStateChanged').mockReturnValue(jest.fn());

describe('AuthPage', () => {
  it('should call createUserWithEmailAndPassword when signing up', () => {
    const createUserWithEmailAndPassword = jest.spyOn(firebaseAuth, 'createUserWithEmailAndPassword');
    render(<AuthPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password');
  });

  it('should call signInWithEmailAndPassword when logging in', () => {
    const signInWithEmailAndPassword = jest.spyOn(firebaseAuth, 'signInWithEmailAndPassword');
    render(<AuthPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password');
  });

  it('should call signInWithPopup when signing in with Google', () => {
    const signInWithPopup = jest.spyOn(firebaseAuth, 'signInWithPopup');
    render(<AuthPage />);
    fireEvent.click(screen.getByText('Sign in with Google'));
    expect(signInWithPopup).toHaveBeenCalled();
  });
});
