function togglePass(id) {
    const i = document.getElementById(id);
    i.type = i.type === 'password' ? 'text' : 'password';
}

function checkStrength() {
    const v = document.getElementById('inp-pass').value;
    const cols = ['var(--accent-red)','var(--accent-orange)','#f59e0b','var(--accent-green)'];
    const labs = ['Muy débil','Débil','Buena','Fuerte'];
    let sc = 0;
    if (v.length >= 8) sc++;
    if (/[A-Z]/.test(v)) sc++;
    if (/[0-9]/.test(v)) sc++;
    if (/[^A-Za-z0-9]/.test(v)) sc++;
    [1,2,3,4].forEach(n => {
        const s = document.getElementById('s'+n);
        s.style.background = n <= sc ? cols[sc-1] : 'var(--bg-surface)';
    });
    const t = document.getElementById('strength-text');
    t.textContent = v.length === 0 ? 'Ingresa una contraseña' : (labs[sc-1] || 'Muy débil');
    t.style.color  = v.length === 0 ? 'var(--text-muted)' : (cols[sc-1] || cols[0]);
}

function showErr(f, msg) {
    const i = document.getElementById('inp-'+f);
    const e = document.getElementById('err-'+f);
    if (i) i.classList.add('error');
    if (e) { if(msg) e.textContent=msg; e.classList.add('show'); }
}

function clearErr(f) {
    const i = document.getElementById('inp-'+f);
    const e = document.getElementById('err-'+f);
    if (i) i.classList.remove('error');
    if (e) e.classList.remove('show');
}

// ✓ VALIDAR EMAIL - Sin doble @, formato correcto
function isValidEmail(email) {
    if (!email) return false;
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) return false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.toLowerCase());
}

// ✓ VALIDAR NOMBRE - Solo letras, espacios, tildes
function isValidName(name) {
    if (!name || name.length < 3 || name.length > 50) return false;
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

async function handleRegister() {
let ok = true;
const name = cleanName(document.getElementById('inp-name').value);
const email = cleanEmail(document.getElementById('inp-email').value);
const pass = document.getElementById('inp-pass').value;
const conf = document.getElementById('inp-confirm').value;

// Validar NOMBRE
if (!isValidName(name)) {
    showErr('name', 'Solo letras, espacios y tildes (3-50 caracteres)');
    ok = false;
}

// Validar EMAIL (sin doble @)
if (!isValidEmail(email)) {
    showErr('email', 'Correo inválido o contiene doble @');
    ok = false;
}

// Validar CONTRASEÑA
if (!isValidPassword(pass)) {
    showErr('pass', 'Mínimo 8 caracteres');
    ok = false;
}

// Validar coincidencia de contraseñas
if (!passwordsMatch(pass, conf)) {
    showErr('confirm', 'Las contraseñas no coinciden');
    ok = false;
}

if (!ok) return;

const API_BASE = 'http://localhost:8080/api';

try {
    const response = await fetch(`${API_BASE}/usuarios/registrar`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nombre: capitalizeNameProperly(name),  // ✓ Capitalizado
        email: email,        // ✓ Minúsculas, validado
        password: pass,
    }),
    });

    const data = await response.json();

    if (response.ok) {
    localStorage.setItem('usuario', JSON.stringify(data));
    document.getElementById('form-screen').style.display = 'none';
    document.getElementById('success-screen').style.display = 'flex';
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 2000);
    } else {
    alert(data.message || 'Error al registrar. Intenta con otro correo.');
    }
} catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor.');
    }
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function openPerms(name, email) {
    closeModal('modal-accounts');
    document.getElementById('perms-email').textContent = email;
    openModal('modal-perms');
}
function googleSuccess() {
    closeModal('modal-perms');
    document.getElementById('form-screen').style.display='none';
    document.getElementById('success-screen').style.display='flex';
}