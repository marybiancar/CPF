// Lógica de Troca de Abas
function switchTab(type) {
    document.getElementById('gerar-section').classList.toggle('hidden', type !== 'gerar');
    document.getElementById('validar-section').classList.toggle('hidden', type !== 'validar');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === type);
    });
}

// Auxiliares de Cálculo
function calcDigit(digits) {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * ((digits.length + 1) - i);
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
}

// GERADOR
function handleGenerate() {
    let base = Array.from({length: 9}, () => Math.floor(Math.random() * 10)).join('');
    const d1 = calcDigit(base);
    const d2 = calcDigit(base + d1);
    const cpf = (base + d1 + d2).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    document.getElementById('cpf-generated').innerText = cpf;
}

// VALIDADOR
const inputCpf = document.getElementById('cpf-input');
const badge = document.getElementById('status-badge');

inputCpf.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove não números
    
    // Máscara simples enquanto digita
    if (value.length > 3) value = value.slice(0,3) + '.' + value.slice(3);
    if (value.length > 7) value = value.slice(0,7) + '.' + value.slice(7);
    if (value.length > 11) value = value.slice(0,11) + '-' + value.slice(11);
    e.target.value = value;

    const rawValue = value.replace(/\D/g, '');
    
    if (rawValue.length === 11) {
        if (isValidCPF(rawValue)) {
            badge.innerText = "✓ CPF Válido";
            badge.className = "badge valid";
        } else {
            badge.innerText = "✕ CPF Inválido";
            badge.className = "badge invalid";
        }
    } else {
        badge.innerText = "Aguardando...";
        badge.className = "badge";
    }
});

function isValidCPF(cpf) {
    if (/^(\d)\1+$/.test(cpf)) return false; // Elimina 111.111.111-11, etc
    const base = cpf.substring(0, 9);
    const d1 = calcDigit(base);
    const d2 = calcDigit(base + d1);
    return cpf === (base + d1 + d2);
}

function copyToClipboard() {
    const text = document.getElementById('cpf-generated').innerText;
    navigator.clipboard.writeText(text);
    const btn = document.querySelector('.icon-btn i');
    btn.className = 'fas fa-check';
    setTimeout(() => btn.className = 'far fa-copy', 2000);
}