/**
 * Configuración centralizada de metadatos para la aplicación VotaYA
 * Este archivo contiene todos los metadatos utilizados en la aplicación
 */

import { Viewport } from 'next';
import { Metadata } from 'next';

// Configuración del viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1f2937" // Color gray-800 de Tailwind
};

// Configuración de metadatos generales
export const siteMetadata = /** @type {Metadata} */ ({
  title: "VotaYA",
  description: "Plataforma de voto y reporte de irregularidades electorales",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default", // Solo puede ser "default", "black" o "black-translucent"
    title: "VotaYA"
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://votaya.org/",
    title: "VotaYA",
    description: "Plataforma de voto y reporte de irregularidades electorales",
    siteName: "VotaYA"
  },
  twitter: {
    card: "summary_large_image",
    title: "VotaYA",
    description: "Plataforma de voto y reporte de irregularidades electorales"
  },
  manifest: "/manifest.json"
});
