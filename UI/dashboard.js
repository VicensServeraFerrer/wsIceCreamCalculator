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

  // Al cargar: sólo mensaje de bienvenida
  actionPanel.style.display    = 'none';
  btnCalcular.style.display    = 'none';
  btnCrearFamilia.style.display = 'none';

  // Recarga al clicar logo
  headerLogo.addEventListener('click', () => location.reload());

  // Manejo de menú lateral
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      // Actualizar título
      defaultTitle.textContent = item.textContent.trim();
      // Marcar activo
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Mostrar panel de acciones
      actionPanel.style.display = 'flex';
      // Ocultar botones no aplicables
      btnCalcular.style.display      = sec === 'recetas' ? 'flex' : 'none';
      btnCrearFamilia.style.display  = sec === 'recetas' ? 'flex' : 'none';

      // Reiniciar vistas
      defaultContent.style.display = 'block';
      dynamicView.style.display    = 'none';
      dynamicView.innerHTML        = '';

      // Ajustar color de fondo
      mainContent.classList.remove('recetas-bg','ingredientes-bg','proveedores-bg');
      if (sec === 'recetas')      mainContent.classList.add('recetas-bg');
      if (sec === 'ingredientes') mainContent.classList.add('ingredientes-bg');
      if (sec === 'proveedores')  mainContent.classList.add('proveedores-bg');
    });
  });

  // Función para mostrar un módulo
  function showModule(initFn) {
    // Ocultar bienvenida y panel
    defaultContent.style.display  = 'none';
    actionPanel.style.display     = 'none';
    // Limpiar y mostrar dynamicView
    dynamicView.innerHTML         = '';
    dynamicView.style.display     = 'block';
    // Inicializar módulo
    initFn(dynamicView);
  }

  // Alta
  btnAlta.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'proveedores')       showModule(initProviderAlta);
    else if (sel === 'ingredientes') showModule(initIngredientAlta);
    else if (sel === 'recetas')      showModule(initRecipeCreate);
  });

  // Búsqueda
  btnBusqueda.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'proveedores')       showModule(initProviderSearch);
    else if (sel === 'ingredientes') showModule(initIngredientSearch);
    else if (sel === 'recetas')      showModule(initRecipeSearch);
  });

  // Calculadora
  btnCalcular.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'recetas') showModule(initRecipeWizard);
  });

  // Crear Familia
  btnCrearFamilia.addEventListener('click', () => {
    showModule(initFamilyCreate);
  });
});
