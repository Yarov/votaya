/**
 * Configuración de Clerk para el dominio votaya.org
 * Este archivo debe ser importado en los archivos que usan Clerk
 */

export const clerkConfig = {
  authorizedParties: ['https://votaya.org'],
  // Configuraciones específicas de producción
};

/**
 * Configuración de localización en español para Clerk
 */
export const clerkLocalization = {
  locale: "es",
  socialButtonsBlockButton: "Continuar con {{provider}}",
  signIn: {
    start: {
      title: "Iniciar sesión",
      subtitle: "para continuar en VotaYA",
      actionText: "¿No tienes una cuenta?",
      actionLink: "Registrarse"
    },
    emailLink: {
      title: "Verificar correo",
      subtitle: "para continuar en VotaYA",
      formTitle: "Enlace de verificación",
      resendButton: "Reenviar enlace"
    },
    emailCode: {
      title: "Verificar correo",
      subtitle: "para continuar en VotaYA",
      formTitle: "Código de verificación",
      resendButton: "Reenviar código"
    }
  },
  signUp: {
    start: {
      title: "Crear cuenta",
      subtitle: "para participar en VotaYA",
      actionText: "¿Ya tienes una cuenta?",
      actionLink: "Iniciar sesión"
    }
  }
};
