// produceModule.js
// Módulo para cálculo de producción de una receta (multiplica cantidades y convierte unidades)

document.addEventListener('DOMContentLoaded', () => {
  // Vincular estilos
  if (!document.getElementById('produceModal-css')) {
    const link = document.createElement('link');
    link.id = 'produceModal-css';
    link.rel = 'stylesheet';
    link.href = '../CSS/produce.css';
    document.head.appendChild(link);
  }
});

/**
 * Abre un modal superpuesto para producir una receta.
 * @param {Object} rec - Objeto receta con campos { id, name, ingredients: [ { name, quantity } ] }
 */
function openProduceModal(rec) {
  const overlay = document.createElement('div');
  overlay.className = 'produce-modal-overlay';
  overlay.innerHTML = `
    <div class="produce-modal">
      <button class="close-modal">✕</button>
      <h2>Producir Receta: ${rec.name}</h2>
      <div class="produce-form">
        <label for="produceKg">Cantidad a producir (kg):</label>
        <input type="number" id="produceKg" min="0" step="any" placeholder="kg">
        <button id="produceCalcBtn">Calcular</button>
      </div>
      <div id="produceList" class="produce-list"></div>
      <button id="produceCloseBtn" class="produce-close-btn">Salir</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Cerrar modal con X
  overlay.querySelector('.close-modal').addEventListener('click', () => overlay.remove());
  // Cerrar modal con botón Salir
  overlay.querySelector('#produceCloseBtn').addEventListener('click', () => overlay.remove());

  // Calcular producción
  overlay.querySelector('#produceCalcBtn').addEventListener('click', () => {
    const kg = parseFloat(overlay.querySelector('#produceKg').value);
    if (isNaN(kg) || kg <= 0) {
      alert('Introduce una cantidad válida en kg');
      return;
    }
    const listEl = overlay.querySelector('#produceList');
    let html = '<div class="produce-header"><span>Ingrediente</span><span>Cantidad</span></div>';
    rec.ingredients.forEach(item => {
      const total = item.quantity * kg;
      let display;
      if (total > 10000) {
        display = (total / 1000).toFixed(2) + ' kg';
      } else {
        display = total.toFixed(2) + ' g';
      }
      html += `
        <div class="produce-row">
          <span>${item.name}</span>
          <span>${display}</span>
        </div>
      `;
    });
    listEl.innerHTML = html;
  });
}

// Exponer globalmente
window.openProduceModal = openProduceModal;
