/* ================================================
   Base Component: Validation JS
   Handles: required, email, min, phone, match rules
   Usage: data-validate="required|email" on .input-wrap
   ================================================ */
(function() {
    var RULES = {
        required: function(val)      { return val.trim().length > 0; },
        email:    function(val)      { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()); },
        min:      function(val, n)   { return val.trim().length >= parseInt(n, 10); },
        phone:    function(val)      { return /^[\d\s\-()+]{7,}$/.test(val.trim()); },
        match:    function(val, sel) {
            var target = document.querySelector(sel);
            return target ? val === target.value : true;
        }
    };

    function getVal(wrap) {
        var input = wrap.querySelector('.input-field');
        return input ? input.value : '';
    }

    function showError(wrap, msg) {
        wrap.classList.add('input-error');
        var span = wrap.querySelector('.input-error-msg');
        if (!span) {
            span = document.createElement('span');
            span.className = 'input-error-msg';
            wrap.appendChild(span);
        }
        span.textContent = msg;
    }

    function clearError(wrap) {
        wrap.classList.remove('input-error');
        var span = wrap.querySelector('.input-error-msg');
        if (span) span.textContent = '';
    }

    function defaultMsg(rule, arg) {
        switch (rule) {
            case 'required': return 'This field is required';
            case 'email':    return 'Enter a valid email address';
            case 'min':      return 'Minimum ' + arg + ' characters required';
            case 'phone':    return 'Enter a valid phone number';
            case 'match':    return 'Fields do not match';
            default:         return 'Invalid value';
        }
    }

    function validate(wrap) {
        var raw = wrap.dataset.validate;
        if (!raw) return true;
        var rules = raw.split('|');
        var val = getVal(wrap);
        for (var i = 0; i < rules.length; i++) {
            var parts    = rules[i].split(':');
            var ruleName = parts[0];
            var ruleArg  = parts[1];
            var fn = RULES[ruleName];
            if (!fn) continue;
            if (!fn(val, ruleArg)) {
                var msg = wrap.getAttribute('data-error-' + ruleName) || defaultMsg(ruleName, ruleArg);
                showError(wrap, msg);
                return false;
            }
        }
        clearError(wrap);
        return true;
    }

    // Mark as touched on focusout, validate immediately
    document.addEventListener('focusout', function(e) {
        var input = e.target.closest('[data-validate] .input-field');
        if (!input) return;
        var wrap = input.closest('[data-validate]');
        wrap._touched = true;
        validate(wrap);
    });

    // Re-validate on input after a field has been touched
    document.addEventListener('input', function(e) {
        var input = e.target.closest('[data-validate] .input-field');
        if (!input) return;
        var wrap = input.closest('[data-validate]');
        if (wrap._touched) validate(wrap);
    });

    // Validate all on submit
    document.addEventListener('submit', function(e) {
        var wraps = e.target.querySelectorAll('[data-validate]');
        var valid = true;
        wraps.forEach(function(wrap) {
            wrap._touched = true;
            if (!validate(wrap)) valid = false;
        });
        if (!valid) e.preventDefault();
    });
})();
