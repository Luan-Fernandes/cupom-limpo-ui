import { CadastroRequestType, CompleteLoginRequestType } from '@/types/TypeRequest';
import { AuthResponseType, CheckCpfResponseType } from '@/types/TypesResponse';
import { userDate } from '@/types/dataUser';
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: userDate | null;
  token: string | null;
  loading: boolean;
  login: (cpf: string, password: string) => Promise<AuthResponseType>;
  logout: () => void;
  checkCpf: (cpf: string) => Promise<CheckCpfResponseType>;
  completeRegister: (data: CompleteLoginRequestType) => Promise<AuthResponseType>;
  register: (data: CadastroRequestType) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  validateResetToken: (token: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  preRegisterCpf: (cpf: string) => Promise<any>;
  uploadNota: (file: File) => Promise<any>;
  getNotas: () => Promise<any>;
}

export const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);
