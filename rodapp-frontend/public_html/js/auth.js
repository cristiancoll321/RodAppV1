// =============================================
//  RodApp - auth.js
//  Autenticación con API
// =============================================

const API_BASE = 'http://localhost:8080/api'; // Cambiar según tu configuración

// ── LOGIN ───────────────────────────────────
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validar campos
  if (!email || !password) {
    showError('email', 'Completa todos los campos');
    return;
  }

  if (!isValidEmail(email)) {
    showError('email', 'Correo inválido');
    return;
  }

  // Mostrar loading
  document.getElementById('loading').classList.add('show');
  document.getElementById('loginForm').style.opacity = '0.6';
  document.getElementById('loginForm').style.pointerEvents = 'none';

  try {
    const response = await fetch(`${API_BASE}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data));
      // Redirigir a home
      window.location.href = 'pages/home.html';
    } else {
      showError('email', data.message || 'Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('email', 'Error de conexión con el servidor');
  } finally {
    document.getElementById('loading').classList.remove('show');
    document.getElementById('loginForm').style.opacity = '1';
    document.getElementById('loginForm').style.pointerEvents = 'auto';
  }
}

// ── REGISTRO ────────────────────────────────
async function handleRegister(event) {
  event?.preventDefault();

  const nombre = document.getElementById('inp-name')?.value.trim();
  const email = document.getElementById('inp-email')?.value.trim();
  const password = document.getElementById('inp-pass')?.value;
  const confirm = document.getElementById('inp-confirm')?.value;

  // Validar campos
  if (!nombre || !email || !password || !confirm) {
    showRegisterError('Completa todos los campos');
    return false;
  }

  if (!isValidEmail(email)) {
    showRegisterError('Correo inválido');
    return false;
  }

  if (password.length < 8) {
    showRegisterError('Contraseña mínimo 8 caracteres');
    return false;
  }

  if (password !== confirm) {
    showRegisterError('Las contraseñas no coinciden');
    return false;
  }

  // Mostrar loading
  const btn = event?.target?.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/usuarios/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data));
      // Redirigir a home
      window.location.href = '../pages/home.html';
    } else {
      showRegisterError(data.message || 'Error al registrar');
    }
  } catch (error) {
    console.error('Error:', error);
    showRegisterError('Error de conexión con el servidor');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ── LOGOUT ──────────────────────────────────
function handleLogout() {
  localStorage.removeItem('usuario');
  window.location.href = '../../index.html';
}

// ── HELPERS ─────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function showRegisterError(message) {
  alert(message); // O mostrar en un elemento del DOM
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}

// ── GET USUARIO AUTENTICADO ─────────────────
function getAuthUser() {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
}

// ── VERIFICAR AUTENTICACIÓN ─────────────────
function checkAuth() {
  const user = getAuthUser();
  if (!user) {
    window.location.href = '../../index.html';
  }
  return user;
}

// ── SETUP LISTENERS ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Limpiar errores al escribir
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (emailInput) emailInput.addEventListener('focus', () => clearError('email'));
  if (passwordInput) passwordInput.addEventListener('focus', () => clearError('password'));
});
