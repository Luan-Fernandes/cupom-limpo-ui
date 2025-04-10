"use client";

import Link from "next/link";
import { Input } from "./input";
import { useState } from "react";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");

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
      <div className="bg-gradient-to-b from-white to-zinc-200  lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
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
          </div>

          <button className="w-[300px]  py-3 bg-gradient-to-r from-green-400 to-green-600  text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105">
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
