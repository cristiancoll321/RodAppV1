// =============================================
//  RodApp - auth.js
//  Autenticación con API
// =============================================

const API_BASE = 'http://localhost:8080/api'; // Cambiar según tu configuración

// ── LOGIN ───────────────────────────────────
async function handleLogin(event) {
  event.preventDefault();

  let email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validar campos
  if (!email || !password) {
    showError('email', 'Completa todos los campos');
    return;
  }

  // Convertir a minúsculas ANTES de validar
  email = cleanEmail(email);

  if (!isValidEmail(email)) {
    showError('email', 'Correo inválido o contiene doble @');
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
  let email = document.getElementById('inp-email')?.value.trim();
  const password = document.getElementById('inp-pass')?.value;
  const confirm = document.getElementById('inp-confirm')?.value;

  // Validar campos
  if (!nombre || !email || !password || !confirm) {
    showRegisterError('Completa todos los campos');
    return false;
  }

  // VALIDACIÓN NOMBRE: Solo letras, espacios y tildes, 3-50 chars
  if (!isValidName(nombre)) {
    showRegisterError('Nombre inválido (3-50 caracteres, solo letras y espacios)');
    return false;
  }

  // VALIDACIÓN EMAIL: Formato correcto y no doble @
  if (!isValidEmail(email)) {
    showRegisterError('Correo inválido (ejemplo: usuario@dominio.com)');
    return false;
  }

  // Convertir a minúsculas antes de enviar
  email = cleanEmail(email);

  // VALIDACIÓN CONTRASEÑA: Mínimo 8 caracteres
  if (password.length < 8) {
    showRegisterError('La contraseña debe tener al menos 8 caracteres');
    return false;
  }

  // VALIDACIÓN COINCIDENCIA
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
        nombre: capitalizeNameProperly(nombre),
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
// ✓ VALIDAR EMAIL - Sin doble @, formato correcto
function isValidEmail(email) {
  if (!email) return false;
  // Contar el número de @ - debe ser exactamente 1
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) return false;
  // Formato: algo@algo.algo (más restrictivo)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.toLowerCase());
}

// ✓ VALIDAR NOMBRE - Solo letras, espacios, tildes (á,é,í,ó,ú,ñ)
function isValidName(name) {
  if (!name || name.length < 3 || name.length > 50) return false;
  // Solo letras (mayúsculas, minúsculas), tildes y espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
  return nameRegex.test(name);
}

// ✓ VALIDAR CONTRASEÑA - Mínimo 8 caracteres
function isValidPassword(password) {
  return password && password.length >= 8;
}

// ✓ VERIFICAR QUE LAS CONTRASEÑAS COINCIDAN
function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword && isValidPassword(password);
}

// ✓ LIMPIAR EMAIL - Convertir a minúsculas y trimear
function cleanEmail(email) {
  return email.trim().toLowerCase();
}

// ✓ LIMPIAR NOMBRE - Trimear espacios extras
function cleanName(name) {
  return name.trim();
}

// ✓ CAPITALIZAR NOMBRE - Primera letra de cada palabra en mayúscula
function capitalizeNameProperly(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
