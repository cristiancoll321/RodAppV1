// Detectar parámetros de URL
const params = new URLSearchParams(window.location.search);
let motoId = params.get('id');
let tipoCombustibleSeleccionado = 'CORRIENTE';
let ultimoOdometro = 0;

console.log('Moto ID desde URL:', motoId);

// Cargar último odómetro registrado
async function cargarUltimoOdometro(id) {
    try {
    const res = await fetch(`http://localhost:8080/api/tanqueadas/moto/${id}`);
    if (!res.ok) throw new Error('Error obteniendo tanqueadas');
    
    const tanqueadas = await res.json();
    
    if (tanqueadas && tanqueadas.length > 0) {
        // Ordenar por fecha descendente y tomar el primero
        const sorted = tanqueadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        ultimoOdometro = sorted[0].odometro || 0;
        document.getElementById('inp-odometro').value = ultimoOdometro;
        document.getElementById('ultimo-km-info').textContent = `Último registro: ${ultimoOdometro.toLocaleString()} km`;
    } else {
        // Si no hay tanqueadas, cargar del kmActual de la moto
        const resM = await fetch(`http://localhost:8080/api/motos/${id}`);
        if (resM.ok) {
        const moto = await resM.json();
        ultimoOdometro = moto.kmActual || moto.kmInicial || 0;
        document.getElementById('inp-odometro').value = ultimoOdometro;
        document.getElementById('ultimo-km-info').textContent = `Km inicial: ${ultimoOdometro.toLocaleString()} km`;
        }
    }
    } catch (error) {
    console.error('Error cargando odómetro:', error);
    document.getElementById('ultimo-km-info').textContent = 'Error cargando km anterior';
    }
}

// Validar que km no disminuya
document.addEventListener('DOMContentLoaded', () => {
    const inputOdometro = document.getElementById('inp-odometro');
    const warningEl = document.getElementById('km-warning');
    
    if (inputOdometro) {
    inputOdometro.addEventListener('blur', () => {
        const valor = parseInt(inputOdometro.value) || 0;
        if (valor < ultimoOdometro) {
        warningEl.style.display = 'block';
        } else {
        warningEl.style.display = 'none';
        }
    });
    }
});

// Mostrar selector si no hay ID o inicializar
async function mostrarSelectorMotos() {
    const usuario = getUser();
    
    if (!usuario || !usuario.id) {
    alert('❌ No hay usuario logueado');
    return;
    }

    try {
    const res = await fetch(`http://localhost:8080/api/motos/usuario/${usuario.id}`);
    if (!res.ok) throw new Error('Error obteniendo motos');
    
    const motos = await res.json();

    if (motos.length === 0) {
        alert('❌ No tienes motos registradas. Registra una primero.');
        window.location.href = 'moto-register.html';
        return;
    }

    const select = document.getElementById("select-moto");
    const container = document.getElementById("moto-selector");
    const motoInfo = document.getElementById("moto-info");

    container.style.display = "block";

    select.innerHTML = motos.map(m => `
        <option value="${m.id}" data-placa="${m.placa}" data-cilindrada="${m.cilindrada || 'N/A'}">
        ${m.marca} ${m.modelo} (${m.placa})
        </option>
    `).join("");

    // Función para actualizar info dinámica
    const actualizarInfo = (motoSeleccionada) => {
        const selectedOption = select.options[select.selectedIndex];
        document.getElementById('info-placa').textContent = selectedOption.getAttribute('data-placa');
        document.getElementById('info-cilindrada').textContent = selectedOption.getAttribute('data-cilindrada');
        motoInfo.classList.add('show');
    };

    // Si no hay motoId en URL, usar el primero seleccionado
    if (!motoId) {
        motoId = String(motos[0].id);
        console.log('Moto por defecto seleccionada:', motoId);
        select.value = motoId;
        document.getElementById('back-btn').href = `moto-detail.html?id=${motoId}`;
        actualizarInfo(motos[0]);
        cargarUltimoOdometro(motoId);
        
        select.addEventListener('change', (e) => {
        motoId = String(e.target.value);
        console.log('Moto cambiada a:', motoId);
        document.getElementById('back-btn').href = `moto-detail.html?id=${motoId}`;
        actualizarInfo();
        cargarUltimoOdometro(motoId);
        });
    }
    } catch (error) {
    console.error('Error cargando motos:', error);
    alert('❌ Error cargando tus motos');
    }
}

