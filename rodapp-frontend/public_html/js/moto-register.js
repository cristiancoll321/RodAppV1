let currentStep = 1;

const titles    = ['Datos básicos', 'Datos técnicos', 'Confirmar'];
const subtitles = ['Marca y modelo', 'Cilindrada, placa y km', 'Revisa antes de guardar'];

function selectBrand(el, name) {
    document.querySelectorAll('.brand-card').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    document.getElementById('inp-brand').value = name;
}

function updateStepUI() {
    document.getElementById('step-title').textContent    = titles[currentStep-1];
    document.getElementById('step-subtitle').textContent = subtitles[currentStep-1];
    document.getElementById('step-ctr').textContent      = currentStep + ' / 3';
    ['d1','d2','d3'].forEach((id,i) => {
        const d = document.getElementById(id);
        if (i+1 < currentStep) d.className = 's-dot done';
        else if (i+1 === currentStep) d.className = 's-dot on';
        else d.className = 's-dot';
    });
    document.getElementById('btn-prev').style.display = currentStep > 1 ? 'flex' : 'none';
    document.getElementById('btn-next').textContent   = currentStep === 3 ? '✓ Guardar Moto' : 'Siguiente →';
    document.getElementById('btn-back').href = currentStep === 1 ? 'garage.html' : '#';
    document.getElementById('btn-back').onclick = currentStep > 1 ? (e) => { e.preventDefault(); prevStep(); } : null;
}

function validateStep1() {
    const brand = document.getElementById('inp-brand').value.trim();
    const model = document.getElementById('inp-model').value.trim();
    const color = document.getElementById('inp-color').value.trim();
    const fuel = document.getElementById('inp-fuel').value.trim();

    if (!brand) { alert('Por favor selecciona una marca.'); return false; }
    if (!model) { alert('Por favor ingresa el modelo de la moto.'); return false; }
    if (!color) { alert('Por favor ingresa el color.'); return false; }
    if (!fuel) { alert('Por favor selecciona el tipo de combustible.'); return false; }
    return true;
}

function validateStep2() {
    const cc = document.getElementById('inp-cc').value.trim();
    const plate = document.getElementById('inp-plate').value.trim();
    const km = document.getElementById('inp-odo').value.trim();

    if (!cc) { alert('Por favor ingresa la cilindrada.'); return false; }
    if (parseInt(cc) > 2500) { alert('La cilindrada no puede ser mayor a 2500 cc.'); return false; }
    if (!plate) { alert('Por favor ingresa la placa.'); return false; }
    if (!/^[A-Z]{3}-\d{3}$|^[A-Z0-9]{8}$/.test(plate)) { 
        alert('Formato de placa incorrecto. Usa ABC-123 o ABCD123E.'); 
        return false; 
    }
    if (!km) { alert('Por favor ingresa el kilometraje.'); return false; }
    if (parseInt(km) < 0) { alert('El kilometraje no puede ser negativo.'); return false; }
    return true;
}

function nextStep() {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2) {
        if (!validateStep2()) return;
        updateSummary();
    }
    if (currentStep === 3) {
        saveMoto();
        return;
    }
    document.getElementById('step' + currentStep).style.display = 'none';
    currentStep++;
    document.getElementById('step' + currentStep).style.display = 'block';
    updateStepUI();
    window.scrollTo(0,0);
}

function prevStep() {
    if (currentStep === 1) return;
    document.getElementById('step' + currentStep).style.display = 'none';
    currentStep--;
    document.getElementById('step' + currentStep).style.display = 'block';
    updateStepUI();
    window.scrollTo(0,0);
}

function updateSummary() {
    const brand = document.getElementById('inp-brand').value;
    const model = document.getElementById('inp-model').value;
    const plate = document.getElementById('inp-plate').value;
    const color = document.getElementById('inp-color').value;
    const cc = document.getElementById('inp-cc').value;
    const km = document.getElementById('inp-odo').value;
    const fuel = document.getElementById('inp-fuel').value;

    document.getElementById('sum-name').textContent  = brand + ' ' + model;
    document.getElementById('sum-plate').textContent = 'Placa: ' + plate;
    document.getElementById('sum-color').textContent = color || '—';
    document.getElementById('sum-cc').textContent    = (cc || '—') + ' cc';
    document.getElementById('sum-odo').textContent   = (km ? parseInt(km).toLocaleString() : '—') + ' km';
    document.getElementById('sum-fuel').textContent  = fuel || '—';
}

async function saveMoto() {
    const usuario = getUser();
    
    if (!usuario.id) {
        alert('No hay usuario logueado. Por favor inicia sesión.');
        window.location.href = 'index.html';
        return;
    }

    const moto = {
        marca: document.getElementById('inp-brand').value,
        modelo: document.getElementById('inp-model').value,
        placa: document.getElementById('inp-plate').value,
        color: document.getElementById('inp-color').value,
        cilindrada: parseInt(document.getElementById('inp-cc').value),
        kmActual: parseInt(document.getElementById('inp-odo').value),
        tipoCombustible: document.getElementById('inp-fuel')?.value || null,
        usuario: {
            id: usuario.id
        }
    };

    console.log("Enviando moto:", moto);
    try {
        const res = await fetch('http://localhost:8080/api/motos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moto)
        });

    if (res.ok) {
        const motoGuardada = await res.json();
        console.log('Moto guardada:', motoGuardada);
        alert('✓ Motocicleta registrada correctamente!');
        window.location.href = 'garage.html';
    } else {
        const error = await res.text();
        alert('Error al guardar: ' + error);
    }
    } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión: ' + error.message);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', updateStepUI);