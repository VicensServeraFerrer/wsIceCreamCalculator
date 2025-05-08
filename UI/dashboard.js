// dashboard.js
// Control de navegación y carga de módulos en la dashboard de Gelato Calculator

document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems      = document.querySelectorAll('.sidebar ul li');
  const btnAlta           = document.getElementById('btnAlta');
  const btnBusqueda       = document.getElementById('btnBusqueda');
  const btnCalcular       = document.getElementById('btnCalcular');
  const btnCrearFamilia   = document.getElementById('btnCrearFamilia');
  const defaultTitle      = document.querySelector('.default-content h1');
  const headerLogo        = document.querySelector('.logo');
  const defaultContent    = document.querySelector('.default-content');
  const dynamicView       = document.getElementById('dynamicView');
  const actionPanel       = document.getElementById('actionPanel');

  // Recargar al hacer clic en el logo
  headerLogo.addEventListener('click', () => location.reload());

  // Manejo de selección en el menú lateral
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.getAttribute('data-section');
      defaultTitle.textContent = item.textContent.trim();
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Mostrar/ocultar botones según sección
      if (sec === 'recetas') {
        btnCalcular.style.display     = 'flex';
        btnCrearFamilia.style.display = 'flex';
      } else {
        btnCalcular.style.display     = 'none';
        btnCrearFamilia.style.display = 'none';
      }

      // Restaurar vista
      dynamicView.style.display     = 'none';
      dynamicView.innerHTML         = '';
      defaultContent.style.display  = 'block';
      actionPanel.style.display     = 'flex';
    });
  });

  // Alta (nuevo registro)
  btnAlta.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    if (sel === 'proveedores') showProviderAltaForm();
    else if (sel === 'ingredientes') showIngredientAltaForm();
    else if (sel === 'recetas') showRecipeCreateForm();
  });

  // Búsqueda
  btnBusqueda.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.dataset.section;
    showSearchForm(sel);
  });

  // Calculadora de recetas
  btnCalcular.addEventListener('click', () => {
    if (document.querySelector('.sidebar ul li.active')?.dataset.section === 'recetas') {
      showRecipeWizardForm();
    }
  });

  // Crear familia (placeholder)
  btnCrearFamilia.addEventListener('click', () => {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    dynamicView.innerHTML        = '<p>Aquí irá el formulario de Crear Familia.</p>';
  });

  // Función genérica para cargar buscadores
  function showSearchForm(type) {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    if (type === 'proveedores') initProviderSearch(dynamicView);
    else if (type === 'ingredientes') initIngredientSearch(dynamicView);
    else if (type === 'recetas') initRecipeSearch(dynamicView);
    else console.warn('Búsqueda no implementada para', type);
  }

  // Alta proveedor
  function showProviderAltaForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    initProviderAlta(dynamicView);
  }

  // Alta ingrediente
  function showIngredientAltaForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    initIngredientAlta(dynamicView);
  }

  // Alta receta
  function showRecipeCreateForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    initRecipeCreate(dynamicView);
  }

  // Calculadora wizard de recetas
  function showRecipeWizardForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display    = 'none';
    dynamicView.innerHTML        = '';
    dynamicView.style.display    = 'block';
    initRecipeWizard(dynamicView);
  }
});
