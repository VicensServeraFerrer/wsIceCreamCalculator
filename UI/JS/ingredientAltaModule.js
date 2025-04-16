// ingredientAltaModule.js
// Este módulo gestiona la vista y funcionalidad para dar de alta un ingrediente de forma dinámica,
// utilizando un layout en el que los campos fijos se muestran en una fila superior,
// el selector de tipo justo debajo, y los campos específicos se inyectan en una cuadrícula de 4 columnas.
// Además, el botón de envío se posiciona fijo en la esquina inferior derecha del contenedor.

// Vincular ingredient.css si aún no está vinculado
if (!document.getElementById('ingredient-css')) {
    const linkElem = document.createElement('link');
    linkElem.id = 'ingredient-css';
    linkElem.rel = 'stylesheet';
    // Ajusta esta ruta según la estructura de tu proyecto (en este ejemplo, la carpeta CSS está en el directorio superior)
    linkElem.href = '../CSS/ingredient.css';
    document.head.appendChild(linkElem);
}

// Template del selector de tipo de ingrediente
const ingredientTypeSelectTemplate = `
<div class="form-group">
  <label for="ingredientTypeSelect">Tipo de Ingrediente:</label>
  <select id="ingredientTypeSelect" name="ingredientType" required>
    <option value="" disabled selected>Seleccione un tipo</option>
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
</div>
`;

// Template de los campos comunes (fijos) – estos se disponen en la fila 0
const commonFieldsTemplate = `
<div class="form-group">
  <label for="ingredientName">Nombre:</label>
  <input type="text" id="ingredientName" name="name" required placeholder="Introduce el nombre">
</div>
<div class="form-group">
  <label for="ingredientDescription">Descripción:</label>
  <input type="text" id="ingredientDescription" name="description" required placeholder="Introduce la descripción">
</div>
<div class="form-group">
  <label for="ingredientST">Sólidos Totales (ST):</label>
  <input type="number" id="ingredientST" name="ST" required min="0" max="100" placeholder="Introduce ST">
</div>
`;

// Template del botón de envío; se le asigna la clase para posicionarlo fijo
const submitButtonTemplate = `<button type="submit" class="fixed-submit-btn">Crear Ingrediente</button>`;

// Mapeo de los campos específicos según el tipo de ingrediente seleccionado
const specificFieldsByType = {
  "1": [  // Leche (Milk)
      { id: "MG", label: "Materia Grasa", type: "number", min: 0, max: 100 },
      { id: "LPD", label: "Leche en polvo desnatada", type: "number", min: 0, max: 100 },
      { id: "PAC", label: "Poder anticongelante", type: "number" }
  ],
  "2": [ // Azúcar (Sugar)
      { id: "POD", label: "Poder edulcorante", type: "number" },
      { id: "PAC", label: "Poder anticongelante", type: "number" }
  ],
  "3": [ // Fruta (Fruit)
      { id: "percentsugar", label: "Porcentaje de azúcar", type: "number", min: 0, max: 100 },
      { id: "orientativeQuantity", label: "Cantidad orientativa", type: "number" },
      { id: "MG", label: "Materia Grasa", type: "number", min: 0, max: 100 }
  ],
  "4": [ // Cacao (Cocoa)
      { id: "percentsugar", label: "Porcentaje de azúcar", type: "number", min: 0, max: 100 },
      { id: "percentCocoa", label: "Porcentaje de cacao", type: "number", min: 0, max: 100 },
      { id: "percentCocoaButter", label: "Porcentaje de manteca de cacao", type: "number", min: 0, max: 100 }
  ],
  "5": [ // Frutos Secos (Nut)
      { id: "percentsugar", label: "Porcentaje de azúcar", type: "number", min: 0, max: 100 },
      { id: "MG", label: "Materia Grasa", type: "number", min: 0, max: 100 },
      { id: "orientativeQuantity", label: "Cantidad orientativa", type: "number" }
  ],
  "6": [ // Especia (Spice)
      { id: "proportion", label: "Proporción de especias", type: "number", min: 0, max: 100 }
  ],
  "7": [ // Queso (Cheese)
      { id: "MG", label: "Materia Grasa", type: "number", min: 0, max: 100 },
      { id: "LPD", label: "Leche en polvo desnatada", type: "number", min: 0, max: 100 },
      { id: "PAC", label: "Poder anticongelante", type: "number" },
      { id: "percentsalt", label: "Porcentaje de sal", type: "number", min: 0, max: 100 }
  ],
  "8": [ // Salado (Salty)
      { id: "MG", label: "Materia Grasa", type: "number", min: 0, max: 100 },
      { id: "percentsalt", label: "Porcentaje de sal", type: "number", min: 0, max: 100 },
      { id: "PAC", label: "Poder anticongelante", type: "number" }
  ],
  "9": [ // Alcohol
      { id: "grade", label: "Grado de alcohol", type: "number", min: 0, max: 100 },
      { id: "percentsugar", label: "Porcentaje de azúcar", type: "number", min: 0, max: 100 }
  ],
  "10": [ // Genérico
      { id: "MG", label: "Materia Grasa Animal", type: "number", min: 0, max: 100 },
      { id: "MGV", label: "Materia Grasa Vegetal", type: "number", min: 0, max: 100 },
      { id: "LPD", label: "Leche en polvo desnatada", type: "number", min: 0, max: 100 },
      { id: "PAC", label: "Poder anticongelante", type: "number" },
      { id: "POD", label: "Poder edulcorante", type: "number" },
      { id: "grade", label: "Grado de alcohol", type: "number", min: 0, max: 100 },
      { id: "percentsugar", label: "Porcentaje de azúcar", type: "number", min: 0, max: 100 },
      { id: "percentCocoa", label: "Porcentaje de cacao", type: "number", min: 0, max: 100 },
      { id: "percentCocoaButter", label: "Porcentaje de manteca de cacao", type: "number", min: 0, max: 100 },
      { id: "orientativeQuantity", label: "Cantidad orientativa", type: "number" }
  ]
};

