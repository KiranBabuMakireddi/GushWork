
const toastContainer = document.getElementById('toast-container');

function showToast(title, msg, type = 'success') {
    if (!toastContainer) return;
    const iconMap = { success:'fas fa-check', error:'fas fa-times', info:'fas fa-info' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <div class="toast-icon"><i class="${iconMap[type] || iconMap.info}"></i></div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${msg}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>`;
    toastContainer.appendChild(el);
    el.querySelector('.toast-close').onclick = () => dismissToast(el);
    setTimeout(() => dismissToast(el), 4500);
}

function dismissToast(el) {
    el.classList.add('toast-hide');
    setTimeout(() => el.remove(), 350);
}