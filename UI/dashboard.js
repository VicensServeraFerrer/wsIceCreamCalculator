// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    const btnCalcular = document.getElementById('btnCalcular');
    // Seleccionamos el título del contenido a modificar (dentro de default-content)
    const defaultTitle = document.querySelector('.default-content h1');
    // Elemento del header que es fijo y al que se le añade el evento de recargar la página
    const headerLogo = document.querySelector('.logo');
  
    // Reiniciar la página al hacer clic en el header (logo)
    headerLogo.addEventListener('click', function() {
      location.reload();
    });
  
    sidebarItems.forEach(item => {
      item.addEventListener('click', () => {
        // Obtener la sección seleccionada y su texto
        const section = item.getAttribute('data-section');
        const sectionText = item.textContent.trim();
  
        // Actualizar el título del contenido (la parte de "Bienvenido a Gelato Calculator...")
        defaultTitle.textContent = sectionText;
  
        // Resalta el item seleccionado
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
  
        // Mostrar u ocultar el botón "Calcular" según corresponda
        if (section === 'recetas') {
          btnCalcular.style.display = 'flex';
        } else {
          btnCalcular.style.display = 'none';
        }
      });
    });
  });
  