// Validación y carga inicial
function initMotoDetail() {
    const motoId = new URLSearchParams(window.location.search).get('id');
    if (!motoId) {
        alert('Moto no válida');
        window.location.href = 'garage.html';
        return;
    }
    loadMotoDetail(motoId);
}

// Navegación a fuel-register con ID de moto
function irAFuelRegister() {
    const motoId = new URLSearchParams(window.location.search).get('id');
    if (motoId) {
        window.location.href = `fuel-register.html?id=${motoId}`;
    } else {
        alert('Error: Moto no válida');
    }
}

// Carga dinámica de datos
async function loadMotoDetail(motoId) {
    try {
        const res = await fetch(`http://localhost:8080/api/motos/${motoId}`);
        if (!res.ok) throw new Error('Moto no encontrada');
        const moto = await res.json();

        // Actualizar título y subtítulo
        document.querySelector('.moto-title').textContent = 
        `${moto.marca || ''} ${moto.modelo || ''}`.trim();
        document.querySelector('.moto-subtitle').textContent = 
        `Placa: ${moto.placa || 'Sin placa'}`;

        // Actualizar especificaciones
        document.getElementById('spec-marca').textContent = moto.marca || 'N/A';
        document.getElementById('spec-modelo').textContent = moto.modelo || 'N/A';
        document.getElementById('spec-ano').textContent = moto.ano || 'N/A';
        document.getElementById('spec-color').textContent = moto.color || 'N/A';
        document.getElementById('spec-cilindrada').textContent = 
        moto.cilindrada ? `${moto.cilindrada} cc` : 'N/A';
        document.getElementById('spec-placa').textContent = moto.placa || 'N/A';
        document.getElementById('spec-chasis').textContent = moto.numeroChasis || 'N/A';
        document.getElementById('spec-km-inicial').textContent = 
        moto.kmInicial ? `${moto.kmInicial} km` : '0 km';

        // Actualizar stats
        document.getElementById('stat-km').textContent = moto.kmActual || 0;
        document.getElementById('stat-oil').textContent = moto.proximoMantenimiento || '—';
        document.getElementById('stat-legal').textContent = moto.estadoLegal || '—';
        document.getElementById('stat-maintenance').textContent = moto.mantenimientos || '0';

        // Ocultar sección de documentos si no hay documentos
        const documentsSection = document.getElementById('documents-section');
        if (documentsSection) {
                documentsSection.style.display = 
                (moto.documentos && moto.documentos.length > 0) ? 'block' : 'none';
        }

    } catch (error) {
        console.error('Error cargando moto:', error);
        alert('Error al cargar los detalles de la moto');
        window.location.href = 'garage.html';
    }
}

// Eliminar moto (real)
async function confirmDelete() {
    const motoId = new URLSearchParams(window.location.search).get('id');

    if (!motoId) return;

    const confirmar = confirm('¿Eliminar esta motocicleta? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    try {
        const res = await fetch(`http://localhost:8080/api/motos/${motoId}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error('No se pudo eliminar');
    }

        alert('Moto eliminada correctamente ✅');
        window.location.href = 'garage.html';

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la moto');
    }
}

// Cargar tanqueadas de la moto
async function loadTanqueadas() {
    const motoId = new URLSearchParams(window.location.search).get('id');
    const container = document.getElementById('tanqueadas-container');

    try {
        const res = await fetch(`http://localhost:8080/api/tanqueadas/moto/${motoId}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `
            <p style="color:var(--text-muted);font-size:0.8rem; padding: 0 20px;">
            No hay tanqueadas registradas
            </p>
        `;
        return;
        }

        // Actualizar el km actual con el mayor odometro registrado
        const maxOdometro = Math.max(...data.map(t => t.odometro || 0));
        if (maxOdometro > 0) {
        document.getElementById('stat-km').textContent = maxOdometro;
        console.log('km actualizado a:', maxOdometro);
        }

        // Ordenar por fecha descendente
        const sorted = [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    container.innerHTML = sorted.map(t => `
    <div class="card" style="margin-bottom:10px; padding:14px 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:0.9rem;">${t.tipoCombustible || 'Combustible'}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">${new Date(t.fecha).toLocaleDateString('es-CO')}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.8rem;">
            <div><span style="color:var(--text-muted);">Galones:</span> <strong>${t.galones || 0}</strong></div>
            <div><span style="color:var(--text-muted);">Valor:</span> <strong>$${(t.valorPagado || 0).toLocaleString()}</strong></div>
            <div><span style="color:var(--text-muted);">Odómetro:</span> <strong>${t.odometro || 0} km</strong></div>
        </div>
        </div>
    `).join('');

    } catch (error) {
    console.error('Error cargando tanqueadas:', error);
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem; padding: 0 20px;">Error al cargar tanqueadas</p>';
    }
}

// Iniciar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initMotoDetail();
    loadTanqueadas();
});