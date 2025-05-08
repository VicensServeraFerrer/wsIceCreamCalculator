// ingredientSearchModule.js
// Módulo gestiona búsqueda y modificación de ingredientes

// Vincular stylesheet
if (!document.getElementById('ingredientSearch-css')) {
  const linkElem = document.createElement('link');
  linkElem.id = 'ingredientSearch-css';
  linkElem.rel = 'stylesheet';
  linkElem.href = '../CSS/ingredientSearch.css';
  document.head.appendChild(linkElem);
}

const ingredientSearchTemplate = `
<div class="ingredient-search-container">
  <h2>Búsqueda de Ingredientes</h2>
  <div class="search-controls">
    <select id="ingredientTypeSelectSearch">
      <option value="">Todos los tipos</option>
      <option value="1">Leche</option>
      <option value="2">Azúcar</option>
      <option value="3">Fruta</option>
      <option value="4">Cacao</option>
      <option value="5">Frutos Secos</option>
      <option value="6">Especia</option>
      <option value="7">Queso</option>
      <option value="8">Salado</option>
      <option value="9">Alcohol</option>
      <option value="10">Genérico</option>
    </select>
    <input type="text" id="ingredientSearchInput" placeholder="Buscar por nombre">
    <button id="ingredientSearchBtn" class="search-btn"></button>
  </div>
  <div id="ingredientList"></div>
</div>
`;

/**
 * Inicializa la vista de búsqueda y modificación de ingredientes.
 * @param {HTMLElement} container
 */
function initIngredientSearch(container) {
  container.innerHTML = ingredientSearchTemplate;

  const typeSelect     = container.querySelector('#ingredientTypeSelectSearch');
  const searchInput    = container.querySelector('#ingredientSearchInput');
  const searchBtn      = container.querySelector('#ingredientSearchBtn');
  const ingredientList = container.querySelector('#ingredientList');

  function renderIngredientList(ingredients) {
    if (!ingredients.length) {
      ingredientList.innerHTML = '<p>No se encontraron ingredientes.</p>';
      return;
    }
    // Header y filas
    let html = `
      <div class="ingredient-table-header">
        <div>Nombre</div><div>Tipo</div><div>Detalles</div><div>Acciones</div>
      </div>
    `;
    ingredients.forEach(ing => {
      const id = ing.ingredientId || ing.id;
      html += `
        <div class="ingredient-table-row">
          <div>${ing.name}</div>
          <div>${ing.ingredientType}</div>
          <div><button class="toggle-details-btn">►</button></div>
          <div><button class="modify-btn" data-id="${id}">Modificar</button></div>
          <div class="ingredient-details" style="display:none;">
            ${renderIngredientDetails(ing)}
          </div>
        </div>
      `;
    });
    ingredientList.innerHTML = html;

    ingredientList.querySelectorAll('.toggle-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.ingredient-table-row');
        const det = row.querySelector('.ingredient-details');
        const visible = det.style.display === 'block';
        det.style.display = visible ? 'none' : 'block';
        btn.textContent   = visible ? '►' : '▼';
      });
    });

    ingredientList.querySelectorAll('.modify-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ingId = btn.dataset.id;
        const ingObj = ingredients.find(item => String(item.ingredientId||item.id) === ingId);
        openModifyModal(ingObj, () => searchBtn.click());
      });
    });
  }

  function renderIngredientDetails(ing) {
    let rows = '';
    for (const key in ing) {
      if (['ingredientId','id','userId','createdAt','updatedAt'].includes(key)) continue;
      const val = ing[key];
      if (val === null) continue;
      rows += `<tr><td>${key}</td><td>${val}</td></tr>`;
    }
    return `<table class="ingredient-details-table">${rows}</table>`;
  }

  function openModifyModal(ing, onSuccess) {
    const overlay = document.createElement('div');
    overlay.className = 'modify-modal';
    const content = document.createElement('div');
    content.className = 'modify-modal-content';
    content.innerHTML = `
      <h3>Modificar: ${ing.name}</h3>
      <form id="editIngForm"></form>
    `;
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const form = content.querySelector('#editIngForm');
    for (const key in ing) {
      if (['ingredientId','id','userId','createdAt','updatedAt'].includes(key)) continue;
      const val = ing[key] == null ? '' : ing[key];
      const inputType = typeof val === 'number' ? 'number' : 'text';
      form.innerHTML += `
        <div class="form-group">
          <label>${key}:</label>
          <input type="${inputType}" name="${key}" value="${val}" ${inputType==='number'? 'step="any"':''} />
        </div>
      `;
    }
    form.innerHTML += `
      <div class="form-message"></div>
      <div class="form-actions">
        <button type="button" id="cancelEdit">Cancelar</button>
        <button type="button" id="confirmEdit">Guardar</button>
      </div>
    `;

    const msgDiv   = content.querySelector('.form-message');
    const btnCancel= content.querySelector('#cancelEdit');
    const btnConfirm= content.querySelector('#confirmEdit');

    btnCancel.onclick = () => overlay.remove();
    btnConfirm.onclick = async () => {
      btnConfirm.disabled = true;
      btnCancel.disabled  = true;
      msgDiv.style.color = '#007bff';
      msgDiv.textContent = 'Guardando cambios...';

      const data = {};
      new FormData(form).forEach((v,k) => { data[k] = isNaN(v)? v : Number(v); });
      try {
        const resp = await fetch(`http://localhost:3000/ingredient/modify/${ing.ingredientId||ing.id}`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization': localStorage.getItem('token') },
          body: JSON.stringify(data)
        });
        if (resp.ok) {
          msgDiv.style.color = 'green';
          msgDiv.textContent = 'Ingrediente modificado con éxito';
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        } else {
          const err = await resp.text();
          msgDiv.style.color = 'red';
          msgDiv.textContent = 'Error: ' + err;
          btnConfirm.disabled = false;
          btnCancel.disabled  = false;
        }
      } catch (e) {
        console.error(e);
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'Error de red';
        btnConfirm.disabled = false;
        btnCancel.disabled  = false;
      }
    };
  }

  // Búsqueda
  searchBtn.addEventListener('click', () => {
    let url = 'http://localhost:3000/ingredient/getAll';
    const t = typeSelect.value;
    if (t) url += `/${t}`;
    fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } })
      .then(r=>r.json())
      .then(data=>{
        let arr = data.ingredients || [];
        const q = searchInput.value.trim().toLowerCase();
        if (q) arr = arr.filter(i=>i.name.toLowerCase().includes(q));
        renderIngredientList(arr);
      })
      .catch(e=> console.error('Error:', e));
  });
}

window.initIngredientSearch = initIngredientSearch;
