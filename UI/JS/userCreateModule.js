// userCreateModule.js
// Módulo para creación de cuenta de usuario mediante modal superpuesto

document.addEventListener('DOMContentLoaded', () => {
  // Vincular estilos
  if (!document.getElementById('userCreate-css')) {
    const link = document.createElement('link');
    link.id = 'userCreate-css';
    link.rel = 'stylesheet';
    link.href = '../CSS/userCreate.css';
    document.head.appendChild(link);
  }
});

/**
 * Abre un modal para crear nueva cuenta de usuario.
 */
function openUserCreateModal() {
  const overlay = document.createElement('div');
  overlay.className = 'usercreate-modal-overlay';
  overlay.innerHTML = `
    <div class="usercreate-modal">
      <button class="close-modal">✕</button>
      <h2>Crear Cuenta</h2>
      <form id="userCreateForm">
        <div class="form-group">
          <label for="createName">Nombre:</label>
          <input type="text" id="createName" name="name" required placeholder="Tu nombre">
        </div>
        <div class="form-group">
          <label for="createEmail">Email:</label>
          <input type="email" id="createEmail" name="email" required placeholder="tu@correo.com">
        </div>
        <div class="form-group">
          <label for="createPassword">Contraseña:</label>
          <input type="password" id="createPassword" name="password" required placeholder="•••••••">
        </div>
        <div class="form-group">
          <label for="createTlf">Teléfono:</label>
          <input type="text" id="createTlf" name="tlf" required placeholder="Número de teléfono">
        </div>
        <button type="submit" class="btn-submit">Crear Cuenta</button>
      </form>
      <div id="userCreateMessage" class="message"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Cerrar modal
  overlay.querySelector('.close-modal').addEventListener('click', () => overlay.remove());

  // Manejar envío formulario
  const form = overlay.querySelector('#userCreateForm');
  const msgDiv = overlay.querySelector('#userCreateMessage');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgDiv.textContent = '';
    const formData = {
      name: document.getElementById('createName').value.trim(),
      email: document.getElementById('createEmail').value.trim(),
      password: document.getElementById('createPassword').value,
      tlf: document.getElementById('createTlf').value.trim()
    };
    try {
      const res = await fetch('http://localhost:3000/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.text();
        msgDiv.textContent = 'Error: ' + err;
        msgDiv.classList.add('error');
      } else {
        msgDiv.textContent = 'Usuario creado correctamente';
        msgDiv.classList.remove('error');
        form.reset();
        setTimeout(() => overlay.remove(), 1500);
      }
    } catch (err) {
      console.error(err);
      msgDiv.textContent = 'Error de conexión';
      msgDiv.classList.add('error');
    }
  });
}

// Exponer globalmente
window.openUserCreateModal = openUserCreateModal;
