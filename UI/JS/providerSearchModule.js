// providerSearchModule.js
// Este módulo gestiona la vista y funcionalidad para la búsqueda de proveedores.

// Vincular providerSearch.css si aún no está vinculado
if (!document.getElementById('providerSearch-css')) {
    const linkElem = document.createElement('link');
    linkElem.id = 'providerSearch-css';
    linkElem.rel = 'stylesheet';
    // Ajusta esta ruta según la estructura de tu proyecto (en este ejemplo, la carpeta CSS se encuentra en el directorio superior)
    linkElem.href = '../CSS/providerSearch.css';
    document.head.appendChild(linkElem);
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
 * @param {HTMLElement} container - El contenedor donde se inyectará la vista.
 */
function initProviderSearch(container) {
  container.innerHTML = providerSearchTemplate;

  const searchBtn = document.getElementById('providerSearchBtn');
  const searchInput = document.getElementById('providerSearchInput');
  const providerList = document.getElementById('providerList');

  // Función para renderizar la lista de proveedores en formato tabla
  function renderProviderList(providers) {
    if (providers.length === 0) {
      providerList.innerHTML = "<p>No se encontraron proveedores.</p>";
      return;
    }
    let html = `
      <table class="provider-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>`;
    providers.forEach(provider => {
      // Se asume que el proveedor tiene una propiedad 'id' o 'uuid'. Ajusta según corresponda.
      const providerId = provider.id || provider.uuid;
      html += `<tr class="provider-item">
        <td>${provider.name}</td>
        <td>${provider.address}</td>
        <td>${provider.tlf}</td>
        <td>
          <button class="associate-btn" data-provider-id="${providerId}">Asociar</button>
        </td>
      </tr>`;
    });
    html += `
        </tbody>
      </table>
    `;
    providerList.innerHTML = html;
  }

  // Al pulsar el botón de búsqueda...
  searchBtn.addEventListener("click", function() {
    fetch("http://localhost:3000/provider/getAll", {
      method: "GET",
      headers: { 
        "Authorization": localStorage.getItem("token")
      }
    })
    .then(response => response.json())
    .then(data => {
      let providers = data.providers || [];
      // Si hay texto en el input, se filtra por nombre (búsqueda case-insensitive)
      const query = searchInput.value.trim().toLowerCase();
      if(query) {
        providers = providers.filter(provider => 
          provider.name.toLowerCase().includes(query)
        );
      }
      renderProviderList(providers);
    })
    .catch(error => console.error("Error al obtener proveedores:", error));
  });
}

// Exponemos la función globalmente para que pueda ser llamada desde dashboard.js
window.initProviderSearch = initProviderSearch;
