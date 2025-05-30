// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const sidebarItems    = document.querySelectorAll('.sidebar ul li');
  const btnAlta         = document.getElementById('btnAlta');
  const btnBusqueda     = document.getElementById('btnBusqueda');
  const btnCalcular     = document.getElementById('btnCalcular');
  const btnCrearFamilia = document.getElementById('btnCrearFamilia');
  const defaultTitle    = document.querySelector('.default-content h1');
  const headerLogo      = document.querySelector('.logo');
  const defaultContent  = document.querySelector('.default-content');
  const dynamicView     = document.getElementById('dynamicView');
  const actionPanel     = document.getElementById('actionPanel');
  const mainContent     = document.querySelector('.main-content');

  // Inicial: sólo bienvenida
  actionPanel.style.display = 'none';
  btnCalcular.style.display = 'none';
  btnCrearFamilia.style.display = 'none';

  // Recarga al clicar logo
  headerLogo.addEventListener('click', () => location.reload());

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      // Título y destacado en menú
      defaultTitle.textContent = item.textContent.trim();
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Mostrar panel de botones
      actionPanel.style.display = 'flex';

      // Mostrar/ocultar según sección
      btnCalcular.style.display     = sec === 'recetas'      ? 'flex' : 'none';
      btnCrearFamilia.style.display = sec === 'recetas'      ? 'flex' : 'none';

      // Reset dinámico
      dynamicView.style.display    = 'none';
      dynamicView.innerHTML        = '';
      defaultContent.style.display = 'block';

      // Ajustar color de fondo
      mainContent.classList.remove('recetas-bg','ingredientes-bg','proveedores-bg');
      if (sec === 'recetas')      mainContent.classList.add('recetas-bg');
      else if (sec === 'ingredientes') mainContent.classList.add('ingredientes-bg');
      else if (sec === 'proveedores')  mainContent.classList.add('proveedores-bg');
    });
  });

  // Alta
  btnAlta.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'proveedores')       initProviderAlta(dynamicView);
    else if (sel === 'ingredientes') initIngredientAlta(dynamicView);
    else if (sel === 'recetas')      initRecipeCreate(dynamicView);
  });

  // Búsqueda
  btnBusqueda.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'proveedores')       initProviderSearch(dynamicView);
    else if (sel === 'ingredientes') initIngredientSearch(dynamicView);
    else if (sel === 'recetas')      initRecipeSearch(dynamicView);
  });

  // Calculadora
  btnCalcular.addEventListener('click', () => {
    if (document.querySelector('.sidebar ul li.active')?.dataset.section === 'recetas') {
      initRecipeWizard(dynamicView);
    }
  });

  // Crear familia
  btnCrearFamilia.addEventListener('click', () => {
    initFamilyCreate(dynamicView);
  });
});
