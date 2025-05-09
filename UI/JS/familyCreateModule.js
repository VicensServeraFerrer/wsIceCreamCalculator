// familyCreateModule.js
// Módulo para creación de familias de recetas

document.addEventListener('DOMContentLoaded', () => {
    // Vincular stylesheet
    if (!document.getElementById('familyCreate-css')) {
      const link = document.createElement('link');
      link.id = 'familyCreate-css';
      link.rel = 'stylesheet';
      link.href = '../CSS/familyCreate.css';
      document.head.appendChild(link);
    }
  });
  
  /**
   * Inicializa la vista para crear una nueva familia.
   * @param {HTMLElement} container
   */
  function initFamilyCreate(container) {
    container.innerHTML = `
      <div class="family-create-container">
        <h2>Crear Nueva Familia</h2>
        <form id="familyCreateForm">
          <div class="form-group">
            <label for="familyName">Nombre de la familia:</label>
            <input type="text" id="familyName" name="name" required placeholder="Introduce el nombre">
          </div>
          <div class="form-group">
            <label for="familyDesc">Descripción:</label>
            <textarea id="familyDesc" name="description" required placeholder="Introduce la descripción"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Guardar Familia</button>
          </div>
          <div id="familyMessage" class="form-message"></div>
        </form>
      </div>
    `;
  
    const form = container.querySelector('#familyCreateForm');
    const msgDiv = container.querySelector('#familyMessage');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgDiv.textContent = '';
      const name = form.name.value.trim();
      const description = form.description.value.trim();
  
      try {
        const resp = await fetch('http://localhost:3000/family/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify({ name, description })
        });
  
        if (!resp.ok) {
          const err = await resp.text();
          msgDiv.style.color = 'red';
          msgDiv.textContent = 'Error: ' + err;
        } else {
          const family = await resp.json();
          msgDiv.style.color = 'green';
          msgDiv.textContent = `Familia creada con ID: ${family.id}`;
          form.reset();
        }
      } catch (error) {
        console.error('Error al crear familia:', error);
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'Error de red.';
      }
    });
  }
  
  // Exponer globalmente
  window.initFamilyCreate = initFamilyCreate;