import Cookies from "js-cookie";
import {
  ApiResponse,
  AuthResponseType,
  CheckCpfResponseType,
  NotaFiscal,
} from "@/types/TypesResponse";
import api from "./api";
import {
  CadastroRequestType,
  CompleteLoginRequestType,
} from "@/types/TypeRequest";

export const login = async (
  cpf: string,
  password: string
): Promise<AuthResponseType> => {
  const res = await api.post("/auth/login", { cpf, password });

  Cookies.set("authToken", res.data.token, { expires: 7, path: "/" });

  return res.data;
};

export const checkCpf = async (cpf: string): Promise<CheckCpfResponseType> => {
  const res = await api.post("/auth/check-cpf", { cpf });
  return res.data;
};

export const completeRegister = async (
  data: CompleteLoginRequestType
): Promise<AuthResponseType> => {
  const res = await api.put("/auth/complete-register", data);
  return res.data;
};

export const register = async (data: CadastroRequestType) => {
  const res = await api.post("/user/register", data);
  return res.data;
};

export const resendVerification = async (email: string) => {
  const res = await api.post("/user/resend-verification", { email });
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await api.get(`/auth/verify?token=${token}`);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/user/forgot-password", { email });
  return res.data;
};

export const validateResetToken = async (token: string) => {
  const res = await api.get(`/user/reset-password/${token}`);
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await api.put(`/user/reset-password/${token}`, { newPassword });
  return res.data;
};

export const preRegisterCpf = async (cpf: string) => {
  const res = await api.post("/user/pre-register-cpf", { cpf });
  return res.data;
};

export const uploadNota = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/notas/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const findMyNotes = async (
  page = 1,
  limit = 20
): Promise<{
  data: NotaFiscal[];
  total: number;
  page: number;
  lastPage: number;
}> => {
  try {
    const res = await api.get("/notas", {
      params: {
        page,
        limit,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar minhas notas:", error);
    throw error;
  }
};

export const getNotas = async (page = 1, limit = 10) => {
  const res = await api.get("/notas", {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

export const getNotasAgrupadas = async (
  page: number,
  limit: number
): Promise<ApiResponse> => {
  const res = await api.get("/notas/agrupadas", {
    params: {
      page,
      limit,
      sortBy: "dateEmissao",
      order: "desc",
    },
  });
  return res.data;
};

export const logout = () => {
  Cookies.remove("authToken");
  localStorage.removeItem("user");
};
