import { TextField } from "@mui/material";
import Link from "next/link";
import React from "react"; // Adicione isso no topo do seu arquivo
export function CadastroPage() {
  return (
    <div className="bg-white min-h-screen w-full items-center pt-10 pl-[15rem]">
      <div className=" flex  bg-amber-50 w-[944px] h-[561] ml-5 rounded-3xl shadow-2xl">
        <div className="w-[284px] h-[563px] bg-green-500 rounded-2xl items-center justify-center flex flex-col gap-6">
          <div className="text-2xl text-black">CUPOM LIMPO</div>

          <div className="text-2xl text-white font-bold ">
            Bem - vindo de volta
          </div>
          <div className="  text-white">Acesse sua conta agora</div>

          <Link href={"/entrar"}>
            <div className="w-36 h-[48px] border-amber-50 bg-green-500 shadow-3xl border-4 cursor-pointer flex items-center justify-center rounded-2xl">
              <button className="text-white font-medium cursor-pointer">
                Entrar
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
