// ingredientSearchModule.js
// Este módulo gestiona la vista y funcionalidad para la búsqueda de ingredientes.

// Vincular ingredientSearch.css si aún no está vinculado
if (!document.getElementById('ingredientSearch-css')) {
    const linkElem = document.createElement('link');
    linkElem.id = 'ingredientSearch-css';
    linkElem.rel = 'stylesheet';
    // Ajusta esta ruta según la estructura de tu proyecto
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
 * Inicializa la vista de búsqueda de ingredientes en el contenedor especificado.
 * @param {HTMLElement} container - El contenedor donde se inyectará la vista.
 */
function initIngredientSearch(container) {
  container.innerHTML = ingredientSearchTemplate;

  const typeSelect = document.getElementById('ingredientTypeSelectSearch');
  const searchInput = document.getElementById('ingredientSearchInput');
  const searchBtn = document.getElementById('ingredientSearchBtn');
  const ingredientList = document.getElementById('ingredientList');

  /**
   * Renderiza el listado de ingredientes en forma de tabla estilo lista.
   * Cada fila muestra:
   *  - Nombre y tipo
   *  - Un botón toggle para desplegar/contraer detalles
   *  - Un botón "Modificar" a la derecha
   */
  function renderIngredientList(ingredients) {
    if (ingredients.length === 0) {
      ingredientList.innerHTML = "<p>No se encontraron ingredientes.</p>";
      return;
    }
    // Encabezado tipo tabla
    let html = `
      <div class="ingredient-table-header">
        <div class="col-name">Nombre</div>
        <div class="col-type">Tipo</div>
        <div class="col-toggle">Detalles</div>
        <div class="col-action">Acciones</div>
      </div>
    `;
    // Por cada ingrediente se crea una fila
    ingredients.forEach(ingredient => {
      // Se asume que las propiedades básicas son 'name' y 'ingredientType'
      // Los detalles se mostrarán en un contenedor que inicialmente está oculto.
      html += `
        <div class="ingredient-table-row">
          <div class="col-name">${ingredient.name}</div>
          <div class="col-type">${ingredient.ingredientType}</div>
          <div class="col-toggle">
            <button class="toggle-details-btn">►</button>
          </div>
          <div class="col-action">
            <button class="modify-btn">Modificar</button>
          </div>
          <div class="ingredient-details" style="display: none;">
            ${renderIngredientDetails(ingredient)}
          </div>
        </div>
      `;
    });
    ingredientList.innerHTML = html;
    
    // Agregar eventos a cada botón toggle para mostrar u ocultar detalles
    const toggleBtns = ingredientList.querySelectorAll('.toggle-details-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const row = btn.closest('.ingredient-table-row');
        const detailsDiv = row.querySelector('.ingredient-details');
        if (detailsDiv.style.display === 'none') {
          detailsDiv.style.display = 'block';
          btn.textContent = '▼';
        } else {
          detailsDiv.style.display = 'none';
          btn.textContent = '►';
        }
      });
    });
    
    // Los botones "Modificar" se pueden gestionar aquí; por ahora solo se deja un placeholder.
    const modifyBtns = ingredientList.querySelectorAll('.modify-btn');
    modifyBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Aquí se implementará la funcionalidad para modificar el ingrediente.
        alert("Funcionalidad de modificar ingrediente pendiente de implementar.");
      });
    });
  }

  /**
   * Función auxiliar para renderizar los detalles de un ingrediente.
   * Se muestran todas sus propiedades excepto 'name' y 'ingredientType'.
   * @param {Object} ingredient 
   */
  function renderIngredientDetails(ingredient) {
    let detailsHTML = `<table class="ingredient-details-table">`;
    for (const key in ingredient) {
      if (key !== 'name' && key !== 'ingredientType' && ingredient[key] !== null && key !== 'userId' && key !== 'ingredientId'  && key !== 'createdAt' && key !== 'updatedAt') {
        detailsHTML += `<tr>
          <td class="detail-key">${key}</td>
          <td class="detail-value">${ingredient[key]}</td>
        </tr>`;
      }
    }
    detailsHTML += `</table>`;
    return detailsHTML;
  }
  
  // Acción de búsqueda
  searchBtn.addEventListener('click', function() {
    let url = "http://localhost:3000/ingredient/getAll";
    const selectedType = typeSelect.value;
    if (selectedType !== "") {
      url = `http://localhost:3000/ingredient/getAll/${selectedType}`;
    }
    fetch(url, {
      method: "GET",
      headers: { 
        "Authorization": localStorage.getItem("token")
      }
    })
    .then(response => response.json())
    .then(data => {
      let ingredients = data.ingredients || [];
      // Filtrar por nombre si se ingresó texto
      const query = searchInput.value.trim().toLowerCase();
      if(query) {
        ingredients = ingredients.filter(ingredient =>
          ingredient.name.toLowerCase().includes(query)
        );
      }
      renderIngredientList(ingredients);
    })
    .catch(error => console.error("Error al obtener ingredientes:", error));
  });
}

// Exponemos la función globalmente para su uso en dashboard.js
window.initIngredientSearch = initIngredientSearch;
