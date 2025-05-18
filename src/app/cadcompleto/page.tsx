"use client";

import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { CheckCpfResponseType, Rotas } from "@/types/TypesResponse";
import FlashMessage from "@/components/flashMessage";
import LoadingSpinner from "@/components/loading";
import Image from "next/image";
import logo from "../../img/logo.png";
import { useAuth } from "@/Context/useAuth";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const router = useRouter();
  const { checkCpf } = useAuth();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!cpf?.trim()) {
      setError("Por favor, insira um CPF.");
      setLoading(false);
      return;
    }

    const cpfNormalizado = cpf.replace(/\D/g, "");
    localStorage.setItem("cpf", cpf);

    try {
      const { completeCadastro } = await checkCpf(cpfNormalizado);
      const nextRoute = completeCadastro ? Rotas.cadastrar : Rotas.loginPass;
      router.push(nextRoute);
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setError("CPF inválido ou não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center justify-center">
            <Image src={logo} alt="Logo" width={200} height={200}></Image>
            <h1 className="text-2xl text-gray-800 font-bold">Cadastro Completo com sucesso.</h1>
            <p className="text-sm text-gray-500 ">Verifique seu e-mail para concluir ser verificado.</p>
            <button onClick={() => router.push(Rotas.login)} className="w-36 h-[48px] border-amber-50 bg-green-500 shadow-3xl border-4 cursor-pointer flex items-center justify-center rounded-2xl">Ir para login</button>
        </div>
      </div>
    </div>
  );
}
