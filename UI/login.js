// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('error');
  
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault(); // Prevenir el envío tradicional del formulario
      errorDiv.textContent = ''; // Limpiar mensajes anteriores
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
  
        if (!response.ok) {
          // Si la respuesta no es 200 OK, gestionamos el error
          if (response.status === 401) {
            errorDiv.textContent = 'Credenciales incorrectas.';
          } else {
            errorDiv.textContent = 'Error en el servidor. Intente más tarde.';
          }
          return;
        }
  
        const data = await response.json();
        const token = data.jwt;
        
        if (token) {
          // Guardamos el token en localStorage para usar en peticiones futuras
          localStorage.setItem('token', token);
          // Redireccionamos a la siguiente pantalla, por ejemplo, un dashboard
          window.location.href = 'dashboard.html';
        } else {
          errorDiv.textContent = 'Token no recibido. Intente nuevamente.';
        }
      } catch (error) {
        console.error('Error de conexión:', error);
        errorDiv.textContent = 'Error de conexión, intente más tarde.';
      }
    });
  });
  