'use client';

import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react"
import { CheckCpfResponseType, Rotas } from "@/types/TypesResponse";
import FlashMessage from "@/components/flashMessage";
import LoadingSpinner from "@/components/loading";
import { useAuth } from "@/Context/useAuth";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const router = useRouter();
  const {checkCpf, loading} = useAuth();
  const [error, setError] = useState("");
  
  const [loadingPage, setLoadingPage] = useState<boolean>(false); 


  
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingPage(true);

    if (!cpf?.trim()) {
      setError("Por favor, insira um CPF.");
      setLoadingPage(false);
      return;
    }

    const cpfNormalizado = cpf.replace(/\D/g, '');
    localStorage.setItem("cpf", cpf);

    try {
      const { completeCadastro } = await checkCpf(cpfNormalizado);
      Cookies.set('justRegistered', 'true', {
        path: '/',
        sameSite: 'lax',
        expires: 1/24
      });

      const nextRoute = completeCadastro ? Rotas.completecad : Rotas.loginPass;
      router.push(nextRoute);
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setError("CPF inválido ou não encontrado.");
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
      { loadingPage || loading && <LoadingSpinner/>}
      <div className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="text-4xl font-bold text-center text-gray-800 mb-6">
            Bem-vindo!
          </div>

          <div className="text-sm text-center text-gray-500 mb-8">
            Faça login para continuar acessando sua conta
          </div>

          <div className="w-full flex gap-2 mb-6">
            <Input
              label="CPF"
              type="text"
              value={cpf}
              onValueChange={(e: any) => handleChangeCpf(e)}
            />
            <FlashMessage message={error} open={!!error} onClose={() => setError('')} />
          </div>
          <button
            onClick={handleClick}
            className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
          >
            Entrar
          </button>
          <div className="text-center mt-6">
            <span className="text-sm text-gray-700">
              Não possui conta?
              <Link
                href={"/cadastrar"}
                className="text-green-600 hover:underline font-semibold"
              >
                {" "}
                Crie sua conta aqui
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
