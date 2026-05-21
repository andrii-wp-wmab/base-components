document.addEventListener('click', function(e) {
    var btn = e.target.closest('.input-password-toggle');
    if (!btn) return;
    var input = btn.closest('.input-wrap').querySelector('.input-field');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.classList.toggle('is-visible');
});

// country code dictionary — 3-digit checked first to avoid false early matches
var DIAL_CODES = {
    '380':{'flag':'🇺🇦','code':'+380'}, '375':{'flag':'🇧🇾','code':'+375'},
    '370':{'flag':'🇱🇹','code':'+370'}, '371':{'flag':'🇱🇻','code':'+371'},
    '372':{'flag':'🇪🇪','code':'+372'}, '374':{'flag':'🇦🇲','code':'+374'},
    '373':{'flag':'🇲🇩','code':'+373'}, '995':{'flag':'🇬🇪','code':'+995'},
    '994':{'flag':'🇦🇿','code':'+994'}, '353':{'flag':'🇮🇪','code':'+353'},
    '351':{'flag':'🇵🇹','code':'+351'}, '358':{'flag':'🇫🇮','code':'+358'},
    '385':{'flag':'🇭🇷','code':'+385'}, '386':{'flag':'🇸🇮','code':'+386'},
    '420':{'flag':'🇨🇿','code':'+420'}, '421':{'flag':'🇸🇰','code':'+421'},
    '44': {'flag':'🇬🇧','code':'+44'},  '49': {'flag':'🇩🇪','code':'+49'},
    '33': {'flag':'🇫🇷','code':'+33'},  '34': {'flag':'🇪🇸','code':'+34'},
    '39': {'flag':'🇮🇹','code':'+39'},  '31': {'flag':'🇳🇱','code':'+31'},
    '48': {'flag':'🇵🇱','code':'+48'},  '61': {'flag':'🇦🇺','code':'+61'},
    '55': {'flag':'🇧🇷','code':'+55'},  '91': {'flag':'🇮🇳','code':'+91'},
    '86': {'flag':'🇨🇳','code':'+86'},  '81': {'flag':'🇯🇵','code':'+81'},
    '82': {'flag':'🇰🇷','code':'+82'},  '52': {'flag':'🇲🇽','code':'+52'},
    '90': {'flag':'🇹🇷','code':'+90'},  '20': {'flag':'🇪🇬','code':'+20'},
    '27': {'flag':'🇿🇦','code':'+27'},  '54': {'flag':'🇦🇷','code':'+54'},
    '1':  {'flag':'🇺🇸','code':'+1'}
};

function showPhoneCountry(wrap, match, matchLen, digits) {
    wrap.querySelector('.phone-flag').textContent = match.flag;
    wrap.querySelector('.phone-dial').textContent = match.code;
    wrap.classList.add('phone-detected');
    // strip the matched code digits, keep the rest
    wrap.querySelector('.input-field').value = digits.slice(matchLen);
    requestAnimationFrame(function() {
        var prefix = wrap.querySelector('.phone-prefix');
        wrap.style.setProperty('--phone-prefix-w', (prefix.offsetWidth + 16) + 'px');
    });
}

function resetPhoneCountry(wrap) {
    wrap.classList.remove('phone-detected');
    wrap.querySelector('.phone-flag').textContent = '';
    wrap.querySelector('.phone-dial').textContent = '';
    wrap.style.setProperty('--phone-prefix-w', '16px');
    var sel = wrap.querySelector('.phone-select');
    if (sel) sel.value = '';
}

// auto-detect from typed digits
document.addEventListener('input', function(e) {
    var input = e.target.closest('.input-phone .input-field');
    if (!input) return;
    var wrap = input.closest('.input-phone');
    var digits = input.value.replace(/\D/g, '');

    // reset if field cleared
    if (!digits) { resetPhoneCountry(wrap); return; }
    // already detected — don't re-run
    if (wrap.classList.contains('phone-detected')) return;
    // wait for at least 3 digits
    if (digits.length < 3) return;

    var d3 = digits.slice(0, 3), d2 = digits.slice(0, 2), d1 = digits.slice(0, 1);
    var match = DIAL_CODES[d3] || DIAL_CODES[d2] || DIAL_CODES[d1];
    var len   = DIAL_CODES[d3] ? 3 : DIAL_CODES[d2] ? 2 : DIAL_CODES[d1] ? 1 : 0;
    if (match) showPhoneCountry(wrap, match, len, digits);
});

// init pre-detected phone inputs (e.g. server-side pre-filled or HTML examples)
document.querySelectorAll('.input-phone.phone-detected').forEach(function(wrap) {
    var prefix = wrap.querySelector('.phone-prefix');
    if (prefix) wrap.style.setProperty('--phone-prefix-w', (prefix.offsetWidth + 16) + 'px');
});

// manual country select (override / reset)
document.addEventListener('change', function(e) {
    var select = e.target.closest('.phone-select');
    if (!select) return;
    var opt = select.options[select.selectedIndex];
    var wrap = select.closest('.input-phone');
    if (!opt.value) { resetPhoneCountry(wrap); return; }
    var match = { flag: opt.dataset.flag, code: opt.value };
    wrap.querySelector('.phone-flag').textContent = match.flag;
    wrap.querySelector('.phone-dial').textContent = match.code;
    wrap.classList.add('phone-detected');
    requestAnimationFrame(function() {
        var prefix = wrap.querySelector('.phone-prefix');
        wrap.style.setProperty('--phone-prefix-w', (prefix.offsetWidth + 16) + 'px');
    });
});

// ====== Search Input ======
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