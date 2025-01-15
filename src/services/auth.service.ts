import { LoginResponse, UserRole } from "@/types/auth";
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'
const COOKIE_OPTIONS = {
    expires: 1, // Cookie expires in 7 days
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'strict',
    path: '/'
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`http://localhost:3000/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json().then((data) => {return data as LoginResponse});
}

export const register = async (email: string, password: string, name: string, role: UserRole = 'client'): Promise<LoginResponse> => {
    const response = await fetch(`http://localhost:3000/api/v1/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
    });
    
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json().then((data) => {return data as LoginResponse});
}

export const logout = (): void => {
    removeAuthToken();
}

export const reloadPage = () => {
    window.location.reload();
}

export const setAuthToken = (token) => {
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
}

export const getAuthToken = () => {
    return Cookies.get(TOKEN_KEY);
}

export const removeAuthToken = () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
}

export const isAuthenticated = () => {
    return !!getAuthToken();
}