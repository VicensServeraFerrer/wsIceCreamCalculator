// recipeWizardModule.js
// Módulo para la interfaz tipo "Wizard" de cálculo e inserción de recetas

document.addEventListener('DOMContentLoaded', () => {
  // Vincular estilos
  if (!document.getElementById('recipeWizard-css')) {
    const link = document.createElement('link');
    link.id = 'recipeWizard-css';
    link.rel = 'stylesheet';
    link.href = '../CSS/recipeWizard.css';
    document.head.appendChild(link);
  }
});

/**
 * Abre un modal para buscar ingredientes y devuelve el seleccionado.
 * @param {(ing: {id: number, name: string}) => void} callback
 */
function openIngredientModal(callback) {
  const overlay = document.createElement('div');
  overlay.className = 'ingredient-modal';
  overlay.innerHTML = `
    <div class="ingredient-modal-content">
      <h3>Buscar Ingrediente</h3>
      <div class="form-group">
        <label for="ing-search-type">Tipo:</label>
        <select id="ing-search-type">
          <option value="">Todos</option>
          <option value="1">Leche</option>
          <option value="2">Azúcar</option>
          <option value="3">Fruta</option>
          <option value="4">Cacao</option>
          <option value="5">Frutos Secos</option>
          <option value="6">Especia</option>
          <option value="7">Queso</option>
          <option value="8">Salado</option>
          <option value="9">Alcohol</option>
          <option value="0">Genérico</option>
        </select>
      </div>
      <div class="form-group">
        <input type="text" id="ing-search-name" placeholder="Buscar por nombre">
        <button id="ing-search-btn">Buscar</button>
      </div>
      <div id="ing-search-results"></div>
      <button id="ing-close-modal">Cerrar</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const resultsDiv = overlay.querySelector('#ing-search-results');
  const btnSearch = overlay.querySelector('#ing-search-btn');
  const btnClose = overlay.querySelector('#ing-close-modal');

  btnClose.addEventListener('click', () => overlay.remove());

  btnSearch.addEventListener('click', async () => {
    const type = overlay.querySelector('#ing-search-type').value;
    const name = overlay.querySelector('#ing-search-name').value.trim();
    let url = 'http://localhost:3000/ingredient/getAll';
    if (type !== '') url += `/${type}`;
    try {
      const res = await fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } });
      const data = await res.json();
      const ingredients = data.ingredients || [];
      const filtered = name
        ? ingredients.filter(i => i.name.toLowerCase().includes(name.toLowerCase()))
        : ingredients;
      resultsDiv.innerHTML = '<ul class="ing-list"></ul>';
      const ul = resultsDiv.querySelector('ul');
      filtered.forEach(ing => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${ing.name}</span>
          <button class="select-ing-btn">Seleccionar</button>
        `;
        li.querySelector('.select-ing-btn').addEventListener('click', () => {
          const id = ing.ingredientId !== undefined ? ing.ingredientId : ing.id;
          callback({ id, name: ing.name });
          overlay.remove();
        });
        ul.appendChild(li);
      });
    } catch (e) {
      console.error('Error buscando ingredientes:', e);
      resultsDiv.textContent = 'Error al buscar ingredientes';
    }
  });
}

/**
 * Inicializa el wizard de recetas.
 * @param {HTMLElement} container
 */
