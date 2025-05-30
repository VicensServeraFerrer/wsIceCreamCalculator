// login.js
// Mejora de UI para login y botón de “Crear Cuenta”

document.addEventListener('DOMContentLoaded', () => {
  // Construcción dinámica del formulario de login
  const container = document.querySelector('.login-container');
  container.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required placeholder="usuario@ejemplo.com">
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" required placeholder="••••••••">
      </div>
      <div class="form-group">
        <button type="submit" class="btn-primary">Entrar</button>
      </div>
      <div id="error" class="error-message"></div>
    </form>
    <div class="alternative">
      <span>¿No tienes cuenta?</span>
      <button id="btnCreateAccount" class="btn-secondary">Crear Cuenta</button>
    </div>
  `;

  const loginForm = document.getElementById('loginForm');
  const errorDiv   = document.getElementById('error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        errorDiv.textContent = res.status === 401
          ? 'Credenciales incorrectas.'
          : 'Error del servidor. Intenta más tarde.';
        return;
      }

      const { jwt } = await res.json();
      if (jwt) {
        localStorage.setItem('token', jwt);
        window.location.href = 'dashboard.html';
      } else {
        errorDiv.textContent = 'No se recibió token. Inténtalo de nuevo.';
      }

    } catch (err) {
      console.error('Error de conexión:', err);
      errorDiv.textContent = 'No se puede conectar. Revisa tu red.';
    }
  });

  // Botón “Crear Cuenta”: abre modal de alta de usuario
  document.getElementById('btnCreateAccount')
    .addEventListener('click', openUserCreateModal);
});
