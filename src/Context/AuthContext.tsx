// src/Context/AuthContext.tsx
'use client'; // Garantir que é um componente de cliente

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Certifique-se de usar 'next/navigation'
import { CheckCpfResponseType } from './TypesResponse';
import { CompleteLoginRequestType } from './TypeRequest';

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (cpf: string, password: string) => Promise<void>;
  checkCpf: (cpf: string) => Promise<any>;
  completeRegister: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  preRegisterCpf: (cpf: string) => Promise<void>;
  uploadNota: (file: File) => Promise<void>;
  getNotas: () => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Para verificar se o componente foi montado no cliente
  const router = useRouter();

  // Garantir que o useRouter só será chamado após o componente ser montado no cliente
  useEffect(() => {
    setIsMounted(true);
    
    // Recuperar token do localStorage quando o componente for montado
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao parsear usuário do localStorage', error);
      }
    }
  }, []);

  // Efeito para atualizar o localStorage quando o token ou user mudar
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

  // Atualiza os headers da API quando o token mudar
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const api = axios.create({
    baseURL: 'http://localhost:3009',
  });

  const login = async (cpf: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { cpf, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const checkCpf = async (cpf: string) : Promise<CheckCpfResponseType> => {
    try {
      const res = await api.post('/auth/check-cpf', { cpf });
      return res.data;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  };

  const completeRegister = async (data: CompleteLoginRequestType) => {
    try {
      const res = await api.put('/auth/complete-register', data);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.post('/user/register', data);
      return res.data;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const res = await api.post('/user/resend-verification', { email });
      return res.data;
    } catch (error) {
      console.error('Erro ao reenviar verificação:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const res = await api.get(`/auth/verify?token=${token}`);
      return res.data;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post('/user/forgot-password', { email });
      return res.data;
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      throw error;
    }
  };

  const validateResetToken = async (token: string) => {
    try {
      const res = await api.get(`/user/reset-password/${token}`);
      return res.data;
    } catch (error) {
      console.error('Erro ao validar token de redefinição:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await api.put(`/user/reset-password/${token}`, { newPassword });
      return res.data;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  };

  const preRegisterCpf = async (cpf: string) => {
    try {
      const res = await api.post('/user/pre-register-cpf', { cpf });
      return res.data;
    } catch (error) {
      console.error('Erro ao pré-registrar CPF:', error);
      throw error;
    }
  };

  const uploadNota = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/notas/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Erro ao fazer upload da nota:', error);
      throw error;
    }
  };

  const getNotas = async () => {
    try {
      const res = await api.get('/notas');
      return res.data;
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isMounted) {
    return null; // Retorna null enquanto o componente não é montado no cliente
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        checkCpf,
        completeRegister,
        register,
        resendVerification,
        verifyEmail,
        forgotPassword,
        validateResetToken,
        resetPassword,
        preRegisterCpf,
        uploadNota,
        getNotas,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);