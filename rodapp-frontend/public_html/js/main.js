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
  const docsContainer = document.getElementById('garage-docs-container');

  if (!container || !emptyGarage) return;

  if (!usuario.id) {
    container.style.display = 'none';
    emptyGarage.style.display = 'flex';
    if (docsContainer) docsContainer.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`http://localhost:8081/api/motos/usuario/${usuario.id}`);
    const motos = await res.json();

    if (motos.length === 0) {
      container.style.display = 'none';
      emptyGarage.style.display = 'flex';
      if (docsContainer) docsContainer.style.display = 'none';
    } else {
      container.style.display = 'block';
      emptyGarage.style.display = 'none';
      if (docsContainer) docsContainer.style.display = 'block';

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
    if (docsContainer) docsContainer.style.display = 'none';
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

// ── Logout Global ───────────────────────────
function handleLogout() {
  localStorage.removeItem('usuario');
  // Determinar ruta de regreso al index.html
  const isSubPage = window.location.pathname.includes('/pages/');
  window.location.href = isSubPage ? '../index.html' : 'index.html';
}

// ── Sincronizar Navegación Dinámica ─────────
async function syncNavigation() {
  const usuario = getUser();
  const navFuel = document.getElementById('nav-fuel');
  
  if (!usuario.id || !navFuel) return;

  try {
    const res = await fetch(`http://localhost:8081/api/motos/usuario/${usuario.id}`);
    const motos = await res.json();
    
    if (motos.length === 1) {
      navFuel.href = `fuel-register.html?id=${motos[0].id}`;
    } else if (motos.length > 1) {
      navFuel.href = `fuel-register.html`;
    } else {
      navFuel.href = `moto-register.html`;
    }
  } catch (e) {
    console.error('Error sincronizando navegación:', e);
  }
}

// ── SIDE NAV Lógica ─────────────────────────
function initSideNav() {
  const isAuthPage = window.location.pathname.includes('index.html') || 
                     window.location.pathname.includes('register.html') ||
                     window.location.pathname.endsWith('/');
  
  if (isAuthPage) return;

  // Inyectar Side Nav si no existe
  if (!document.querySelector('.side-nav')) {
    const sideNavHtml = `
      <div class="nav-overlay" id="nav-overlay" onclick="toggleSideNav(false)"></div>
      <div class="nav-toggle-btn" id="nav-toggle-btn" onclick="toggleSideNav(true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <nav class="side-nav" id="side-nav">
        <div class="side-nav-header">
          <div class="logo" style="font-size:1.4rem;">Rod<span>App</span></div>
          <button class="close-nav-btn" onclick="toggleSideNav(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="nav-menu">
          <a href="home.html" class="nav-item" id="nav-home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Inicio
          </a>
          <a href="garage.html" class="nav-item" id="nav-garage">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            Garaje
          </a>
          <a href="fuel-register.html" class="nav-item" id="nav-fuel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 22V8l6-6h8l4 4v16"/><path d="M3 14h18"/><path d="M15 2v6"/></svg>
            Registros
          </a>
          <a href="history.html" class="nav-item" id="nav-history">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Historial
          </a>
          <a href="profile.html" class="nav-item" id="nav-profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Perfil
          </a>
        </div>
        <div class="nav-footer">
          <a href="javascript:void(0)" onclick="handleLogout()" class="nav-item" style="border:none; padding:0; color:var(--accent-red);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar sesión
          </a>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', sideNavHtml);
  }
  
  highlightActiveNavItem();
}

function toggleSideNav(open) {
  const nav = document.getElementById('side-nav');
  const overlay = document.getElementById('nav-overlay');
  const toggleBtn = document.getElementById('nav-toggle-btn');
  
  if (open) {
    nav.classList.add('open');
    overlay.classList.add('show');
    toggleBtn.style.display = 'none';
  } else {
    nav.classList.remove('open');
    overlay.classList.remove('show');
    setTimeout(() => { toggleBtn.style.display = 'flex'; }, 300);
  }
}

function highlightActiveNavItem() {
  const path = window.location.pathname.split('/').pop() || 'home.html';
  const navMap = {
    'home.html':          'nav-home',
    'garage.html':        'nav-garage',
    'moto-register.html': 'nav-garage',
    'documents.html':     'nav-garage',
    'maintenance.html':   'nav-fuel',
    'fuel-register.html': 'nav-fuel',
    'history.html':       'nav-history',
    'profile.html':       'nav-profile',
    'notifications.html': 'nav-profile',
  };

  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeId = navMap[path];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  // Inicializar Side Nav (solo en páginas internas)
  initSideNav();
  
  // Sincronizar links del nav
  syncNavigation();
  
  // Cargar datos específicos según la página
  if (path === 'home.html') {
    loadUserGreeting();
    loadHomeMoto();
  } else if (path === 'profile.html') {
    loadProfileData();
  } else if (path === 'garage.html') {
    loadGarageMotos();
  }
  
  initFabMenu();
  updateNotifBadge();
});


async function loadHomeMoto() {
  const usuario = getUser();
  const container = document.getElementById('home-moto-container');
  const extraSections = document.getElementById('home-extra-sections');

  if (!container) return;

  if (!usuario.id) {
    container.innerHTML = `<p>No hay usuario logueado</p>`;
    if (extraSections) extraSections.style.display = 'none';
    disableQuickActions(true);
    return;
  }

  try {
    const res = await fetch(`http://localhost:8081/api/motos/usuario/${usuario.id}`);
    const motos = await res.json();

    // 🚫 SIN MOTOS
    if (motos.length === 0) {
      container.innerHTML = `
        <div style="padding:40px 20px; text-align:center; background: linear-gradient(135deg, #111c24 0%, #0d1a1f 100%); border: 1px solid var(--border); border-radius: var(--radius-lg); margin: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" style="color: var(--accent-cyan); opacity: 0.5;">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <div>
            <p style="font-size:1.1rem; font-weight: 600; color:var(--text-primary); margin-bottom: 8px;">
              Aún no tienes motocicletas registradas
            </p>
            <p style="font-size:0.85rem; color:var(--text-muted);">
              Comienza registrando tu primera motocicleta para acceder a todas las funciones
            </p>
          </div>
          <a href="moto-register.html" style="display: inline-block; background: var(--accent-cyan); color: #000; padding: 12px 28px; border-radius: var(--radius); text-decoration: none; font-weight: 600; font-size: 0.95rem; margin-top: 8px; transition: opacity 0.2s;">
            + Registrar motocicleta
          </a>
        </div>
      `;
      if (extraSections) extraSections.style.display = 'none';
      disableQuickActions(true);
      return;
    }

    // ✅ CON MOTO (tomamos la primera por ahora)
    const moto = motos[0];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h3 class="moto-name">${moto.marca} ${moto.modelo}</h3>
          <p class="moto-plate">${moto.placa || 'Sin placa'}</p>
        </div>
        <span class="badge badge-cyan">Activa</span>
      </div>

      <div class="moto-stats">
        <div class="moto-stat">
          <p class="moto-stat-val">${moto.kmActual || 0}</p>
          <p class="moto-stat-label">Kilómetros</p>
        </div>
        <div class="moto-stat">
          <p class="moto-stat-val">${moto.cilindrada || 'N/A'}</p>
          <p class="moto-stat-label">Cilindraje</p>
        </div>
        <div class="moto-stat">
          <p class="moto-stat-val">OK</p>
          <p class="moto-stat-label">Estado</p>
        </div>
      </div>
    `;
    
    if (extraSections) extraSections.style.display = 'block';
    disableQuickActions(false);
  } catch (error) {
    console.error("Error cargando moto en home:", error);
    if (extraSections) extraSections.style.display = 'none';
    disableQuickActions(true);
  }
}

// ── Habilitar/deshabilitar botones de acciones rápidas ──────
function disableQuickActions(disabled) {
  const quickBtns = document.querySelectorAll('.quick-btn');
  quickBtns.forEach(btn => {
    if (disabled) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'pointer';
    }
  });
}