function initRecipeWizard(container) {
  container.innerHTML = `
    <div class="wizard-header">
      <ul class="steps">
        <li class="step active" data-step="1">1. Datos</li>
        <li class="step" data-step="2">2. Ingredientes</li>
        <li class="step" data-step="3">3. Parámetros</li>
        <li class="step" data-step="4">4. Resultado</li>
      </ul>
    </div>
    <div class="wizard-content">
      <section class="step-content active" data-step="1">
        <h2>1. Datos de la receta</h2>
        <label>Nombre: <input type="text" id="wiz-name" placeholder="Nombre de la receta"></label>
        <label>Descripción: <input type="text" id="wiz-desc" placeholder="Descripción"></label>
      </section>
      <section class="step-content" data-step="2">
        <h2>2. Ingredientes seleccionados</h2>
        <button id="wiz-add-ing" class="btn-primary">+ Ingrediente</button>
        <div class="ingredients-list" id="wiz-ings-list"></div>
      </section>
      <section class="step-content" data-step="3">
        <h2>3. Parámetros a conseguir</h2>
        <div class="param-grid">
          <div><label>POD: <input type="number" id="wiz-POD"></label></div>
          <div><label>MG: <input type="number" id="wiz-MG"></label></div>
          <div><label>ST: <input type="number" id="wiz-ST"></label></div>
          <div><label>LPD: <input type="number" id="wiz-LPD"></label></div>
          <div><label>TS: <input type="number" id="wiz-TS"></label></div>
          <div><label>%Cacao: <input type="number" id="wiz-percentCocoa"></label></div>
        </div>
      </section>
      <section class="step-content" data-step="4">
        <h2>4. Resultado</h2>
        <div class="preview-results" id="wiz-preview"></div>
      </section>
    </div>
    <div class="wizard-footer">
      <button id="wiz-prev" disabled>Anterior</button>
      <button id="wiz-next">Siguiente</button>
    </div>
  `;

  const steps = container.querySelectorAll('.step-content');
  const stepTabs = container.querySelectorAll('.step');
  const prevBtn = container.querySelector('#wiz-prev');
  const nextBtn = container.querySelector('#wiz-next');

  let current = 1;
  const maxStep = 4;
  const data = { name: '', desc: '', familyId: null, POD: null, MG: null, ST: null, LPD: null, TS: null, percentCocoa: null, ingredients: [] };
  const ingsContainer = container.querySelector('#wiz-ings-list');
  let ingredientsList = [];

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    stepTabs.forEach(t => t.classList.toggle('active', Number(t.dataset.step) === n));
    prevBtn.disabled = n === 1;
    nextBtn.textContent = n < maxStep ? 'Siguiente' : 'Guardar';
  }

  function collectStepData(n) {
    if (n === 1) {
      data.name = container.querySelector('#wiz-name').value.trim();
      data.desc = container.querySelector('#wiz-desc').value.trim();
    }
    if (n === 3) {
      data.POD = Number(container.querySelector('#wiz-POD').value) || null;
      data.MG = Number(container.querySelector('#wiz-MG').value) || null;
      data.ST = Number(container.querySelector('#wiz-ST').value) || null;
      data.LPD = Number(container.querySelector('#wiz-LPD').value) || null;
      data.TS = Number(container.querySelector('#wiz-TS').value);
      data.percentCocoa = Number(container.querySelector('#wiz-percentCocoa').value) || null;
    }
  }

  prevBtn.addEventListener('click', () => {
    if (current > 1) {
      current--;
      showStep(current);
    }
  });

  nextBtn.addEventListener('click', async () => {
    if (current === 1) {
      collectStepData(1);
      current = 2;
      showStep(2);
    } else if (current === 2) {
      current = 3;
      showStep(3);
    } else if (current === 3) {
      collectStepData(3);
      data.ingredients = ingredientsList.map(ing => ({ id: ing.id, quantity: ing.quantity }));
      const body = {
        name: data.name,
        description: data.desc,
        familyId: data.familyId,
        POD: data.POD,
        MG: data.MG,
        ST: data.ST,
        LPD: data.LPD,
        TS: data.TS,
        percentCocoa: data.percentCocoa,
        ingredients: data.ingredients
      };
      try {
        const res = await fetch('http://localhost:3000/recipe/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify(body)
        });
        const calc = await res.json();
        // Actualizamos data.ingredients con los resultados calculados
        data.ingredients = calc.ingredients.map(item => ({ id: item.id, quantity: item.quantity }));
        const preview = container.querySelector('#wiz-preview');
        preview.innerHTML = '<ul>' + data.ingredients.map(i => `<li>${ingredientsList.find(x => x.id === i.id)?.name || 'Ingrediente'}: ${i.quantity}</li>`).join('') + '</ul>';
        current = 4;
        showStep(4);
      } catch (e) {
        console.error('Error calculando:', e);
      }
    } else if (current === 4) {
      const insertBody = {
        name: data.name,
        description: data.desc,
        familyId: data.familyId,
        TS: data.TS,
        ingredients: data.ingredients
      };
      try {
        const res = await fetch('http://localhost:3000/recipe/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify(insertBody)
        });
        alert(res.ok ? 'Receta guardada' : 'Error al guardar');
      } catch (e) {
        console.error('Error guardando:', e);
      }
    }
  });

  // Añadir ingrediente
  container.querySelector('#wiz-add-ing').addEventListener('click', () => {
    openIngredientModal(ing => {
      if (!ingredientsList.some(x => x.id === ing.id)) {
        ing.quantity = 0;
        ingredientsList.push(ing);
        const row = document.createElement('div');
        row.className = 'ing-row';
        row.innerHTML = `<span>${ing.name}</span><input type="number" value="0" min="0"><button>✕</button>`;
        const inp = row.querySelector('input');
        inp.addEventListener('input', () => ing.quantity = Number(inp.value));
        row.querySelector('button').addEventListener('click', () => {
          ingredientsList = ingredientsList.filter(x => x.id !== ing.id);
          row.remove();
        });
        ingsContainer.append(row);
      }
    });
  });

  showStep(1);
}

// Exponer globalmente
window.openIngredientModal = openIngredientModal;
window.initRecipeWizard = initRecipeWizard;
