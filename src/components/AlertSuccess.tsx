"use client";

interface AlertSuccessProps {
  message?: string;
  onClose?: () => void;
}

export default function AlertSuccess({ message = "¡Voto registrado correctamente!", onClose }: AlertSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 flex flex-col items-center animate-fade-in">
        <span className="text-4xl mb-2 text-green-500">✅</span>
        <h2 className="text-lg font-bold mb-2 text-green-700">¡Éxito!</h2>
        <p className="text-gray-700 mb-4 text-center">{message}</p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors mt-2"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
