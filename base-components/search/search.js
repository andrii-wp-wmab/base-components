/* ================================================
   Base Component: Search JS
   Handles: has-value toggle, clear button
   ================================================ */
document.addEventListener('input', function(e) {
    var input = e.target.closest('.input-search .input-field');
    if (!input) return;
    input.closest('.input-search').classList.toggle('has-value', input.value.length > 0);
});

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.search-clear');
    if (!btn) return;
    var wrap = btn.closest('.input-search');
    var input = wrap.querySelector('.input-field');
    if (!input) return;
    input.value = '';
    wrap.classList.remove('has-value');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
});
