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
  Home,
  ScrollText,
} from "lucide-react";
import { useAuth } from "@/Context/useAuth";
import { useRouter } from "next/navigation";
import { Rotas } from "@/types/TypesResponse";
import logo from "../img/logo.png";
import Image from "next/image";
import LoadingSpinner from "@/components/loading";
import React from "react";
import Link from "next/link";

interface NavBarProps {
  children?: React.ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { token, user, logout, loading } = useAuth();

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
        />
      )}
      {token && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-green-800 text-white flex-col transition-all duration-300 ease-in-out ${
            isSidebarMinimized ? "w-20" : "w-64"
          } ${isMobileSidebarOpen ? "flex" : "hidden md:flex"}`}
        >          <div className="p-4 border-b border-green-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href={Rotas.home} className="cursor-pointer">
                <div className="w-8 h-8 text-green-300 flex-shrink-0">
                  <Image src={logo} alt="Logo" />
                </div>
              </Link>
              <span
                className={`text-xl font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Cupom Limpo
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className={`p-1 rounded-full text-green-300 hover:bg-green-700 hover:text-white transition-colors duration-200 flex-shrink-0 ${
                isMobileSidebarOpen ? "hidden md:block" : ""
              }`}
            >
              {isSidebarMinimized ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              href={Rotas.home}
              className={`flex items-center px-3 py-2 rounded-md text-green-200 hover:bg-green-700 hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${
                isSidebarMinimized ? "justify-center" : "space-x-3"
              }`}
              onClick={isMobileSidebarOpen ? toggleMobileSidebar : undefined}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Home
              </span>
            </Link>

            <Link
              href={Rotas.ondeComprei}
              className={`flex items-center px-3 py-2 rounded-md text-green-200 hover:bg-green-700 hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${
                isSidebarMinimized ? "justify-center" : "space-x-3"
              }`}
              onClick={isMobileSidebarOpen ? toggleMobileSidebar : undefined}
            >
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Lugares Onde Fui
              </span>
            </Link>

            <Link
              href={Rotas.minhasNotas}
              className={`flex items-center px-3 py-2 rounded-md text-green-200 hover:bg-green-700 hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${
                isSidebarMinimized ? "justify-center" : "space-x-3"
              }`}
              onClick={isMobileSidebarOpen ? toggleMobileSidebar : undefined}
            >
              <ScrollText className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Minhas Notas
              </span>
            </Link>
          </nav>
        </aside>
      )}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          token ? (isSidebarMinimized ? "md:ml-20" : "md:ml-64") : "ml-0"
        }`}
      >

        <header className="bg-green-500 text-white">
          <div className="container mx-auto flex items-center px-4">
            {token && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-1 rounded-full text-white hover:bg-green-700 mr-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link href={Rotas.home} className="cursor-pointer">
              <Image src={logo} alt="Logo" width={60} height={60} />
            </Link>
            <div className="flex items-center ml-auto gap-4">
              {token && (
                <h1>
                  Bem Vindo, <b>{user?.userName}</b>
                </h1>
              )}
              {token && (
                <button
                  onClick={logout}
                  className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Sair
                </button>
              )}

              {!token && (
                <Link href={Rotas.login}>
                  <button className="bg-white cursor-pointer text-green-600 px-4 py-2 rounded hover:bg-gray-100">
                    Login
                  </button>
                </Link>
              )}
              {!token && (
                <Link href={Rotas.cadastrar}>
                  <button className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100">
                    Cadastre-se
                  </button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}