
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
import { motion, AnimatePresence, Transition } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const { forgotPassword, loading } = useAuth();
  const [steps, setSteps] = useState(1);
  const imagemFundo = "/imagemFundo.png";
  const transition: Transition = {
    type: "spring",
    ease: "easeOut",
    stiffness: 30,
    damping: 12,
  };



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
      setError(err.response?.data?.message || "Erro ao enviar email. Tente novamente.");
    } finally {
      setLoadingPage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${imagemFundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <FlashMessage message={error} open={!!error} onClose={() => setError("")} />
      {(loadingPage || loading) && <LoadingSpinner />}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transition}
        className="bg-gradient-to-b from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center relative"
      >
        <Link href={Rotas.login}>
          <ArrowLeft className="cursor-pointer absolute w-10 h-10 top-4 left-4 z-50 p-2 text-2xl text-gray-900 hover:text-black" />
        </Link>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.1 }}
          className="flex flex-col gap-1 items-center justify-center"
        >
          <motion.div
            className="text-4xl font-bold text-center text-gray-800 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.2 }}
          >
            Recupere sua Senha
          </motion.div>

          <AnimatePresence mode="wait">
            {steps === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ...transition, delay: 0.3 }}
                className="w-full flex flex-col justify-center items-center gap-3 mb-6"
              >
                <p className="text-sm w-full text-left text-gray-800">
                  Enviaremos um email para você redefinir sua senha.
                </p>

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onValueChange={(e) => setEmail(e.target.value)}
                />

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300"
                  disabled={loadingPage || loading}
                >
                  {loadingPage || loading ? <LoadingSpinner /> : "Enviar"}
                </motion.button>
              </motion.div>
            )}

            {steps === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ...transition, delay: 0.3 }}
                className="w-full flex flex-col justify-center items-center gap-3 mb-6"
              >
                <h1 className="text-sm w-full text-center text-gray-800">
                  Verifique seu e-mail para redefinir sua senha.
                </h1>
                <p className="text-sm text-gray-600 text-center">
                  Um link foi enviado para{" "}
                  <strong className="break-all">{email}</strong>.
                  Verifique sua caixa de entrada e spam.
                </p>
                <Link href={Rotas.login} className="mt-4 text-green-600 hover:underline">
                  Voltar para o Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 0.8 }}
          >
            <span className="text-sm text-gray-700">
              Não possui conta?
              <Link
                href={Rotas.cadastrar}
                className="text-green-600 hover:underline font-semibold"
              >
                {" "}Crie sua conta aqui
              </Link>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
