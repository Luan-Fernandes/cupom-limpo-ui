"use client";
import { z } from "zod";
import { Input } from "@/components/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { ReactHTMLElement, useState } from "react";
import { useAuth } from "@/Context/useAuth";
import { CadastroRequestType } from "@/types/TypeRequest";
import LoadingSpinner from "@/components/loading";
import FlashMessage from "@/components/flashMessage";
import { useRouter } from "next/navigation";
import { Rotas } from "@/types/TypesResponse";
import Cookies from 'js-cookie';

const emailSchema = z.string().email();
const nomeSchema = z
  .string()
  .min(2, "O nome deve ter pelo menos 2 letras")
  .regex(/^[a-zA-Z]$/, "O nome deve conter apenas letras")
  .transform((val) => val.trim());
export default function LoginPage() {
  const { register, loading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [cpf, setCpf] = useState("");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
    const router = useRouter();
  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoadingPage(true);

    if (!emailSchema.safeParse(email).success) {
      setError('Email inválido');
      setLoadingPage(false);
      return;
    }

    if (nome.length < 3) {
      setError('Nome inválido');
      setLoadingPage(false);
      return;
    }
    if (!cpf) {
      setError('Por favor, insira um CPF.');
      setLoadingPage(false);
      return;
    }

    if (cpf.replace(/\D/g, '').length < 11) {
      setError('CPF inválido (deve ter 11 dígitos numéricos)');
      setLoadingPage(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas devem ser iguais');
      setLoadingPage(false);
      return;
    }
   

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setLoadingPage(false);
      return;
    }

    const normalizarCpf = cpf.replace(/\D/g, '');
    const data: CadastroRequestType = {
      username: nome,
      email: email,
      password: password,
      cpf: normalizarCpf,
    };

    try {
      await register(data);
      Cookies.set('justRegistered', 'true', {
        path: '/',
        sameSite: 'lax',
        expires: 1/24
      });
      router.push(Rotas.cadcompleto)
    } catch (e: any) {
      setError(e.response.data.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleCpfChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleNomeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const valor = e.target.value;
    setNome(valor);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(e.target.value);
  }
  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      <FlashMessage message={error} open={!!error} onClose={() => setError('')} />
      {loadingPage || loading && <LoadingSpinner />}
      <div className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] lg:h-[700px] h-[635px] rounded-3xl shadow-xl p-10 flex justify-center items-center relative">
        <Link href={"/login"}>
          <ArrowLeft className="cursor-pointer absolute w-10 h-10 top-4 left-4 z-50 p-2 text-2xl text-gray-900 hover:text-black" />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-1 items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold text-center text-gray-800 mb-6 pt-2">
             Cadastrar-se
            </div>
          </div>

          <div className="text-sm text-center text-gray-500 mb-8">
            Insira seus dados para finalizar o cadastro
          </div>

          <div className="w-full flex flex-col gap-2 mb-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onValueChange={handleChange}
            />
            <Input
              label="Nome"
              type="text"
              value={nome}
              onValueChange={handleNomeChange}
            />
            <Input
              label="CPF"
              type="text"
              value={cpf}
              onValueChange={handleCpfChange}
            />
            <Input label="Senha" type="password" onValueChange={handlePasswordChange}/>
            <Input label="Confime sua senha" type="password" onValueChange={handleConfirmPasswordChange} />
          </div>

          <button className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-2xl hover:from-green-500 hover:to-green-700 transition duration-300 transform hover:scale-105">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
