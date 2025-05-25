'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './useAuth';
import * as AuthService from '@/services/authService';
import Cookies from 'js-cookie';
import { userDate } from '@/types/dataUser';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userDate | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      const cookieToken = Cookies.get('authToken');
      const storedUser = localStorage.getItem('user');

      if (cookieToken) {
        setToken(cookieToken);
        try {
          const decodedUser = jwtDecode<userDate>(cookieToken);
          setUser(decodedUser);
        } catch (error) {
          console.error('Erro ao decodificar token do cookie:', error);
          Cookies.remove('authToken');
        }
      } else if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Erro ao parsear user do localStorage:', err);
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    loadAuthData();
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
      setUser(res.user);
      console.log(token, user);
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