// Llamar al iniciar la página
if (!motoId) {
    mostrarSelectorMotos();
} else {
    // Si hay ID de moto en URL, cargar último odómetro
    cargarUltimoOdometro(motoId);
}

// Si hay ID de moto, cambiar el back button
if (motoId) {
    document.getElementById('back-btn').href = `moto-detail.html?id=${motoId}`;
}

if (params.get('view') === 'history') {
    document.getElementById('form-view').style.display = 'none';
    document.getElementById('history-view').style.display = 'block';
    document.getElementById('form-footer').style.display = 'none';
}

function selectFuel(el, tipo) {
    document.querySelectorAll('.fuel-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    tipoCombustibleSeleccionado = tipo;
}

function updateGallons() {
    const cost = parseFloat(document.getElementById('inp-valor').value) || 0;
    const pricePerGal = 15800; // precio promedio galón corriente Colombia
    if (cost > 0) {
    const gals = (cost / pricePerGal).toFixed(2);
    document.getElementById('gallons-est').textContent = `≈ ${gals} galones a $${pricePerGal.toLocaleString()}/gal`;
    document.getElementById('inp-galones').value = gals;
    } else {
    document.getElementById('gallons-est').textContent = 'Ingresa el valor pagado';
    }
}

async function guardarTanqueada() {
    // Validar que hay una moto seleccionada
    const motoIdNum = Number(motoId);
    console.log('MotoId actual:', motoId, 'MotoId como número:', motoIdNum);
    
    if (!motoId || motoId === '' || isNaN(motoIdNum) || motoIdNum <= 0) {
    alert('❌ Selecciona una motocicleta válida antes de registrar.');
    return;
    }

    const valor = parseFloat(document.getElementById('inp-valor').value);
    const odometro = parseInt(document.getElementById('inp-odometro').value);
    const galones = parseFloat(document.getElementById('inp-galones').value);

    if (valor === '' || valor === null || isNaN(valor) || valor <= 0) {
    alert('❌ Por favor ingresa un costo válido (mayor a 0).');
    return;
    }
    if (!odometro || odometro <= 0) {
    alert('❌ Por favor ingresa el kilometraje actual válido.');
    return;
    }
    if (odometro < ultimoOdometro) {
    alert(`❌ El km no puede disminuir. Último registro: ${ultimoOdometro} km. Ingresa un valor mayor o igual.`);
    return;
    }
    if (!galones || galones <= 0) {
    alert('❌ Por favor ingresa los galones cargados.');
    return;
    }

    const tanqueada = {
    fecha: new Date().toISOString(),
    galones: galones,
    valorPagado: valor,
    odometro: odometro,
    tipoCombustible: tipoCombustibleSeleccionado,
    motocicleta: {
        id: motoIdNum
    }
    };

    console.log('Enviando tanqueada:', tanqueada);
    console.log('Moto ID siendo enviado:', motoIdNum);

    try {
    const res = await fetch('http://localhost:8080/api/tanqueadas', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(tanqueada)
    });

    const data = await res.text();

    if (!res.ok) {
        console.error("Error backend:", data);
        alert("❌ Error: " + data);
        return;
    }

    console.log("Respuesta backend:", data);

    // Actualizar kmActual en la moto con el nuevo odómetro
    try {
        const updateRes = await fetch(`http://localhost:8080/api/motos/${motoIdNum}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kmActual: odometro })
        });
        console.log('Moto actualizada con nuevo km:', odometro);
    } catch (e) {
        console.warn('No se pudo actualizar km en moto:', e);
    }

    alert('✅ Tanqueada registrada correctamente');
    window.location.href = `moto-detail.html?id=${motoId}`;

    } catch (error) {
    console.error('Error conexión:', error);
    alert('❌ Error de conexión: ' + error.message);
    }
}