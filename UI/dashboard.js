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

  headerLogo.addEventListener('click', () => location.reload());

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.getAttribute('data-section');
      defaultTitle.textContent = item.textContent.trim();
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      btnCalcular.style.display = (sec === 'recetas' ? 'flex' : 'none');
      dynamicView.style.display = 'none'; dynamicView.innerHTML = '';
      defaultContent.style.display = 'block'; actionPanel.style.display = 'flex';
    });
  });

  btnAlta.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.getAttribute('data-section');
    if (sel === 'proveedores') showProviderAltaForm();
    else if (sel === 'ingredientes') showIngredientAltaForm();
  });

  btnBusqueda.addEventListener('click', () => {
    const sel = document.querySelector('.sidebar ul li.active')?.getAttribute('data-section');
    showSearchForm(sel);
  });

  btnCalcular.addEventListener('click', () => {
    if (document.querySelector('.sidebar ul li.active')?.getAttribute('data-section') === 'recetas') {
      showRecipeWizardForm();
    }
  });

  function showSearchForm(type) {
    defaultContent.style.display = 'none'; actionPanel.style.display = 'none'; dynamicView.innerHTML = ''; dynamicView.style.display = 'block';
    if (type === 'proveedores') initProviderSearch(dynamicView);
    else if (type === 'ingredientes') initIngredientSearch(dynamicView);
    else console.warn('Búsqueda no implementada');
  }

  function showProviderAltaForm() {
    defaultContent.style.display = 'none'; actionPanel.style.display = 'none'; dynamicView.innerHTML = ''; dynamicView.style.display = 'block'; initProviderAlta(dynamicView);
  }

  function showIngredientAltaForm() {
    defaultContent.style.display = 'none'; actionPanel.style.display = 'none'; dynamicView.innerHTML = ''; dynamicView.style.display = 'block'; initIngredientAlta(dynamicView);
  }

  function showRecipeWizardForm() {
    defaultContent.style.display = 'none'; actionPanel.style.display = 'none'; dynamicView.innerHTML = ''; dynamicView.style.display = 'block'; initRecipeWizard(dynamicView);
  }

});