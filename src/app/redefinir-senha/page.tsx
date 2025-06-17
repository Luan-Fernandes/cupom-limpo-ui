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
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const { forgotPassword, loading } = useAuth();
  const [steps, setSteps] = useState(1);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingPage(true);

    if (!email) {
      setError("Por favor, digite seu email.");
      setLoadingPage(false);
      return;
    }

    try {

      await forgotPassword(email);
      setSteps(2);
      setError(""); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao enviar email de redefinição. Tente novamente.");
    } finally {
      setLoadingPage(false);
    }
  };

  const renderContentByStep = () => {
    if (steps === 1) {
      return (
        <div className="w-full flex flex-col justify-center items-center gap-3 mb-6">
          <h1 className="text-sm w-full text-left text-gray-800">
            Enviaremos um email para você, para redefinir sua senha.
          </h1>

          <Input
            label="Email"
            type="email"
            value={email}
            onValueChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
            disabled={loadingPage || loading}
          >
            {loadingPage || loading ? <LoadingSpinner /> : "Enviar"}
          </button>
        </div>
      );
    }

    if (steps === 2) {
      return (
        <div className="w-full flex flex-col justify-center items-center gap-3 mb-6">
          <h1 className="text-sm w-full text-center text-gray-800">
            Verifique seu e-mail para redefinir sua senha.
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Um link para redefinir sua senha foi enviado para <strong className="break-all">{email}</strong>.
            Verifique sua caixa de entrada e, se não encontrar, verifique a pasta de spam.
          </p>
          <Link href={Rotas.login} className="mt-4 text-green-600 hover:underline">
            Voltar para o Login
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gradient-to-r border from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      <FlashMessage
        message={error}
        open={!!error}
        onClose={() => setError("")}
      />
      {(loadingPage || loading) && <LoadingSpinner />}
      <div className="bg-gradient-to-b  flex-col gap-10 from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <Link className="w-full flex justify-start" href={Rotas.login}>
          <ArrowLeft className="cursor-pointer text-2xl text-gray-900 hover:text-black" />
        </Link>
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="text-4xl w-full font-bold text-center text-gray-800 mb-6">
            Recupere sua Senha
          </div>

          {renderContentByStep()}

          <div className="text-center mt-6">
            <span className="text-sm text-gray-700">
              Não possui conta?
              <Link
                href={Rotas.cadastrar}
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