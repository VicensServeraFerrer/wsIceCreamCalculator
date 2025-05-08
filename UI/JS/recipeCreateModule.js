// recipeCreateModule.js
// Módulo para creación de recetas (Alta)

document.addEventListener('DOMContentLoaded', () => {
    // Vincular estilos
    if (!document.getElementById('recipeCreate-css')) {
      const link = document.createElement('link');
      link.id = 'recipeCreate-css';
      link.rel = 'stylesheet';
      link.href = '../CSS/recipeCreate.css';
      document.head.appendChild(link);
    }
  });
  
  /**
   * Inicia el flujo de alta de receta.
   * @param {HTMLElement} container
   */
  function initRecipeCreate(container) {
    container.innerHTML = `
      <div class="create-header">
        <h2>Crear Nueva Receta</h2>
      </div>
      <div class="create-content">
        <!-- Paso 1: Datos generales -->
        <section class="step-content active" data-step="1">
          <h3>1. Datos de la receta</h3>
          <label>Nombre:</label>
          <input type="text" id="new-name" placeholder="Nombre de la receta">
          <label>Descripción:</label>
          <textarea id="new-desc" placeholder="Descripción"></textarea>
          <label>Familia (ID):</label>
          <input type="number" id="new-family" placeholder="ID de familia">
          <label>Temperatura de servicio (TS):</label>
          <input type="number" id="new-TS" placeholder="P. ej. -5">
          <button id="next-to-ings" class="btn-primary">Siguiente: Ingredientes</button>
        </section>
        <!-- Paso 2: Selección de ingredientes -->
        <section class="step-content" data-step="2">
          <h3>2. Ingredientes</h3>
          <button id="add-ing" class="btn-primary">+ Añadir Ingrediente</button>
          <div id="new-ings-list" class="ings-grid"></div>
          <button id="next-to-summary" class="btn-primary">Guardar receta</button>
        </section>
        <!-- Paso 3: Resumen -->
        <section class="step-content" data-step="3">
          <h3>3. Resumen de la receta</h3>
          <div id="new-summary"></div>
        </section>
      </div>
    `;
  
    // Referencias a pasos y botones
    const step1     = container.querySelector('[data-step="1"]');
    const step2     = container.querySelector('[data-step="2"]');
    const step3     = container.querySelector('[data-step="3"]');
    const btnNext1  = container.querySelector('#next-to-ings');
    const btnNext2  = container.querySelector('#next-to-summary');
    const btnAddIng = container.querySelector('#add-ing');
    const ingsList  = container.querySelector('#new-ings-list');
    const summary   = container.querySelector('#new-summary');
  
    // Datos recolectados
    const data = { name: '', desc: '', familyId: null, TS: null, ingredients: [] };
  
    // Mostrar solo el paso indicado
    function showStep(n) {
      step1.style.display = (n === 1 ? 'block' : 'none');
      step2.style.display = (n === 2 ? 'block' : 'none');
      step3.style.display = (n === 3 ? 'block' : 'none');
    }
  
    // Botón Siguiente en paso 1
    btnNext1.addEventListener('click', () => {
      data.name     = container.querySelector('#new-name').value.trim();
      data.desc     = container.querySelector('#new-desc').value.trim();
      data.familyId = Number(container.querySelector('#new-family').value);
      data.TS       = Number(container.querySelector('#new-TS').value);
      if (!data.name) return alert('El nombre es obligatorio');
      if (!data.desc) return alert('La descripción es obligatoria');
      if (isNaN(data.familyId)) return alert('Debe indicar la familia (ID)');
      if (isNaN(data.TS)) return alert('Debe indicar la temperatura de servicio');
      showStep(2);
    });
  
    // Añadir ingrediente
    btnAddIng.addEventListener('click', () => {
      openIngredientModal(ing => {
        if (data.ingredients.some(x => x.id === ing.id)) return;
        ing.quantity = 0;
        data.ingredients.push(ing);
        const row = document.createElement('div');
        row.className = 'ing-item';
        row.innerHTML = `
          <span>${ing.name}</span>
          <input type="number" value="0" min="0" class="ing-qty">
          <button class="remove-ing">✕</button>
        `;
        // Listener cantidad
        const inp = row.querySelector('.ing-qty');
        inp.addEventListener('input', () => ing.quantity = Number(inp.value));
        // Eliminar ingrediente
        row.querySelector('.remove-ing').addEventListener('click', () => {
          data.ingredients = data.ingredients.filter(x => x.id !== ing.id);
          row.remove();
        });
        ingsList.append(row);
      });
    });
  
    // Botón Guardar receta (paso 2 -> 3)
    btnNext2.addEventListener('click', async () => {
      if (!data.ingredients.length) return alert('Añade al menos un ingrediente');
      for (const ing of data.ingredients) {
        if (!ing.quantity || ing.quantity <= 0) return alert('Introduce cantidades válidas');
      }
      // Llamada POST insert
      const body = {
        name: data.name,
        description: data.desc,
        familyId: data.familyId,
        TS: data.TS,
        ingredients: data.ingredients.map(i => ({ id: i.id, quantity: i.quantity }))
      };
      try {
        const res = await fetch('http://localhost:3000/recipe/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify(body)
        });
        if (!res.ok) { const txt = await res.text(); return alert('Error: ' + txt); }
        const rec = await res.json();
        // Mostrar resumen
        let html = `
          <p><strong>${rec.name}</strong></p>
          <p>Descripción: ${rec.description}</p>
          <p>Familia (ID): ${rec.familyId}</p>
          <p>Temperatura de servicio: ${rec.TS}</p>
          <h4>Ingredientes:</h4>
          <ul>
        `;
        data.ingredients.forEach(i => html += `<li>${i.name}: ${i.quantity}</li>`);
        html += `</ul><p>Receta creada con ID: ${rec.id}</p>`;
        summary.innerHTML = html;
        showStep(3);
      } catch (e) {
        console.error(e);
        alert('Error de red');
      }
    });
  
    // Inicialmente mostrar paso 1
    showStep(1);
  }
  
  // Exponer globalmente
  window.initRecipeCreate = initRecipeCreate;
  