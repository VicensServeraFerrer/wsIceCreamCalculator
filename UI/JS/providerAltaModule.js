// providerAltaModule.js
// Este módulo agrupa la vista (formulario) y la funcionalidad para dar de alta un proveedor.

if (!document.getElementById('provider-css')) {
    const linkElem = document.createElement('link');
    linkElem.id = 'provider-css';
    linkElem.rel = 'stylesheet';
    // Asegúrate de que la ruta sea la correcta según la estructura de tu proyecto.
    // En este ejemplo, se asume que la carpeta CSS está en el directorio superior.
    linkElem.href = '../CSS/provider.css';
    document.head.appendChild(linkElem);
}

const providerAltaTemplate = `
<div class="provider-form-container">
  <h2>Alta de Proveedor</h2>
  <form id="providerForm">
    <div class="form-group">
      <label for="providerName">Nombre:</label>
      <input type="text" id="providerName" name="name" required placeholder="Introduce el nombre">
    </div>
    <div class="form-group">
      <label for="providerTlf">Teléfono:</label>
      <input type="text" id="providerTlf" name="tlf" required placeholder="Introduce el teléfono">
    </div>
    <div class="form-group">
      <label for="providerAddress">Dirección:</label>
      <input type="text" id="providerAddress" name="address" required placeholder="Introduce la dirección">
    </div>
    <button type="submit">Crear Proveedor</button>
  </form>
  <div id="providerMessage"></div>
</div>
`;

/**
 * Carga la vista de alta de proveedor en el contenedor que se le pase
 * y asigna la funcionalidad del formulario.
 *
 * @param {HTMLElement} container - El contenedor donde se inyectará la vista.
 */
function initProviderAlta(container) {
  // Inyectamos el template HTML
  container.innerHTML = providerAltaTemplate;

  // Añadimos el listener para gestionar el envío del formulario
  const providerForm = document.getElementById('providerForm');
  providerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recoger los datos del formulario
    const formData = {
      name: document.getElementById('providerName').value.trim(),
      tlf: document.getElementById('providerTlf').value.trim(),
      address: document.getElementById('providerAddress').value.trim()
    };

    try {
      const response = await fetch('http://localhost:3000/provider/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });

      const providerMessage = document.getElementById('providerMessage');
      if (!response.ok) {
        const errorText = await response.text();
        providerMessage.textContent = 'Error: ' + errorText;
        providerMessage.style.color = 'red';
      } else {
        const data = await response.json();
        providerMessage.textContent = 'Proveedor creado exitosamente. ID: ' + data.id;
        providerMessage.style.color = 'green';
        providerForm.reset();
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  });
}

// En un entorno sin módulos ES (o para simplicidad), exponemos la función en el objeto global
window.initProviderAlta = initProviderAlta;
