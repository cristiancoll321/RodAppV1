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
    'map.html':           'nav-map',
    'history.html':       'nav-history',
    'maintenance.html':   'nav-history',
    'profile.html':       'nav-profile',
    'notifications.html': 'nav-profile',
    'tips.html':          'nav-home',
  };

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

function getUser() { return USER; }

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
  initFabMenu();
  updateNotifBadge();
});