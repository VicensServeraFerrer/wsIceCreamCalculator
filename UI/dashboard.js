document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  const btnCalcular = document.getElementById('btnCalcular');
  const btnAlta = document.getElementById('btnAlta');
  const btnBusqueda = document.getElementById('btnBusqueda');
  const defaultTitle = document.querySelector('.default-content h1');
  const headerLogo = document.querySelector('.logo');
  
  const defaultContent = document.querySelector('.default-content');
  const dynamicView = document.getElementById('dynamicView');
  const actionPanel = document.getElementById('actionPanel');

  // Al hacer clic en el logo del header se recarga la página
  headerLogo.addEventListener('click', function() {
    location.reload();
  });

  // Manejo de clic en el menú lateral
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      const sectionText = item.textContent.trim();

      // Actualiza el título en la sección .default-content
      if (defaultTitle) {
        defaultTitle.textContent = sectionText;
      }

      // Resalta el item activo
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Muestra el botón "Calcular" solo si es "recetas"
      if (section === 'recetas') {
        btnCalcular.style.display = 'flex';
      } else {
        btnCalcular.style.display = 'none';
      }

      // Recupera la vista por defecto:
      // 1) Oculta el dynamicView y vacía su contenido
      dynamicView.style.display = 'none';
      dynamicView.innerHTML = '';

      // 2) Muestra el defaultContent
      defaultContent.style.display = 'block';

      // 3) Muestra el actionPanel con los botones
      actionPanel.style.display = 'flex';
    });
  });

  // Acción del botón "Alta" según la sección activa
  btnAlta.addEventListener('click', () => {
    const activeItem = document.querySelector('.sidebar ul li.active');
    if (activeItem) {
      const selection = activeItem.getAttribute('data-section');
      if (selection === 'proveedores') {
        showProviderAltaForm();
      } else if (selection === 'ingredientes') {
        showIngredientAltaForm();
      }
    }
  });

  // Nueva función para gestionar la acción de búsqueda. searchType puede ser 'proveedores', 'ingredientes' o 'recetas'
  function showSearchForm(searchType) {
    // Oculta la vista por defecto y el panel de acciones
    defaultContent.style.display = 'none';
    actionPanel.style.display = 'none';
    
    // Limpia y muestra el contenedor de vistas dinámicas
    dynamicView.innerHTML = '';
    dynamicView.style.display = 'block';
    
    switch (searchType) {
      case 'proveedores':
        initProviderSearch(dynamicView);
        break;
      case 'ingredientes':
        // Se supone que el módulo ingredientSearchModule.js define globalmente initIngredientSearch
        initIngredientSearch(dynamicView);
        break;
      case 'recetas':
        console.warn("Búsqueda de recetas aún no implementada.");
        break;
      default:
        console.error("Tipo de búsqueda no soportado:", searchType);
    }
  }
  
  // Modificamos la acción del botón "Búsqueda" para que dependa del elemento activo
  btnBusqueda.addEventListener('click', () => {
    const activeItem = document.querySelector('.sidebar ul li.active');
    let searchType = 'proveedores'; // valor por defecto
    if (activeItem) {
      const section = activeItem.getAttribute('data-section');
      // Asumimos que si la sección activa es ingredientes o proveedores, se usará el buscador correspondiente.
      if (section === 'ingredientes') {
        searchType = 'ingredientes';
      } else if (section === 'recetas') {
        searchType = 'recetas';
      } else if (section === 'proveedores') {
        searchType = 'proveedores';
      }
    }
    showSearchForm(searchType);
  });

  // Función para cargar la vista de alta de proveedor usando el módulo providerAltaModule.js
  function showProviderAltaForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display = 'none';
    dynamicView.innerHTML = '';
    dynamicView.style.display = 'block';
    initProviderAlta(dynamicView);
  }

  // Función para cargar la vista de alta de ingrediente usando el módulo ingredientAltaModule.js
  function showIngredientAltaForm() {
    defaultContent.style.display = 'none';
    actionPanel.style.display = 'none';
    dynamicView.innerHTML = '';
    dynamicView.style.display = 'block';
    initIngredientAlta(dynamicView);
  }
});
