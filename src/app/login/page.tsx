'use client';

import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react"
import { Rotas } from "@/types/TypesResponse";
import FlashMessage from "@/components/flashMessage";
import LoadingSpinner from "@/components/loading";
import { useAuth } from "@/Context/useAuth";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

export default function LoginPage() {
  const imagemFundo = "/imagemFundo.png";
  const [cpf, setCpf] = useState("");
  const router = useRouter();
  const { checkCpf, loading } = useAuth();
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const transition: Transition = {
    type: "spring",
    ease: "easeOut",
    stiffness: 30,
    damping: 12,
  };

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
        expires: 1 / 24
      });

      const nextRoute = completeCadastro ? Rotas.completecad : Rotas.loginPass;
      router.push(nextRoute);
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setError("CPF inválido ou não encontrado.");
    } finally {
      setLoadingPage(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center" style={{
      backgroundImage: `url(${imagemFundo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {(loadingPage || loading) && <LoadingSpinner />}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 p-8">
        <motion.h1
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 50%, #cbd5e1 67%, #ffffff 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "3.5rem",
            fontWeight: 800,
            textShadow: "0 4px 12px rgba(0,0,0,0.1)",
            letterSpacing: "-0.02em",
          }}
        >
          Cupom-Limpo
        </motion.h1>

        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
          className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center"
        >
          <div className="flex flex-col gap-1 items-center justify-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.2 }}
              className="text-4xl font-bold text-center text-gray-800 mb-6"
            >
              Bem-vindo!
            </motion.div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.3 }}
              className="text-sm text-center text-gray-500 mb-8"
            >
              Faça login para continuar acessando sua conta
            </motion.div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.4 }}
              className="w-full flex gap-2 mb-6"
            >
              <Input
                label="CPF"
                type="text"
                value={cpf}
                onValueChange={handleChangeCpf as any}
              />
              <FlashMessage message={error} open={!!error} onClose={() => setError('')} />
            </motion.div>

            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 16px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300"
            >
              Entrar
            </motion.button>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.6 }}
              className="text-center flex flex-col mt-6"
            >
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
              <span className="text-sm text-gray-700">
                Esqueceu sua senha?
                <Link
                  href={Rotas.redefinirSenha}
                  className="text-green-600 hover:underline font-semibold"
                >
                  {" "}
                  Recupe aqui
                </Link>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}