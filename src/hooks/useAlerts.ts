import { useState, useCallback } from 'react';

interface AlertOptions {
  autoHideDuration?: number;
  onClose?: () => void;
}

interface UseAlertsReturn {
  showLoginAlert: boolean;
  showSuccessAlert: boolean;
  successMessage: string;
  showErrorAlert: boolean;
  errorMessage: string;
  
  // Métodos para mostrar alertas
  displayLoginAlert: (options?: AlertOptions) => void;
  displaySuccessAlert: (message: string, options?: AlertOptions) => void;
  displayErrorAlert: (message: string, options?: AlertOptions) => void;
  
  // Métodos para cerrar alertas
  closeLoginAlert: () => void;
  closeSuccessAlert: () => void;
  closeErrorAlert: () => void;
}

export function useAlerts(): UseAlertsReturn {
  // Estados para diferentes tipos de alertas
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Función para mostrar alerta de login
  const displayLoginAlert = useCallback((options?: AlertOptions) => {
    setShowLoginAlert(true);
    
    if (options?.autoHideDuration) {
      setTimeout(() => {
        setShowLoginAlert(false);
        options.onClose?.();
      }, options.autoHideDuration);
    }
  }, []);

  // Función para mostrar alerta de éxito
  const displaySuccessAlert = useCallback((message: string, options?: AlertOptions) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    
    if (options?.autoHideDuration) {
      setTimeout(() => {
        setShowSuccessAlert(false);
        options.onClose?.();
      }, options.autoHideDuration);
    } else {
      // Por defecto, las alertas de éxito se ocultan después de 3 segundos
      setTimeout(() => {
        setShowSuccessAlert(false);
        options?.onClose?.();
      }, 3000);
    }
  }, []);

  // Función para mostrar alerta de error
  const displayErrorAlert = useCallback((message: string, options?: AlertOptions) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
    
    if (options?.autoHideDuration) {
      setTimeout(() => {
        setShowErrorAlert(false);
        options.onClose?.();
      }, options.autoHideDuration);
    }
  }, []);

  // Funciones para cerrar alertas
  const closeLoginAlert = useCallback(() => {
    setShowLoginAlert(false);
  }, []);

  const closeSuccessAlert = useCallback(() => {
    setShowSuccessAlert(false);
  }, []);

  const closeErrorAlert = useCallback(() => {
    setShowErrorAlert(false);
  }, []);

  return {
    // Estados
    showLoginAlert,
    showSuccessAlert,
    successMessage,
    showErrorAlert,
    errorMessage,
    
    // Métodos para mostrar alertas
    displayLoginAlert,
    displaySuccessAlert,
    displayErrorAlert,
    
    // Métodos para cerrar alertas
    closeLoginAlert,
    closeSuccessAlert,
    closeErrorAlert
  };
}
