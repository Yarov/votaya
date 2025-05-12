'use client';

import { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  isOpen: boolean;
}

export default function ConfirmationModal({ message, onConfirm, isOpen }: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cuando el modal se abre, enfoca el botón de confirmación
    if (isOpen && modalRef.current) {
      const confirmButton = modalRef.current.querySelector('button');
      confirmButton?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/1">
      <div 
        ref={modalRef}
        className="bg-white/90 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all border border-gray-200"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 mb-4">
            <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
          <button
            onClick={onConfirm}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 sm:text-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
