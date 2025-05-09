// recipeSearchModule.js
// Módulo para búsqueda y visualización de recetas

// Vincular estilos
if (!document.getElementById('recipeSearch-css')) {
    const link = document.createElement('link');
    link.id = 'recipeSearch-css';
    link.rel = 'stylesheet';
    link.href = '../CSS/recipeSearch.css';
    document.head.appendChild(link);
  }
  
  const recipeSearchTemplate = `
  <div class="recipe-search-container">
    <h2>Búsqueda de Recetas</h2>
    <div class="search-bar">
      <input type="text" id="recipeSearchName" placeholder="Buscar por nombre">
      <input type="number" id="recipeSearchFamily" placeholder="ID familia" style="width:100px;">
      <button id="recipeSearchBtn" class="search-btn"></button>
    </div>
    <div id="recipeList"></div>
  </div>
  `;
  
  /**
   * Inicializa la vista de búsqueda de recetas.
   * @param {HTMLElement} container
   */
  function initRecipeSearch(container) {
    container.innerHTML = recipeSearchTemplate;
    const btnSearch    = container.querySelector('#recipeSearchBtn');
    const inputName    = container.querySelector('#recipeSearchName');
    const inputFamily  = container.querySelector('#recipeSearchFamily');
    const recipeListEl = container.querySelector('#recipeList');
  
    function renderRecipeDetails(rec) {
      const skip = ['id','userId','createdAt','updatedAt','name','familyId'];
      let rows = '';
      Object.keys(rec).forEach(key => {
        if (skip.includes(key)) return;
        const val = rec[key];
        if (val === null) return;
        rows += `<tr><td>${key}</td><td>${val}</td></tr>`;
      });
      return `<table class="recipe-details-table">${rows}</table>`;
    }
  
    function renderRecipeList(recipes) {
      if (!recipes.length) {
        recipeListEl.innerHTML = '<p>No se encontraron recetas.</p>';
        return;
      }
      let html = `
        <div class="recipe-header">
          <div>Nombre</div><div>Familia</div><div>Detalles</div><div>Asociar</div><div>Producir</div>
        </div>
      `;
      recipes.forEach(rec => {
        html += `
          <div class="recipe-row" data-id="${rec.id}">
            <div>${rec.name}</div>
            <div>${rec.familyId !== null ? rec.familyId : '-'}</div>
            <div><button class="details-btn">►</button></div>
            <div><button class="associate-btn">Asociar</button></div>
            <div><button class="produce-btn">Producir</button></div>
            <div class="recipe-details" style="display:none;">
              ${renderRecipeDetails(rec)}
            </div>
          </div>
        `;
      });
      recipeListEl.innerHTML = html;
  
      // Toggle detalles
      recipeListEl.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const row = btn.closest('.recipe-row');
          const det = row.querySelector('.recipe-details');
          const shown = det.style.display === 'block';
          det.style.display = shown ? 'none' : 'block';
          btn.textContent = shown ? '►' : '▼';
        });
      });
  
      // Asociar y Producir (stubs)
      recipeListEl.querySelectorAll('.associate-btn').forEach(b => {
        b.addEventListener('click', () => console.warn('Asociar receta ID', b.closest('.recipe-row').dataset.id));
      });
      recipeListEl.querySelectorAll('.produce-btn').forEach(b => {
        b.addEventListener('click', () => console.warn('Producir receta ID', b.closest('.recipe-row').dataset.id));
      });
    }
  
    btnSearch.addEventListener('click', () => {
      fetch('http://localhost:3000/recipe/getAll', {
        headers: { 'Authorization': localStorage.getItem('token') }
      })
      .then(res => res.json())
      .then(data => {
        let arr = Array.isArray(data) ? data : data.recipes || data;
        const qName = inputName.value.trim().toLowerCase();
        const qFam  = inputFamily.value.trim();
        if (qName) arr = arr.filter(r => r.name.toLowerCase().includes(qName));
        if (qFam)  arr = arr.filter(r => String(r.familyId) === qFam);
        renderRecipeList(arr);
      })
      .catch(err => console.error('Error al obtener recetas:', err));
    });
  }
  
  // Exponer globalmente
  window.initRecipeSearch = initRecipeSearch;
  