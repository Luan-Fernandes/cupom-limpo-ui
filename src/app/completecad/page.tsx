"use client";
import { set, z } from "zod";
import { Input } from "@/components/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { ReactHTMLElement, useState } from "react";
import { CompleteLoginRequestType } from "@/types/TypeRequest";
import FlashMessage from "@/components/flashMessage";
import LoadingSpinner from "@/components/loading";
import { useRouter } from "next/navigation";
import { Rotas } from "@/types/TypesResponse";
import { useAuth } from "@/Context/useAuth";

export default function LoginPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const cpf = localStorage.getItem("cpf") as string;
  const { completeRegister } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const emailSchema = z.string().email();
  const nomeSchema = z
    .string()
    .min(2, "O nome deve ter pelo menos 2 letras")
    .regex(/^[a-zA-Z]$/, "O nome deve conter apenas letras")
    .transform((val) => val.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 8 || confirmPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
      return;
    }
    if (!emailSchema.safeParse(email).success) {
      console.log(emailSchema.safeParse(email));
      setLoading(false);
      return;
    }
    if (!nome.length || nome.length < 4) {
      setError("Nome inválido");
      setLoading(false);
      return;
    }
    const normalizarCpf = cpf.replace(/\D/g, "");
    const data: CompleteLoginRequestType = {
      cpf: normalizarCpf,
      username: nome,
      email: email,
      password: password,
    };
    try {
      await completeRegister(data);
      router.push(Rotas.cadcompleto);
    } catch (e) {
      console.error("Erro durante o registro:", e);
      setError("Ocorreu um erro ao completar o registro.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleNomeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNome(e.target.value);
  };
  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      {loading && <LoadingSpinner />}
      <FlashMessage
        message={error}
        open={!!error}
        onClose={() => setError("")}
      />
      <div className="bg-gradient-to-b  flex flex-col gap-10 from-white to-zinc-200 lg:w-[500px] w-[370px] lg:h-[700px] h-[635px] rounded-3xl shadow-xl p-10 flex justify-center items-center relative">
        <div className="w-full flex justify-start">
          <Link href={Rotas.login}>
            <ArrowLeft className="cursor-pointer top-4 w-10 h-10 left-4 z-50 p-2 text-2xl text-gray-900 hover:text-black" />
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-1 items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold text-center text-gray-800 mb-6 pt-2">
              Bem vindo!
            </div>
          </div>

          <div className="text-sm text-center text-gray-500 mb-8">
            Insira seus dados para finalizar o cadastro
          </div>

          <div className="w-full flex flex-col gap-2 mb-6">
            <Input label="CPF" type="text" value={cpf} />
            <Input
              label="Email"
              type="text"
              value={email}
              onValueChange={handleChangeEmail}
            />
            <Input
              label="Nome"
              type="text"
              value={nome}
              onValueChange={handleNomeChange}
            />
            <Input
              label="Senha"
              type="password"
              onValueChange={handleChangePassword}
            />
            <Input
              label="Confime sua senha"
              type="password"
              onValueChange={handleChangeConfirmPassword}
            />
          </div>

          <button className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-2xl hover:from-green-500 hover:to-green-700 transition duration-300 transform hover:scale-105">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
