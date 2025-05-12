import { useEffect } from 'react';

/**
 * Hook personalizado para añadir efectos de elevación a las cards del home al hacer scroll
 * Solo funciona en dispositivos móviles
 */
export const useHomeCardsAnimation = () => {
  useEffect(() => {
    // Solo aplicar en dispositivos móviles
    if (window.innerWidth >= 768) return;
    
    // Función para aplicar efectos de elevación a las cards visibles
    const handleScroll = () => {
      // Seleccionar todas las cards de candidatos
      const cards = document.querySelectorAll('.candidato-card');
      
      // Altura total del viewport
      const viewportHeight = window.innerHeight;
      // Ajustar el centro considerando los elementos sticky (navbar y filtros)
      const stickyOffset = 140; // Aumentamos un poco para dar más espacio (navbar + filtros + margen adicional)
      const viewportCenter = (viewportHeight / 2) + (stickyOffset / 3); // Ajustamos para que el centro visual sea más natural
      
      // Para cada card, verificar si está visible en la pantalla
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const rect = cardElement.getBoundingClientRect();
        
        // Calcular qué tan cerca está del centro de la pantalla
        const cardCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
        const percentFromCenter = Math.min(distanceFromCenter / (viewportHeight * 0.5), 1);
        
        // Verificar si la card está visible en el viewport, considerando los elementos sticky
        const isVisible = 
          rect.top < viewportHeight - 50 && 
          rect.bottom > stickyOffset + 50;
        
        // Si la card es visible, añadir clase para la animación y aplicar transformación 3D
        if (isVisible) {
          cardElement.classList.add('card-elevated');
          
          // Calcular rotación basada en la posición vertical
          // Cards por encima del centro rotan hacia abajo, cards por debajo rotan hacia arriba
          const rotationX = (cardCenter < viewportCenter) ? 2 : -2;
          
          // Aplicar transformación 3D más pronunciada
          cardElement.style.transform = `
            scale(1.05) 
            translateY(-20px) 
            rotateX(${rotationX * (1 - percentFromCenter) * 1.5}deg)
          `;
          
          // Asegurarse de que el contador de votos sea visible
          const voteCountElement = cardElement.querySelector('[data-vote-count]');
          if (voteCountElement) {
            // Asegurarse de que el z-index sea alto para que sea visible
            (voteCountElement as HTMLElement).style.zIndex = '10';
            // Hacer que el contador de votos sea más visible
            (voteCountElement as HTMLElement).style.fontWeight = 'bold';
          }
          
          // Ajustar la intensidad de la sombra según la posición
          const shadowIntensity = 0.15 * (1 - percentFromCenter * 0.5);
          cardElement.style.boxShadow = `
            0 20px 25px -5px rgba(0, 0, 0, ${shadowIntensity}), 
            0 10px 10px -5px rgba(0, 0, 0, ${shadowIntensity * 0.7})
          `;
          
        } else {
          // Remover la clase y estilos cuando no es visible
          cardElement.classList.remove('card-elevated');
          cardElement.style.transform = '';
          cardElement.style.boxShadow = '';
        }
      });
    };
    
    // Ejecutar la función una vez al cargar para animar elementos ya visibles
    handleScroll();
    
    // Añadir event listener para el scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Limpiar event listener al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useHomeCardsAnimation;
