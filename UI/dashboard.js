document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  const btnCalcular = document.getElementById('btnCalcular');
  const btnAlta = document.getElementById('btnAlta');
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

  // Al pulsar el botón "Alta": si el menú activo es "proveedores", se carga el formulario
  btnAlta.addEventListener('click', () => {
    const activeItem = document.querySelector('.sidebar ul li.active');
    if (activeItem) {
      const selection = activeItem.getAttribute('data-section');
      if(selection === 'proveedores'){
        showProviderAltaForm();
      } else if (selection === 'ingredientes'){
        showIngredientAltaForm()
      }
    }
  });

  // Función para cargar la vista de alta de proveedor usando el módulo providerAltaModule.js
  function showProviderAltaForm() {
    // 1) Oculta la vista por defecto
    defaultContent.style.display = 'none';

    // 2) Oculta el panel de acciones para que no se superponga
    actionPanel.style.display = 'none';

    // 3) Limpia el contenedor de vistas dinámicas y carga la vista de alta mediante initProviderAlta
    dynamicView.innerHTML = '';
    dynamicView.style.display = 'block';
    // Llama a la función del módulo para inicializar la vista y funcionalidad del alta de proveedor
    initProviderAlta(dynamicView);
    
  }

  // Función para cargar la vista de alta de proveedor usando el módulo providerAltaModule.js
  function showIngredientAltaForm() {
    // 1) Oculta la vista por defecto
    defaultContent.style.display = 'none';

    // 2) Oculta el panel de acciones para que no se superponga
    actionPanel.style.display = 'none';

    // 3) Limpia el contenedor de vistas dinámicas y carga la vista de alta mediante initProviderAlta
    dynamicView.innerHTML = '';
    dynamicView.style.display = 'block';
    // Llama a la función del módulo para inicializar la vista y funcionalidad del alta de proveedor
    initIngredientAlta(dynamicView);
  }
});
