'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';

import * as AuthService from '@/services/authService';
import { AuthContext } from './useAuth';
import { jwtDecode } from 'jwt-decode';
import { userDate } from '@/types/dataUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userDate | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromCookies = async () => {
      const cookieToken = Cookies.get('authToken');

      if (cookieToken) {
        setToken(cookieToken);
        try {
          const decodedUser = jwtDecode<userDate>(cookieToken);
          setUser(decodedUser);
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          setUser(null);
          Cookies.remove('authToken');
        }
      }
      setLoading(false);
    };

    loadUserFromCookies();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (cpf: string, password: string) => {
    setLoading(true);
    try {
      const res: any = await AuthService.login(cpf, password);
      setToken(res.token);
      Cookies.set('authToken', res.token, { expires: 7 });
      try {
        const decodedUser = jwtDecode<userDate>(res.token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Erro ao decodificar token no login:', error);
        setUser(null);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    localStorage.clear();
    Cookies.remove('authToken');
    AuthService.logout();
    router.push('/login');
    setLoading(false);
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