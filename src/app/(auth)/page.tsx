'use client'; // Adicione esta linha se você estiver usando o Next.js App Router

import { useState } from 'react';
import { Rotas } from "@/types/TypesResponse"; // Assumindo que Rotas está corretamente definido
import { Leaf, Lock } from "lucide-react";
import Link from "next/link";
import { Modal } from '@/components/modal';


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    description: '',
    icon: null as React.ReactNode | null, // Inicialize com null
  });

  const openModal = (title: string, description: string, icon: React.ReactNode) => {
    setModalContent({ title, description, icon });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="bg-green-500 bg-[url(../img/fundoHome.png)] bg-cover py-20 flex-1">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Suas Notas Fiscais na Nuvem
          </h1>
          <p className="text-lg text-white mb-8">
            Organize, visualize e acesse suas notas fiscais de forma simples,
            rápida e segura.
          </p>
          <Link href={Rotas.minhasNotas}>
            <button className="bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-green-800">
              Acessar minhas notas
            </button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300"
              onClick={() =>
                openModal(
                  "Acesso na Nuvem",
                  "Consulte suas notas fiscais de qualquer lugar, a qualquer hora, com total flexibilidade e mobilidade.",
                  <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
                )
              }
            >
              <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-800">
                Acesso na Nuvem
              </h3>
              <p className="text-green-700">
                Consulte suas notas fiscais de qualquer lugar, a qualquer hora.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300"
              onClick={() =>
                openModal(
                  "Segurança Total",
                  "Seus dados estão protegidos com criptografia de ponta e as mais avançadas práticas de segurança para garantir a integridade das suas informações.",
                  <Lock className="w-12 h-12 mx-auto text-green-700 mb-4" />
                )
              }
            >
              <Lock className="w-12 h-12 mx-auto text-green-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                Segurança Total
              </h3>
              <p className="text-green-800">
                Seus dados estão protegidos com criptografia e segurança de
                ponta.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="bg-green-100 cursor-pointer hover:bg-green-200 rounded-xl shadow p-6 text-center transition-colors duration-300"
              onClick={() =>
                openModal(
                  "Organização Simples",
                  "Encontre suas notas rapidamente, sem complicação e sem papel. Uma organização intuitiva para otimizar sua gestão fiscal.",
                  <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
                )
              }
            >
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

      {/* O Componente Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        description={modalContent.description}
        icon={modalContent.icon}
      />
    </>
  );
}