'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PoliticaPrivacidad() {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = 'Política de Privacidad | VotaYA';
  }, []);

  const fechaActualizacion = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          <span>Volver a inicio</span>
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">POLÍTICA DE PRIVACIDAD</h1>
        <p className="text-gray-600 mb-6">Última actualización: {fechaActualizacion}</p>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            En VotaYA, respetamos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información cuando usas nuestro sitio web: www.votaya.org.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. INFORMACIÓN QUE RECOPILAMOS</h2>
          <p className="mb-4">
            VotaYA no solicita ni recopila datos personales sensibles. Sin embargo, podemos recolectar información técnica y anónima como:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Dirección IP</li>
            <li className="mb-2">Navegador utilizado</li>
            <li className="mb-2">Estadísticas de interacción en el sitio</li>
          </ul>
          <p className="mb-6">
            Si el usuario opta por enviar información mediante formularios (por ejemplo, denuncias o comentarios), dicha información es voluntaria y será tratada con total confidencialidad.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. USO DE LA INFORMACIÓN</h2>
          <p className="mb-4">
            La información recolectada se utiliza únicamente para:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Mejorar la experiencia en el sitio</li>
            <li className="mb-2">Analizar tendencias de participación</li>
            <li className="mb-2">Moderar denuncias en caso de abuso o uso inadecuado</li>
          </ul>
          <p className="mb-6">
            No utilizamos la información con fines comerciales ni la compartimos con terceros, salvo requerimiento legal.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. COOKIES</h2>
          <p className="mb-6">
            Este sitio puede utilizar cookies propias o de terceros para fines estadísticos y de navegación. El usuario puede desactivarlas desde su navegador si lo desea.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. SEGURIDAD DE LA INFORMACIÓN</h2>
          <p className="mb-6">
            Adoptamos medidas técnicas y organizativas para proteger la integridad de la información recopilada. Sin embargo, debido a la naturaleza de internet, no podemos garantizar seguridad absoluta.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. ENLACES A TERCEROS</h2>
          <p className="mb-6">
            Este sitio puede contener enlaces a páginas externas. VotaYA no es responsable del contenido ni de las políticas de privacidad de sitios que no están bajo nuestro control.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. CAMBIOS EN LA POLÍTICA</h2>
          <p className="mb-6">
            Nos reservamos el derecho de modificar esta Política en cualquier momento. Te recomendamos revisarla periódicamente para estar informado.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. CONTACTO</h2>
          <p className="mb-6">
            Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos relacionados con tus datos, contáctanos a:
            <br />
            <a href="mailto:correo@votaya.org" className="text-blue-600 hover:text-blue-800 transition-colors">
              correo@votaya.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
