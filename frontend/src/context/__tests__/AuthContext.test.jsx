import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthContext, AuthProvider } from '../AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { useContext } from 'react';

// Mock authService and toast
vi.mock('../../services/authService');
vi.mock('react-hot-toast');

// Test component to consume context
const TestComponent = () => {
    const { user, isAuthenticated, loading, login, register, logout } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div data-testid="user-name">{user ? user.name : 'No User'}</div>
            <button onClick={() => login({ email: 'test@example.com', password: 'password' }).catch(() => { })}>Login</button>
            <button onClick={() => register({ name: 'Test User', email: 'test@example.com', password: 'password' }).catch(() => { })}>Register</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('initializes with loading state and checks auth', async () => {
        authService.getStoredUser.mockReturnValue(null);
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated'));
    });

    it('initializes as authenticated if token and user exist', async () => {
        const mockUser = { name: 'Test User' };
        localStorage.setItem('token', 'fake-token');
        authService.getStoredUser.mockReturnValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated'));
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    });

    it('logs in successfully', async () => {
        authService.getStoredUser.mockReturnValue(null);
        const mockUser = { name: 'Logged In User' };
        authService.login.mockResolvedValue({ user: mockUser });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        act(() => {
            screen.getByText('Login').click();
        });

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated'));
        expect(screen.getByTestId('user-name')).toHaveTextContent('Logged In User');
        expect(toast.success).toHaveBeenCalledWith('Welcome back!');
    });

    it('handles login failure', async () => {
        authService.getStoredUser.mockReturnValue(null);
        const error = new Error('Login failed');
        authService.login.mockRejectedValue(error);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        await act(async () => {
            try {
                await screen.getByText('Login').click();
            } catch (e) {
                // Ignore error boundary here as we expect it
            }
        });

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    it('registers successfully', async () => {
        authService.getStoredUser.mockReturnValue(null);
        const mockUser = { name: 'New User' };
        authService.register.mockResolvedValue({ user: mockUser });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        act(() => {
            screen.getByText('Register').click();
        });

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated'));
        expect(screen.getByTestId('user-name')).toHaveTextContent('New User');
        expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
    });

    it('logs out successfully', async () => {
        const mockUser = { name: 'Test User' };
        localStorage.setItem('token', 'fake-token');
        authService.getStoredUser.mockReturnValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated'));

        act(() => {
            screen.getByText('Logout').click();
        });

        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated'));
        expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
        expect(authService.logout).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
    });
});
