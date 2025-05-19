// recipeSearchModule.js
// Módulo para búsqueda y visualización de recetas con detalles usando los datos de getAll

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

  function renderRecipeList(recipes) {
    if (!recipes.length) {
      recipeListEl.innerHTML = '<p>No se encontraron recetas.</p>';
      return;
    }
    let html = `
      <div class="recipe-header">
        <div>Nombre</div><div>Familia</div><div>Detalles</div><div>Asociar</div><div>Producir</div>
      </div>`;
    recipes.forEach(rec => {
      html += `
        <div class="recipe-row" data-id="${rec.id}">
          <div>${rec.name}</div>
          <div>${rec.familyId !== null ? rec.familyId : '-'}</div>
          <div><button class="details-btn">►</button></div>
          <div><button class="associate-btn">Asociar</button></div>
          <div><button class="produce-btn">Producir</button></div>
          <div class="recipe-details" style="display:none; padding:10px;"></div>
        </div>`;
    });
    recipeListEl.innerHTML = html;

    // Toggle detalles usando datos de recetas cargadas
    recipeListEl.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.recipe-row');
        const det = row.querySelector('.recipe-details');
        const shown = det.style.display === 'block';
        if (!shown && !det.dataset.loaded) {
          const recId = row.dataset.id;
          const rec = recipes.find(r => String(r.id) === recId);
          // Izquierda: propiedades de la receta
          const skip = ['id','userId','createdAt','updatedAt','ingredients'];
          let leftHtml = '<table>';
          Object.keys(rec).forEach(key => {
            if (skip.includes(key)) return;
            const val = rec[key];
            if (val === null || Array.isArray(val) || typeof val === 'object') return;
            leftHtml += `<tr><td><strong>${key}</strong></td><td>${val}</td></tr>`;
          });
          leftHtml += '</table>';
          // Derecha: ingredientes y cantidades
          let rightHtml = '<h4>Ingredientes</h4><ul>';
          (rec.ingredients || []).forEach(item => {
            const name = item.name || 'Ingrediente';
            rightHtml += `<li>${name}: ${item.quantity}</li>`;
          });
          rightHtml += '</ul>';
          // Render en grid dos columnas
          det.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
              <div>${leftHtml}</div>
              <div>${rightHtml}</div>
            </div>`;
          det.dataset.loaded = 'true';
        }
        det.style.display = shown ? 'none' : 'block';
        btn.textContent = shown ? '►' : '▼';
      });
    });

    // Asociar
    recipeListEl.querySelectorAll('.associate-btn').forEach(b => {
      b.addEventListener('click', () => {
        const recipeId = b.closest('.recipe-row').dataset.id;
        openFamilyAssociationModal(recipeId);
      });
    });
    // Producir
    recipeListEl.querySelectorAll('.produce-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Tomamos el id de la receta directamente del atributo data-id
        const recId = btn.closest('.recipe-row').dataset.id;
        // Buscamos el objeto en el array original
        const rec = recipes.find(r => String(r.id) === recId);
        if (!rec) {
          console.error('Receta no encontrada:', recId);
          return;
        }
        openProduceModal(rec);
      });
    });
  }

  btnSearch.addEventListener('click', () => {
    fetch('http://localhost:3000/recipe/getAll', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(data => {
      const arr = Array.isArray(data) ? data : data.recipes || data;
      let filtered = arr;
      const qName = inputName.value.trim().toLowerCase();
      const qFam  = inputFamily.value.trim();
      if (qName) filtered = filtered.filter(r => r.name.toLowerCase().includes(qName));
      if (qFam)  filtered = filtered.filter(r => String(r.familyId) === qFam);
      renderRecipeList(filtered);
    })
    .catch(err => console.error('Error al obtener recetas:', err));
  });
}

// Exponer globalmente
window.initRecipeSearch = initRecipeSearch;
