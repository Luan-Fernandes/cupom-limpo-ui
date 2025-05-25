"use client";

import { useRouter } from "next/navigation";
import {  Rotas } from "@/types/TypesResponse";
import Image from "next/image";
import logo from "../../img/logo.png";

export default function LoginPage() {
  
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center justify-center">
            <Image src={logo} alt="Logo" width={200} height={200}></Image>
            <h1 className="text-2xl text-gray-800 font-bold">Cadastrado com sucesso.</h1>
            <p className="text-sm text-gray-500 ">Verifique seu e-mail para concluir ser verificado.</p>
            <button onClick={() => router.push(Rotas.login)} className="w-36 h-[48px] border-amber-50 bg-green-500 shadow-3xl border-4 cursor-pointer flex items-center justify-center rounded-2xl">Fazer login</button>
        </div>
      </div>
    </div>
  );
}
