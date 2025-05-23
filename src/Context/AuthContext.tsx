'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import * as AuthService from '@/services/authService';
import { AuthContext } from './useAuth';
import { User } from '@/types/user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erro ao parsear user:', err);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (cpf: string, password: string) => {
    const res: any = await AuthService.login(cpf, password);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        checkCpf: AuthService.checkCpf,
        completeRegister: AuthService.completeRegister,
        register: AuthService.register,
        resendVerification: AuthService.resendVerification,
        verifyEmail: AuthService.verifyEmail,
        forgotPassword: AuthService.forgotPassword,
        validateResetToken: AuthService.validateResetToken,
        resetPassword: AuthService.resetPassword,
        preRegisterCpf: AuthService.preRegisterCpf,
        uploadNota: AuthService.uploadNota,
        getNotas: AuthService.getNotas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
