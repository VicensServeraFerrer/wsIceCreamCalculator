// familyAssociationModule.js
// Módulo para asociar una receta existente a una familia mediante un modal superpuesto

document.addEventListener('DOMContentLoaded', () => {
  // Vincular stylesheet
  if (!document.getElementById('familyAssociate-css')) {
    const link = document.createElement('link');
    link.id = 'familyAssociate-css';
    link.rel = 'stylesheet';
    link.href = '../CSS/familyAssociate.css';
    document.head.appendChild(link);
  }
});

/**
 * Abre un modal superpuesto para buscar familias y asociar la receta.
 * @param {number|string} recipeId
 */
function openFamilyAssociationModal(recipeId) {
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'family-assoc-modal-overlay';
  overlay.innerHTML = `
    <div class="family-assoc-modal">
      <button class="close-modal">✕</button>
      <h2>Asociar Receta a Familia</h2>
      <div class="search-bar">
        <input type="text" id="famSearchName" placeholder="Buscar familia por nombre">
        <button id="famSearchBtn">Buscar</button>
      </div>
      <div id="famList" class="fam-list"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const btnSearch = overlay.querySelector('#famSearchBtn');
  const input     = overlay.querySelector('#famSearchName');
  const listEl    = overlay.querySelector('#famList');
  const btnClose  = overlay.querySelector('.close-modal');

  btnClose.addEventListener('click', () => overlay.remove());

  function render(families) {
    if (!families.length) {
      listEl.innerHTML = '<p>No se encontraron familias.</p>';
      return;
    }
    listEl.innerHTML = families.map(fam => `
      <div class="fam-item" data-id="${fam.id}">
        <div class="fam-info">
          <strong>${fam.name}</strong>
          <p>${fam.description || ''}</p>
        </div>
        <button class="confirm-assoc">Confirmar</button>
      </div>
    `).join('');

    listEl.querySelectorAll('.confirm-assoc').forEach(btn => {
      btn.addEventListener('click', async () => {
        const famId = btn.closest('.fam-item').dataset.id;
        try {
          const resp = await fetch('http://localhost:3000/family/addRecipe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ recipeId: Number(recipeId), familyId: Number(famId) })
          });
          if (!resp.ok) {
            const text = await resp.text();
            alert('Error: ' + text);
          } else {
            alert('Receta asociada a la familia correctamente');
            overlay.remove();
          }
        } catch (e) {
          console.error(e);
          alert('Error de red');
        }
      });
    });
  }

  btnSearch.addEventListener('click', () => {
    fetch('http://localhost:3000/family/getAll', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(r => r.json())
      .then(fams => {
        const q = input.value.trim().toLowerCase();
        const results = q ? fams.filter(f => f.name.toLowerCase().includes(q)) : fams;
        render(results);
      })
      .catch(e => {
        console.error(e);
        listEl.innerHTML = '<p>Error al buscar familias.</p>';
      });
  });
}

// Exponer globalmente
window.openFamilyAssociationModal = openFamilyAssociationModal;