// Función que genera el HTML para los campos específicos según el tipo seleccionado
function renderSpecificFields(typeValue) {
  const fields = specificFieldsByType[typeValue] || [];
  let html = '';
  fields.forEach(field => {
    html += `<div class="form-group">
      <label for="${field.id}">${field.label}:</label>
      <input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="Introduce ${field.label}"`;
    if (field.min !== undefined) {
      html += ` min="${field.min}"`;
    }
    if (field.max !== undefined) {
      html += ` max="${field.max}"`;
    }
    html += ` required></div>`;
  });
  return html;
}

// Template completo del formulario de alta de ingrediente, adaptado al nuevo layout:
// - Fila 0: campos comunes (fijos) dispuestos horizontalmente
// - Fila 1: selector de tipo
// - Fila 2: grid de 4 columnas para los campos específicos
// - Botón de envío fijo en la esquina inferior derecha
const ingredientAltaTemplate = `
<div class="ingredient-form-container">
  <h2>Alta de Ingrediente</h2>
  <form id="ingredientForm">
    <!-- Fila 0: campos fijos -->
    <div class="form-row fixed-fields">
      ${commonFieldsTemplate}
    </div>
    <!-- Fila 1: selector de tipo -->
    <div class="form-row type-selector">
      ${ingredientTypeSelectTemplate}
    </div>
    <!-- Fila 2: campos específicos en grid -->
    <div class="form-row specific-fields">
      <div id="specificFields" class="grid-fields"></div>
    </div>
    ${submitButtonTemplate}
  </form>
  <div id="ingredientMessage"></div>
</div>
`;

/**
 * Inicializa la vista para dar de alta un ingrediente en el contenedor especificado.
 * Se inyecta el formulario y se asignan los listeners necesarios.
 * @param {HTMLElement} container
 */
function initIngredientAlta(container) {
  container.innerHTML = ingredientAltaTemplate;

  const ingredientForm = document.getElementById('ingredientForm');
  const typeSelect = document.getElementById('ingredientTypeSelect');
  const specificFieldsContainer = document.getElementById('specificFields');

  // Cuando el usuario selecciona un tipo, se generan los campos específicos en el grid
  typeSelect.addEventListener('change', function() {
    const selectedType = typeSelect.value;
    specificFieldsContainer.innerHTML = renderSpecificFields(selectedType);
  });

  // Manejo del envío del formulario
  ingredientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recolectar los datos del formulario
    const formData = {};
    const formElements = ingredientForm.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name && element.value) {
        // Si el campo es el selector de tipo, forzamos que se convierta a número,
        // ya que su elemento type es "select-one" y no "number"
        if (element.name === 'ingredientType') {
          formData[element.name] = Number(element.value);
        } else {
          formData[element.name] = element.type === 'number' ? Number(element.value) : element.value.trim();
        }
      }
    }

    // Enviar la petición a la API para crear el ingrediente
    try {
      const response = await fetch('http://localhost:3000/ingredient/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });

      const ingredientMessage = document.getElementById('ingredientMessage');
      if (!response.ok) {
        const errorText = await response.text();
        ingredientMessage.textContent = 'Error: ' + errorText;
        ingredientMessage.style.color = 'red';
      } else {
        const data = await response.json();
        ingredientMessage.textContent = 'Ingrediente creado exitosamente';
        ingredientMessage.style.color = 'green';
        ingredientForm.reset();
        specificFieldsContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  });
}

// Exponemos la función globalmente para que pueda ser llamada desde dashboard.js
window.initIngredientAlta = initIngredientAlta;
