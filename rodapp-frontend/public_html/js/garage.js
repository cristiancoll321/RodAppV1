// Documentos obligatorios vs adicionales
const DOCS_OBLIGATORIOS = ['SOAT', 'TECNOMECANICA', 'LICENCIA_TRANSITO'];
const DOCS_ICON_MAP = {
    'SOAT': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="1.8" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>', bg: 'rgba(34,197,94,0.12)' },
    'TECNOMECANICA': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="1.8" width="24" height="24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>', bg: 'rgba(255,107,53,0.12)' },
    'LICENCIA_TRANSITO': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" width="24" height="24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>', bg: 'rgba(0,212,200,0.12)' },
    'SEGURO_TODO_RIESGO': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', bg: 'rgba(0,212,200,0.12)' },
    'REVISION_TECNICA': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="1.8" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', bg: 'rgba(34,197,94,0.12)' }
};

function getStatusBadge(fechaVencimiento) {
    if (!fechaVencimiento) return '<span class="badge badge-cyan">Permanente</span>';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(fechaVencimiento);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '<span class="badge badge-red">Vencido</span>';
    if (diffDays < 30) return '<span class="badge badge-orange">Expira pronto</span>';
    return '<span class="badge badge-green">Vigente</span>';
}

function formatDate(dateStr) {
    if (!dateStr) return 'Permanente';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function getDocTypeName(tipo) {
    const names = {
    'SOAT': 'SOAT Digital',
    'TECNOMECANICA': 'Certificado RTM',
    'LICENCIA_TRANSITO': 'Licencia de Conducción',
    'SEGURO_TODO_RIESGO': 'Seguro Todo Riesgo',
    'REVISION_TECNICA': 'Revisión Técnica'
    };
    return names[tipo] || tipo;
}

async function loadGarageDocs() {
const usuario = getUser();
if (!usuario || !usuario.id) return;

    // Obtener ID de la moto actual (si la hay)
const params = new URLSearchParams(window.location.search);
let motoId = params.get('motoId');

    // fallback: primera moto del usuario
if (!motoId) {
    const motosRes = await fetch(`http://localhost:8080/api/motos/usuario/${usuario.id}`);
    const motos = await motosRes.json();
    if (Array.isArray(motos) && motos.length > 0) {
    motoId = motos[0].id;
    }
}

if (!motoId) {
    document.getElementById('garage-docs-container').style.display = 'none';
    return;
}

    // Cargar documentos de esta moto
    fetch(`http://localhost:8080/api/documentos/moto/${motoId}`)
    .then(r => r.json())
    .then(data => {
        if (!Array.isArray(data)) data = [];

        // Botón de agregar documento
        const addDocButton = `
        <div class="add-doc-card" onclick="window.location='documents.html?motoId=${motoId}&action=nuevo'">
            <div style="width:44px;height:44px;border-radius:10px;border:1px dashed;display:flex;align-items:center;justify-content:center;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div>
            <strong style="display:block; font-size:0.9rem;">Añadir documento</strong>
            <span style="font-size:0.78rem;">Registra tus documentos</span>
            </div>
        </div>
        `;

        // Renderizar todos los documentos
        const docCards = data.map(doc => {
        const iconData = DOCS_ICON_MAP[doc.tipo] || DOCS_ICON_MAP['SOAT'];
        const status = getStatusBadge(doc.fechaVencimiento);
        return `
            <div class="doc-card" onclick="window.location='documents.html?motoId=${motoId}&docId=${doc.id}'">
            <div class="doc-card-icon" style="background: ${iconData.bg};">
                ${iconData.icon}
            </div>
            <div class="doc-card-info">
                <strong>${getDocTypeName(doc.tipo)}</strong>
                <span>${doc.numeroPoliza || 'S/N'}</span>
            </div>
            <div class="doc-card-right">
                ${status}
                <span style="font-size:0.72rem; color:var(--text-muted);">${formatDate(doc.fechaVencimiento)}</span>
            </div>
            </div>
        `;
        }).join('');

        // Renderizar todo en un solo contenedor
        const docsContainer = document.getElementById('tab-documentos');
        docsContainer.innerHTML = addDocButton + docCards;
    })
    .catch(err => console.error('Error loading docs:', err));
}

// Cargar documentos cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    loadGarageDocs();
});