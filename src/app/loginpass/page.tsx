"use client";

import FlashMessage from "@/components/flashMessage";
import { Input } from "@/components/input";
import LoadingSpinner from "@/components/loading";
import { useAuth } from "@/Context/useAuth";
import { Rotas } from "@/types/TypesResponse";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function LoginPage() {
  const [senha, setSenha] = useState<string>("");
  const cpf = localStorage.getItem("cpf") as string;
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token, user } = useAuth();

  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const cpfNormalizado = cpf.replace(/\D/g, "");
    try {
      const data = await login(cpfNormalizado, senha);
      console.log(token, user);
    } catch (error) {
      setError("CPF inválido ou não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-r border from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
       <FlashMessage message={error} open={!!error} onClose={() => setError('')} />
       {loading && <LoadingSpinner/>}
      <div className="bg-gradient-to-b flex flex-col gap-10 from-white to-zinc-200  lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <Link className="w-full flex justify-start" href={Rotas.login}>
          <ArrowLeft className="cursor-pointer text-2xl text-gray-900 hover:text-black" />
        </Link>
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="text-4xl w-full font-bold text-center text-gray-800 mb-6">
            Digite sua senha
          </div>

          <div className="w-full flex flex-col flex-cols gap-2 mb-6">
            <Input label="CPF" type="text" value={cpf} />
            <Input
              label="Senha"
              type="text"
              value={senha}
              onValueChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} className="w-[300px]  py-3 bg-gradient-to-r from-green-400 to-green-600  text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105">
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
