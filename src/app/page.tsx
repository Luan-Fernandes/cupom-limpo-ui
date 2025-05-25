"use client";

import { useState } from "react";
import {
  Leaf,
  Lock,
  NotebookText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useAuth } from "@/Context/useAuth";
import { useRouter } from "next/navigation";
import { Rotas } from "@/types/TypesResponse";
import logo from "../img/logo.png";
import Image from "next/image";
import LoadingSpinner from "@/components/loading";

export default function Home() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { token, user, logout, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {loading && <LoadingSpinner />}
      {token && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {token && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-green-800 text-white flex-col  // Tonalidade de fundo mais escura para a sidebar
            transition-all duration-300 ease-in-out
            ${isSidebarMinimized ? "w-20" : "w-64"}
            ${isMobileSidebarOpen ? "flex" : "hidden md:flex"} `}
        >
          <div className="p-4 border-b border-green-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 text-green-300">
                <Image src={logo} alt="Logo"></Image>
              </div>
              <span
                className={`text-xl font-semibold whitespace-nowrap overflow-hidden
                  ${isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"}
                  transition-all duration-300 ease-in-out`}
              >
                Cupom Limpo
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className={`p-1 rounded-full text-green-300 hover:bg-green-700 hover:text-white transition-colors duration-200 ${
                isMobileSidebarOpen ? "hidden md:block" : ""
              }`} // Ícone e hover mantidos
            >
              {isSidebarMinimized ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <a
              href="#"
              className={`flex items-center px-3 py-2 rounded-md text-green-200 hover:bg-green-700 hover:text-white
                ${isSidebarMinimized ? "justify-center" : "space-x-3"}
                transition-all duration-300 ease-in-out`}
              onClick={isMobileSidebarOpen ? toggleMobileSidebar : undefined}
            >
              <NotebookText className="w-5 h-5" />
              <span
                className={`${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }
                  transition-all duration-300 ease-in-out`}
              >
                Minhas Notas
              </span>
            </a>
            <a
              href="#"
              className={`flex items-center px-3 py-2 rounded-md text-green-200 hover:bg-green-700 hover:text-white
                ${isSidebarMinimized ? "justify-center" : "space-x-3"}
                transition-all duration-300 ease-in-out`}
              onClick={isMobileSidebarOpen ? toggleMobileSidebar : undefined}
            >
              <MapPin className="w-5 h-5" />
              <span
                className={`${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }
                  transition-all duration-300 ease-in-out`}
              >
                Lugares Onde Fui
              </span>
            </a>
          </nav>
        </aside>
      )}

      <div
        className={`flex flex-col flex-1 ${
          token && isMobileSidebarOpen ? "ml-64 md:ml-0" : "ml-0"
        }`}
      >
        <header className="bg-green-500 text-white">
          <div className="container mx-auto flex items-center  px-4 ">
            {token && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-1 rounded-full text-white hover:bg-green-700 mr-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Image src={logo} alt="Logo" width={60} height={60}></Image>
            <div className="flex items-center ml-auto gap-4">
              {token && (
                <h1>
                  Bem Vindo, <b>{user?.userName}</b>
                </h1>
              )}
              <button
                onClick={() => (token ? logout() : router.push(Rotas.login))}
                className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                {token ? "Sair" : "Login"}
              </button>
              {!token && (
                <button
                  onClick={() => router.push(Rotas.cadastrar)}
                  className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cadastre-se
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="bg-green-500 bg-[url(../img/fundoHome.png)] bg-cover py-20 flex-1">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Suas Notas Fiscais na Nuvem
            </h1>
            <p className="text-lg text-white mb-8">
              Organize, visualize e acesse suas notas fiscais de forma simples,
              rápida e segura.
            </p>
            <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800">
              Acessar minhas notas
            </button>
          </div>
        </section>

        <section className="py-20 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300">
                <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-800">
                  Acesso na Nuvem
                </h3>
                <p className="text-green-700">
                  Consulte suas notas fiscais de qualquer lugar, a qualquer
                  hora.
                </p>
              </div>
              <div className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300">
                <Lock className="w-12 h-12 mx-auto text-green-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  Segurança Total
                </h3>
                <p className="text-green-800">
                  Seus dados estão protegidos com criptografia e segurança de
                  ponta.
                </p>
              </div>
              <div className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300">
                <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-800">
                  Organização Simples
                </h3>
                <p className="text-green-700">
                  Encontre suas notas rapidamente, sem complicação e sem papel.
                </p>
              </div>
            </div>
          </div>
        </section>
        <footer />
      </div>
    </div>
  );
}
