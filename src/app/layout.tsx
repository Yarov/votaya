import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkLocalization } from "../clerk.config.js";
import { viewport, siteMetadata } from "../metadata.config.js";
import "./globals.css";
import dynamic from 'next/dynamic';

// Importar Navbar como componente del lado del cliente
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

// Exportar viewport y metadata desde el archivo de configuración
export { viewport };
export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <ClerkProvider localization={clerkLocalization}>
        <body className="bg-gray-50 min-h-screen overflow-x-hidden">
          <Navbar />
          <main className="overflow-x-hidden md:container md:mx-auto pt-14 md:pt-0">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-6 mt-8 overflow-x-hidden">
            <div className="md:container md:mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold">VotaYA</h3>
                  <p className="text-gray-300 text-sm">Plataforma de voto y reporte de irregularidades</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href="/privacidad" className="text-gray-300 hover:text-white text-sm transition-colors">Política de Privacidad</a>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-700 pt-4 text-center text-gray-300 text-sm">
                © {new Date().getFullYear()} VotaYA. Todos los derechos reservados.
              </div>
            </div>
          </footer>
        </body>
      </ClerkProvider>
    </html>
  );
}
