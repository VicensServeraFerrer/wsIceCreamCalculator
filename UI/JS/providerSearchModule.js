// providerSearchModule.js
// Módulo para búsqueda de proveedores y asociación de ingredientes con precio

// Vincular stylesheet
if (!document.getElementById('providerSearch-css')) {
  const link = document.createElement('link');
  link.id = 'providerSearch-css';
  link.rel = 'stylesheet';
  link.href = '../CSS/providerSearch.css';
  document.head.appendChild(link);
}

const providerSearchTemplate = `
<div class="provider-search-container">
  <h2>Búsqueda de Proveedores</h2>
  <div class="search-bar">
    <input type="text" id="providerSearchInput" placeholder="Buscar por nombre">
    <button id="providerSearchBtn" class="search-btn"></button>
  </div>
  <div id="providerList"></div>
</div>
`;

/**
 * Inicializa la vista de búsqueda de proveedores en el contenedor especificado.
 * @param {HTMLElement} container
 */
function initProviderSearch(container) {
  container.innerHTML = providerSearchTemplate;

  const searchBtn    = container.querySelector('#providerSearchBtn');
  const searchInput  = container.querySelector('#providerSearchInput');
  const providerList = container.querySelector('#providerList');

  // Render tabla de proveedores con columna de “Acciones”
  function renderProviderList(providers) {
    if (!providers.length) {
      providerList.innerHTML = `<p>No se encontraron proveedores.</p>`;
      return;
    }
    let html = `
      <table class="provider-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
    `;
    providers.forEach((prov, i) => {
      const pid = prov.id || prov.uuid;
      html += `
        <tr>
          <td>${prov.name}</td>
          <td>${prov.address}</td>
          <td>${prov.tlf}</td>
          <td>
            <button class="associate-btn" data-provider-id="${pid}" data-index="${i}">
              Asociar
            </button>
          </td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    providerList.innerHTML = html;

    // Adjuntamos evento a cada “Asociar”
    providerList.querySelectorAll('.associate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const providerId = btn.dataset.providerId;
        openAssociateFlow(providerId);
      });
    });
  }

  // Flujo de asociación: buscar ingrediente → precio → confirmar
  function openAssociateFlow(providerId) {
    // 1. Abrir modal de selección de ingrediente
    openIngredientModal(ing => {
      // 2. Tras seleccionar ingrediente, preguntar precio
      const overlay = document.createElement('div');
      overlay.className = 'association-modal';
      overlay.innerHTML = `
        <div class="association-modal-content">
          <h3>Asociar “${ing.name}”</h3>
          <div class="form-group">
            <label>Precio:</label>
            <input type="number" id="assoc-price" min="0" step="0.01" placeholder="p. ej. 1.25">
          </div>
          <div class="buttons">
            <button id="assoc-confirm" disabled>Confirmar</button>
            <button id="assoc-cancel">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const inputPrice   = overlay.querySelector('#assoc-price');
      const btnConfirm   = overlay.querySelector('#assoc-confirm');
      const btnCancel    = overlay.querySelector('#assoc-cancel');

      // Habilitar confirmación solo si hay precio válido
      inputPrice.addEventListener('input', () => {
        btnConfirm.disabled = !inputPrice.value || Number(inputPrice.value) < 0;
      });

      btnCancel.addEventListener('click', () => overlay.remove());

      btnConfirm.addEventListener('click', async () => {
        const price = Number(inputPrice.value);
        try {
          const resp = await fetch('http://localhost:3000/provider/asociate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
              providerId: Number(providerId),
              ingredientId: ing.id,
              price: price
            })
          });
          if (resp.ok) {
            alert('Asociación creada con éxito');
          } else {
            const txt = await resp.text();
            alert('Error: ' + txt);
          }
        } catch (err) {
          console.error('Error en asociación:', err);
          alert('Error de red');
        } finally {
          overlay.remove();
        }
      });
    });
  }

  // Al pulsar “Buscar…”
  searchBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/provider/getAll', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
    .then(r => r.json())
    .then(data => {
      let provs = data.providers || [];
      const q = searchInput.value.trim().toLowerCase();
      if (q) provs = provs.filter(p => p.name.toLowerCase().includes(q));
      renderProviderList(provs);
    })
    .catch(err => console.error('Error cargando proveedores:', err));
  });
}

// Exponer globalmente
window.initProviderSearch = initProviderSearch;
