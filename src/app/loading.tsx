import Image from 'next/image'
import React from 'react'
import logo from "../img/logo.png"

export default function loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-green-100 to-green-300 bg-opacity-80 flex justify-center items-center z-50">
    <div className="relative w-40 h-40">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-400 animate-orbit"></div>
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-500 animate-orbit animation-delay-150"></div>
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-600 animate-orbit animation-delay-300"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white shadow-md animate-pulse">
        <div className="absolute inset-0  flex items-center justify-center">
        <Image src={logo} alt="Logo"/>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes orbit {
        0% {
          transform: rotate(0deg) scale(1);
          opacity: 0.8;
        }
        70% {
          transform: rotate(360deg) scale(1.2);
          opacity: 0.3;
        }
        100% {
          transform: rotate(360deg) scale(1);
          opacity: 0.8;
        }
      }

      .animate-orbit {
        animation: orbit 1.8s linear infinite;
      }

      .animation-delay-150 {
        animation-delay: 0.15s;
      }

      .animation-delay-300 {
        animation-delay: 0.3s;
      }
    `}</style>
  </div>
  )
}
