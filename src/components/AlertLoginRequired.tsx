"use client";
import { SignInButton } from "@clerk/nextjs";

interface AlertLoginRequiredProps {
  onClose?: () => void;
  message?: string;
}

export default function AlertLoginRequired({ onClose, message }: AlertLoginRequiredProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 flex flex-col items-center animate-fade-in">
        <span className="text-3xl mb-2 text-gray-800">🔒</span>
        <h2 className="text-lg font-bold mb-2 text-gray-800">Inicia sesión para continuar</h2>
        <p className="text-gray-600 mb-4 text-center">{message || 'Debes estar autenticado para realizar esta acción.'}</p>
        <div className="flex gap-2 w-full">
          <SignInButton mode="modal">
            <button className="flex-1 bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300">
              Iniciar Sesión
            </button>
          </SignInButton>
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
