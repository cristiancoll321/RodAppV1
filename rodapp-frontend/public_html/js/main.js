// =============================================
//  RodApp - main.js
//  Navegación y lógica compartida
// =============================================

// ── Resaltar nav item activo ────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navMap = {
    'index.html':         null,
    'home.html':          'nav-home',
    'garage.html':        'nav-garage',
    'moto-register.html': 'nav-garage',
    'documents.html':     'nav-garage',
    'maintenance.html':   'nav-maintenance',
    'fuel-register.html': 'nav-fuel',
    'documents.html':     'nav-docs',
    'profile.html':       'nav-profile',
    'notifications.html': 'nav-profile',
    'tips.html':          'nav-home',
  };

  // ✓ REMOVER 'active' de TODOS los nav-items primero
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // ✓ LUEGO añadir 'active' solo al correcto
  const activeId = navMap[path];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }

  // Animar entradas con fade-up
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.05}s`;
    el.style.opacity = '0';
    el.style.animationFillMode = 'forwards';
  });
});

// ── Simular autenticación ───────────────────
const USER = {
  name: 'Carlos Rodríguez',
  email: 'carlos.rod@example.com',
  moto: 'Yamaha MT-09 (2023)',
  plate: 'BGT-123',
  km: 12500,
};

function getUser() { 
  // Obtener usuario de localStorage si existe (viene del login)
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    try {
      const usuarioLogeado = JSON.parse(usuarioGuardado);
      // Normalizar campos: el API puede retornar 'nombre' o 'name'
      return {
        name: usuarioLogeado.nombre || usuarioLogeado.name || 'Usuario',
        email: usuarioLogeado.email || '',
        id: usuarioLogeado.id || null,
        ...usuarioLogeado
      };
    } catch (e) {
      console.error('Error parseando usuario:', e);
    }
  }
  return USER;
}

// ── Saludo dinámico según hora ──────────────
function getGreeting() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días 🤘';
  if (hora >= 12 && hora < 18) return 'Buenas tardes 🏍️';
  if (hora >= 18 && hora < 21) return 'Buenas noches 🌙';
  return 'Buena madrugada 🌌';
}

// ── Actualizar saludo del usuario ───────────
function loadUserGreeting() {
  const usuario = getUser();
  const greetingEl = document.getElementById('greeting');
  const nameEl = document.getElementById('greeting-name');
  
  if (greetingEl) {
    greetingEl.textContent = getGreeting();
  }
  if (nameEl && usuario.name) {
    nameEl.textContent = usuario.name;
  }
}

// ── Cargar datos en página de perfil ────────
function loadProfileData() {
  const usuario = getUser();
  
  // Avatar con iniciales
  const avatar = document.getElementById('profile-avatar');
  if (avatar && usuario.name) {
    const iniciales = usuario.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    avatar.textContent = iniciales;
  }
  
  // Nombre completo
  const nameEl = document.getElementById('profile-name');
  if (nameEl && usuario.name) {
    nameEl.textContent = usuario.name;
  }
  
  // Moto
  const motoEl = document.getElementById('profile-moto');
  if (motoEl && usuario.moto) {
    motoEl.textContent = usuario.moto;
  }
  
  // Email
  const emailEl = document.getElementById('profile-email');
  if (emailEl && usuario.email) {
    emailEl.textContent = usuario.email;
  }
}

// ── Cargar motos del usuario ────────────────
async function loadGarageMotos() {
  const usuario = getUser();
  const container = document.getElementById('motos-container');
  const emptyGarage = document.getElementById('empty-garage');

  if (!container || !emptyGarage) return;

  if (!usuario.id) {
    container.style.display = 'none';
    emptyGarage.style.display = 'flex';
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/motos/usuario/${usuario.id}`);
    const motos = await res.json();

    if (motos.length === 0) {
      container.style.display = 'none';
      emptyGarage.style.display = 'flex';
    } else {
      container.style.display = 'block';
      emptyGarage.style.display = 'none';

      container.innerHTML = motos.map(moto => `
        <div class="garage-moto-card fade-up stagger-2"
             onclick="window.location='moto-detail.html?id=${moto.id}'"
             style="cursor:pointer;">
          <div class="moto-header">
            <div class="moto-info">
              <strong>${moto.marca} ${moto.modelo}</strong>
              <span>Placa: ${moto.placa}</span>
            </div>
            <span class="badge badge-cyan">Verificado</span>
          </div>

          <div style="display:flex; gap:20px; margin-top:14px; padding-top:14px; border-top:1px solid var(--border);">
            <div>
              <p class="stat-val">${moto.cilindrada || 'N/A'} cc</p>
              <p class="stat-lbl">Cilindraje</p>
            </div>
            <div>
              <p class="stat-val">${moto.color || 'N/A'}</p>
              <p class="stat-lbl">Color</p>
            </div>
            <div>
              <p class="stat-val">${moto.kmActual || 0} km</p>
              <p class="stat-lbl">Odómetro</p>
            </div>
          </div>
        </div>
      `).join('');
    }

  } catch (error) {
    console.error("Error cargando motos:", error);
  }
}

// ── Notificaciones badge ────────────────────
function updateNotifBadge() {
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'flex';
}

// ── Toggle FAB menu ─────────────────────────
function initFabMenu() {
  const fab = document.getElementById('fab-main');
  const menu = document.getElementById('fab-menu');
  if (!fab || !menu) return;

  fab.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    fab.innerHTML = open
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  });
}

// ── Helpers de fecha ─────────────────────────
function formatDate(date) {
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function daysUntil(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  // Cargar datos específicos según la página
  if (path === 'home.html') {
    loadUserGreeting();
  } else if (path === 'profile.html') {
    loadProfileData();
  } else if (path === 'garage.html') {
    loadGarageMotos();
  }
  
  initFabMenu();
  updateNotifBadge();
});