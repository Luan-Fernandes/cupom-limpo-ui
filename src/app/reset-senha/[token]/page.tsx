'use client';
import { use, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/Context/useAuth';
import FlashMessage from "@/components/flashMessage";
import { Input } from "@/components/input";
import LoadingSpinner from "@/components/loading";
import Link from 'next/link';
import { Rotas } from '@/types/TypesResponse';


export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string; 

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>(''); 
  const [loadingPage, setLoadingPage] = useState<boolean>(true); 
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [steps, setSteps] = useState(1);

  const { validateResetToken, resetPassword, loading } = useAuth()

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token de redefinição não encontrado na URL.');
        setLoadingPage(false);
        return;
      }

      try {
        setLoadingPage(true);
        await validateResetToken(token);
        setIsTokenValid(true); 
        setError(''); 
      } catch (err: any) {
        setError(err.response?.data?.message || 'Token inválido ou expirou. Por favor, solicite uma nova redefinição.');
        setIsTokenValid(false);
      } finally {
        setLoadingPage(false);
      }
    };

    validateToken();
  }, [token, validateResetToken]); 

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPage(true);

    if (newPassword.length < 6) { 
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      setLoadingPage(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoadingPage(false);
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage('Sua senha foi redefinida com sucesso! Você já pode fazer login.');
      setError(''); 
      
      setSteps(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setLoadingPage(false);
    }
  };

  if (loadingPage || loading) {
    return <LoadingSpinner />;
  }

  const renderContentByStep = () => {
    if (steps === 1) {
      return(
        <form onSubmit={handleResetPassword} className="w-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-sm w-full text-left text-gray-800">
          Digite sua nova senha.
        </h1>

        <Input
          label="Nova Senha"
          type="password"
          value={newPassword}
          onValueChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirmar Nova Senha"
          type="password"
          value={confirmPassword}
          onValueChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-[300px] py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg rounded-2xl shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
          disabled={loadingPage || loading}
        >
          {loadingPage || loading ? <LoadingSpinner /> : "Redefinir Senha"}
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
      )
    }
    if(steps === 2) {
      return (
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <h1 className="text-sm w-full text-center text-gray-800">
            Sua senha foi redefinida com sucesso! Vocês já pode fazer login.
          </h1>
        </div>
      )
    }
  }

  return (
    <div className="bg-gradient-to-r border from-green-400 to-teal-500 min-h-screen flex items-center justify-center">
      <FlashMessage
        message={error || message} 
        open={!!error || !!message}
        onClose={() => { setError(""); setMessage(""); }}
      />
      <div className="bg-gradient-to-b flex-col gap-10 from-white to-zinc-200 lg:w-[500px] w-[370px] h-[500px] rounded-3xl shadow-xl p-10 flex justify-center items-center">
        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <div className="text-4xl w-full font-bold text-center text-gray-800 mb-6">
            Redefinir Senha
          </div>

          {!isTokenValid ? (
            <div className="text-center text-red-600">
              <p>{error || 'Token inválido ou expirado.'}</p>
              <Link href={Rotas.redefinirSenha} className="mt-4 text-green-600 hover:underline">
                Solicitar nova redefinição de senha
              </Link>
            </div>
          ) : (
            renderContentByStep()
          )}

          <div className="text-center mt-6">
            <span className="text-sm text-gray-700">
              Lembrou da senha?
              <Link
                href={Rotas.login}
                className="text-green-600 hover:underline font-semibold"
              >
                {" "}
                Fazer Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}