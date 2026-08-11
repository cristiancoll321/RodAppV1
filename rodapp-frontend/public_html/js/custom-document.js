// Ocultar toggle de reminder
document.getElementById('reminder-toggle').addEventListener('change', function() {
    document.getElementById('reminder-days').style.display = this.checked ? 'block' : 'none';
});

const docTypes = {
    'licencia': 'Licencia de Conducción',
    'todo-riesgo': 'Seguro Todo Riesgo',
    'garantia': 'Garantía',
    'personalizado': ''
};

let currentType = 'licencia';

function selectDocType(el, type) {
    document.querySelectorAll('.doc-type-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    currentType = type;

    const nameField = document.getElementById('name-field');
    const nameInput = document.getElementById('doc-name');

    if (type === 'personalizado') {
    nameField.style.display = 'block';
    nameInput.placeholder = 'Ej. Garantía de batería';
    nameInput.value = '';
    } else {
    nameField.style.display = 'none';
    nameInput.value = docTypes[type];
    }
    updatePreview();
}

function updatePreview() {
    const name = currentType === 'personalizado'
    ? document.getElementById('doc-name').value
    : docTypes[currentType];
    const entity = document.getElementById('doc-entity').value;
    const expiry = document.getElementById('doc-expiry').value;

    if (name || entity || expiry) {
    document.getElementById('preview-card').classList.add('visible');
    document.getElementById('preview-name').textContent = name || '—';
    document.getElementById('preview-entity').textContent = entity || '—';
    if (expiry) {
        const d = new Date(expiry + 'T00:00:00');
        document.getElementById('preview-expiry').textContent = d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
    } else {
        document.getElementById('preview-expiry').textContent = '—';
    }
    }
}

function handleFile(input) {
    if (input.files && input.files[0]) {
    document.getElementById('upload-text').textContent = '✓ ' + input.files[0].name;
    }
}

function saveDocument() {
    const name = currentType === 'personalizado'
    ? document.getElementById('doc-name').value
    : docTypes[currentType];
    if (!name) { alert('Por favor ingresa el nombre del documento.'); return; }
    alert('✅ Documento guardado correctamente.');
    window.location.href = 'garage.html';
}

// Inicializar: ocultar campo nombre para tipo por defecto
document.getElementById('name-field').style.display = 'none';
document.getElementById('doc-name').value = docTypes['licencia'];