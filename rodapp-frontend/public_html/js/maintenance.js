// API base (ajustar según entorno)
const API_BASE = "http://localhost:8080";
// Precargar fecha de hoy
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const d = document.getElementById('maint-date');
    if (d) d.value = today;
});

function openModal(tipo) {
if (tipo) {
    document.querySelectorAll('.type-opt').forEach(o => {
    o.classList.toggle('sel', o.textContent.includes(tipo));
    });
}
document.getElementById('modal-overlay').classList.add('open');
document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function closeModalOutside(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function selectType(el) {
    document.querySelectorAll('.type-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
}
function filterTab(el, cat) {
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    if (cat === 'all') {
        document.querySelectorAll('[data-cat]').forEach(c => c.style.display = '');
    } else {
        document.querySelectorAll('[data-cat]').forEach(c => {
        c.style.display = c.dataset.cat === cat ? '' : 'none';
        });
    }
}

function saveMaintenance() {
    if (!motoId) {
        alert('Selecciona primero la motocicleta para registrar el mantenimiento');
        renderMotoSelector();
        return;
    }

    const tipoEl = document.querySelector('.type-opt.sel');
    const tipo = tipoEl ? tipoEl.textContent.trim() : '';
    const fecha = document.getElementById('maint-date').value;
    const costo = document.getElementById('maint-cost').value || 0;
    const descripcion = document.getElementById('maint-obs').value || '';

    if (!tipo || !fecha) {
        alert('Por favor ingresa tipo y fecha del mantenimiento');
        return;
    }

    const payload = {
        tipoServicio: tipo,
        costo: parseFloat(costo) || 0,
        descripcion,
        fecha,
        motocicleta: { id: Number(motoId) }
    };

    (async () => {
        try {
        const r = await fetch(`${API_BASE}/api/mantenimientos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const raw = await r.text();
        if (!r.ok) {
            console.error('Backend error:', raw);
            alert('Error al guardar mantenimiento: ' + raw);
            return;
        }

        closeModal();
        await loadMaintList();
        alert('✅ Mantenimiento registrado');
    } catch (err) {
        console.error(err);
        alert('Error de conexión al guardar mantenimiento');
    }
    })();
}

// =========================
// Selección de moto y carga de mantenimientos
// =========================
const params = new URLSearchParams(window.location.search);
let motoId = params.get('motoId');
let availableMotos = [];
let selectedMoto = null;

function showSelectorMode(show) {
    document.getElementById('select-moto-mode').style.display = show ? 'block' : 'none';
    document.getElementById('selected-moto-banner').style.display = show ? 'none' : document.getElementById('selected-moto-banner').style.display;
}

async function renderMotoSelector() {
    const usuario = getUser();
    if (!usuario || !usuario.id) { alert('Debes iniciar sesión'); window.location.href = '../index.html'; return; }

    showSelectorMode(true);
    document.getElementById('page-title').textContent = 'Selecciona motocicleta';

    try {
    const res = await fetch(`${API_BASE}/api/motos/usuario/${usuario.id}`);
    const motos = await res.json();
    const list = document.getElementById('motos-list');
    availableMotos = Array.isArray(motos) ? motos : [];

    if (availableMotos.length === 0) {
        list.innerHTML = `<div class="card" style="padding:16px;">No tienes motos registradas.</div>`;
        return;
    }

    list.innerHTML = availableMotos.map(m => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid var(--border);">
        <div style="flex:1;"><strong>${m.marca} ${m.modelo}</strong><div style="font-size:0.88rem;color:var(--text-muted);">Placa: ${m.placa || 'Sin placa'}</div></div>
        <div><button class="btn" onclick="selectMoto('${m.id}')">Seleccionar</button></div>
        </div>
    `).join('');
    } catch (e) {
    console.error(e);
    alert('Error cargando motos');
    }
}

function selectMoto(id) {
    const m = availableMotos.find(x => String(x.id) === String(id));
    if (!m) return alert('Moto no encontrada');
    selectedMoto = m;
    motoId = String(id);
    history.replaceState({}, '', `maintenance.html?motoId=${motoId}`);
    document.getElementById('page-title').textContent = 'Mantenimientos';
    document.getElementById('back-link').href = `home.html`;
    document.getElementById('change-moto-link').onclick = (e) => { e.preventDefault(); history.replaceState({}, '', 'maintenance.html'); motoId = null; selectedMoto = null; renderMotoSelector(); };
    updateSelectedBanner();
    showSelectorMode(false);
    loadMaintList();
}

async function loadSelectedMoto() {
    if (!motoId) return;
    try {
    const res = await fetch(`${API_BASE}/api/motos/${motoId}`);
    if (!res.ok) return;
    selectedMoto = await res.json();
    updateSelectedBanner();
    } catch (e) { console.error(e); }
}

function updateSelectedBanner() {
    const banner = document.getElementById('selected-moto-banner');
    const info = document.getElementById('selected-moto-info');
    const addCta = document.getElementById('add-maint-cta');
    const addBtn = document.getElementById('add-maint-btn');

    if (selectedMoto) {
        banner.style.display = 'block';
        info.textContent = `${selectedMoto.marca} ${selectedMoto.modelo} · Placa: ${selectedMoto.placa || 'S/N'}`;
        if (addCta) addCta.style.display = 'block';
        if (addBtn) { addBtn.onclick = (e) => { e.preventDefault(); openModal(); }; }
    } else {
        if (banner) banner.style.display = 'none';
        if (addCta) addCta.style.display = 'none';
    }
}

async function loadMaintList() {
    if (!motoId) { renderMotoSelector(); return; }
    try {
    const svcList = document.getElementById('svc-list');
    const historyContainer = document.getElementById('maint-history-container');

    const res = await fetch(`${API_BASE}/api/mantenimientos/moto/${motoId}`);
    if (!res.ok) {
        // Si el backend devuelve 404 significa que la ruta no existe o no hay recursos
        if (res.status === 404) {
        if (svcList) svcList.innerHTML = `<div class="card" style="padding:16px;">No hay mantenimientos registrados para esta moto.</div>`;
        console.info(`API returned 404 for /api/mantenimientos/moto/${motoId}`);
        return;
        }
        const rawErr = await res.text();
        console.error('Backend error:', rawErr);
        alert('Error cargando mantenimientos: ' + rawErr);
        return;
    }

    const items = await res.json();

    document.getElementById('page-title').textContent = 'Mantenimientos';
    svcList.innerHTML = '';
    historyContainer.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
        svcList.innerHTML = `<div class="card" style="padding:16px;">No hay mantenimientos registrados para esta moto.</div>`;
        return;
    }

    // Mostrar próximos servicios (tomando los últimos items por fecha)
    svcList.innerHTML = items.map(it => `
        <div class="svc-card" style="margin-bottom:12px;">
        <div class="svc-top">
            <div>
                <p class="svc-name">${it.tipoServicio}</p>
                <p class="svc-sub">${it.fecha}</p>
            </div>
            <span class="badge badge-cyan">Registrado</span>
        </div>
        <div style="margin-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:0.88rem;color:var(--text-muted);">${it.descripcion || ''}</div>
                <div style="font-family:var(--font-mono);font-weight:700;color:var(--accent-orange);">${it.costo != null ? ('$' + it.costo) : ''}</div>
            </div>
            </div>
        </div>
        `).join('');

    // Historial reciente (los 5 más recientes)
    const recent = items.slice(0,5);
    historyContainer.innerHTML = recent.map(it => `
        <div class="maint-history-item">
            <div class="mhi-icon" style="background:rgba(0,0,0,0.04);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div class="mhi-info"><strong>${it.tipoServicio}</strong><span>${it.fecha} · ${it.descripcion || ''}</span></div>
        <div class="mhi-cost">${it.costo != null ? ('$' + it.costo) : ''}</div>
        </div>
    `).join('') + ``;

    } catch (e) {
    console.error(e);
    alert('Error cargando mantenimientos');
    }
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    // precarga de fecha ya existente
    const today = new Date().toISOString().split('T')[0];
    const d = document.getElementById('maint-date');
    if (d) d.value = today;

    if (!motoId) {
    await renderMotoSelector();
    return;
    }

    await loadSelectedMoto();
    await loadMaintList();
});