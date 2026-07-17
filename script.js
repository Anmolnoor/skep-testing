/* Advanced Calculator — vanilla JS, no eval */
(function () {
  'use strict';

  const MAX_HISTORY = 20;

  /* ---------- Helpers ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function showError(elementId, message) {
    const el = $(elementId);
    if (!el) return;
    el.textContent = message || '';
    if (message) {
      el.setAttribute('aria-invalid', 'true');
    } else {
      el.setAttribute('aria-invalid', 'false');
    }
  }

  function clearGlobalError() {
    const el = $('#global-error');
    if (el) el.textContent = '';
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return 'Error';
    if (Math.abs(value) < 1e-12 && value !== 0) return value.toExponential(6);
    const str = parseFloat(value.toPrecision(12)).toString();
    return str;
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem('calc-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    $('#theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('calc-theme', next);
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        $$('.panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        $(`#${tab.dataset.tab}`).classList.add('active');
        clearGlobalError();
      });
    });
  }

  /* ---------- Safe Math Parser ---------- */
  const tokenize = (input) => {
    const tokens = [];
    let i = 0;
    const str = input.trim();
    while (i < str.length) {
      const c = str[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (/\d/.test(c) || (c === '.' && /\d/.test(str[i + 1]))) {
        let num = '';
        while (i < str.length && (/\d/.test(str[i]) || str[i] === '.')) {
          num += str[i++];
        }
        tokens.push({ type: 'number', value: parseFloat(num) });
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        let name = '';
        while (i < str.length && /[a-zA-Z]/.test(str[i])) {
          name += str[i++];
        }
        tokens.push({ type: 'func', value: name.toLowerCase() });
        continue;
      }
      if (c === 'π') { tokens.push({ type: 'number', value: Math.PI }); i++; continue; }
      if (c === '(' || c === ')') {
        tokens.push({ type: 'paren', value: c });
        i++;
        continue;
      }
      const ops = '+-*/%^';
      if (ops.includes(c)) {
        tokens.push({ type: 'op', value: c });
        i++;
        continue;
      }
      throw new Error(`Unexpected character: ${c}`);
    }
    return tokens;
  };

  function toRPN(tokens) {
    const output = [];
    const stack = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
    const rightAssoc = { '^': true };

    for (const token of tokens) {
      if (token.type === 'number') {
        output.push(token);
      } else if (token.type === 'func') {
        stack.push(token);
      } else if (token.type === 'op') {
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.type === 'op') {
            const pTop = precedence[top.value];
            const pCur = precedence[token.value];
            if (pTop > pCur || (pTop === pCur && !rightAssoc[token.value])) {
              output.push(stack.pop());
              continue;
            }
          }
          break;
        }
        stack.push(token);
      } else if (token.value === '(') {
        stack.push(token);
      } else if (token.value === ')') {
        while (stack.length && stack[stack.length - 1].value !== '(') {
          output.push(stack.pop());
        }
        if (!stack.length) throw new Error('Mismatched parentheses');
        stack.pop(); // remove (
        if (stack.length && stack[stack.length - 1].type === 'func') {
          output.push(stack.pop());
        }
      }
    }
    while (stack.length) {
      const top = stack.pop();
      if (top.value === '(' || top.value === ')') throw new Error('Mismatched parentheses');
      output.push(top);
    }
    return output;
  }

  function applyFunc(name, x) {
    switch (name) {
      case 'sin': return Math.sin(x);
      case 'cos': return Math.cos(x);
      case 'tan': return Math.tan(x);
      case 'log': return Math.log10(x);
      case 'ln': return Math.log(x);
      case 'sqrt': return Math.sqrt(x);
      case 'square': return x * x;
      case 'abs': return Math.abs(x);
      case 'factorial': return factorial(x);
      default: throw new Error(`Unknown function: ${name}`);
    }
  }

  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires a non-negative integer');
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function evaluateRPN(rpn) {
    const stack = [];
    for (const token of rpn) {
      if (token.type === 'number') {
        stack.push(token.value);
      } else if (token.type === 'func') {
        if (!stack.length) throw new Error(`Missing argument for ${token.value}`);
        const arg = stack.pop();
        stack.push(applyFunc(token.value, arg));
      } else if (token.type === 'op') {
        if (stack.length < 2) throw new Error(`Missing operands for ${token.value}`);
        const b = stack.pop();
        const a = stack.pop();
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/':
            if (b === 0) throw new Error('Cannot divide by zero');
            stack.push(a / b);
            break;
          case '%': stack.push(a % b); break;
          case '^': stack.push(Math.pow(a, b)); break;
          default: throw new Error(`Unknown operator: ${token.value}`);
        }
      }
    }
    if (stack.length !== 1) throw new Error('Invalid expression');
    const result = stack[0];
    if (!Number.isFinite(result)) throw new Error('Result is not finite');
    return result;
  }

  function safeEvaluate(expr) {
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    return evaluateRPN(rpn);
  }

  /* ---------- Calculator ---------- */
  function initCalculator() {
    let expression = '';
    let result = 0;
    let memory = 0;
    let justEvaluated = false;
    const history = [];

    const exprEl = $('#calc-expression');
    const resEl = $('#calc-result');
    const memEl = $('#memory-indicator');
    const historyList = $('#history-list');

    function updateDisplay() {
      exprEl.value = expression;
      resEl.value = formatNumber(result);
      memEl.textContent = `M: ${formatNumber(memory)}`;
    }

    function addHistory(expr, res) {
      if (!expr) return;
      history.unshift({ expr, res });
      if (history.length > MAX_HISTORY) history.pop();
      renderHistory();
    }

    function renderHistory() {
      historyList.innerHTML = '';
      if (!history.length) {
        const empty = document.createElement('li');
        empty.className = 'history-item';
        empty.textContent = 'No history yet';
        empty.style.cursor = 'default';
        historyList.appendChild(empty);
        return;
      }
      for (const item of history) {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.innerHTML = `<div class="history-expr">${escapeHtml(item.expr)}</div><div class="history-res">= ${escapeHtml(formatNumber(item.res))}</div>`;
        li.addEventListener('click', () => {
          expression = formatNumber(item.res);
          justEvaluated = true;
          result = item.res;
          updateDisplay();
        });
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            li.click();
          }
        });
        historyList.appendChild(li);
      }
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function handleDigit(val) {
      if (justEvaluated) {
        expression = '';
        justEvaluated = false;
      }
      expression += val;
      updateDisplay();
    }

    function handleDecimal() {
      if (justEvaluated) {
        expression = '';
        justEvaluated = false;
      }
      const parts = expression.split(/[+\-*/%^()]/);
      const current = parts[parts.length - 1];
      if (!current.includes('.')) {
        if (current === '' || /[a-zA-Zπ]$/.test(expression)) expression += '0';
        expression += '.';
      }
      updateDisplay();
    }

    function handleOperator(op) {
      if (justEvaluated) {
        expression = formatNumber(result);
        justEvaluated = false;
      }
      if (!expression) {
        if (op === '-') {
          expression += op;
          updateDisplay();
        }
        return;
      }
      const last = expression.slice(-1);
      if ('+-*/%^'.includes(last)) {
        expression = expression.slice(0, -1) + op;
      } else {
        expression += op;
      }
      updateDisplay();
    }

    function handleFunc(func) {
      if (justEvaluated) {
        expression = formatNumber(result);
        justEvaluated = false;
      }
      if (func === 'power') {
        handleOperator('^');
        return;
      }
      if (func === 'square') {
        if (justEvaluated) expression = formatNumber(result);
        expression += '^2';
        justEvaluated = false;
        updateDisplay();
        return;
      }
      expression += `${func}(`;
      updateDisplay();
    }

    function handleConst(name) {
      if (justEvaluated) {
        expression = '';
        justEvaluated = false;
      }
      if (name === 'pi') expression += 'π';
      else if (name === 'e') expression += Math.E;
      updateDisplay();
    }

    function handlePercent() {
      try {
        if (!expression) return;
        const value = safeEvaluate(expression);
        result = value / 100;
        expression = formatNumber(result);
        justEvaluated = true;
        updateDisplay();
      } catch (e) {
        result = NaN;
        resEl.value = 'Error';
      }
    }

    function handleSign() {
      try {
        if (!expression) {
          result = -result;
          expression = formatNumber(result);
        } else {
          const value = safeEvaluate(expression);
          result = -value;
          expression = formatNumber(result);
        }
        justEvaluated = true;
        updateDisplay();
      } catch (e) {
        result = NaN;
        resEl.value = 'Error';
      }
    }

    function handleEquals() {
      if (!expression) return;
      try {
        result = safeEvaluate(expression);
        addHistory(expression, result);
        expression = '';
        justEvaluated = true;
        updateDisplay();
      } catch (e) {
        result = NaN;
        resEl.value = 'Error: ' + e.message;
      }
    }

    function handleBackspace() {
      if (justEvaluated) {
        expression = '';
        result = 0;
        justEvaluated = false;
      } else if (expression.length) {
        expression = expression.slice(0, -1);
      }
      updateDisplay();
    }

    function handleClear() {
      expression = '';
      result = 0;
      justEvaluated = false;
      updateDisplay();
    }

    function handleMemory(cmd) {
      switch (cmd) {
        case 'MC':
          memory = 0;
          break;
        case 'MR':
          if (justEvaluated) expression = '';
          expression += formatNumber(memory);
          justEvaluated = false;
          break;
        case 'M+':
          try {
            memory += expression ? safeEvaluate(expression) : result;
          } catch (e) {
            resEl.value = 'Error';
            return;
          }
          break;
        case 'M-':
          try {
            memory -= expression ? safeEvaluate(expression) : result;
          } catch (e) {
            resEl.value = 'Error';
            return;
          }
          break;
      }
      updateDisplay();
    }

    function handleAction(action, dataset) {
      switch (action) {
        case 'digit': handleDigit(dataset.val); break;
        case 'decimal': handleDecimal(); break;
        case 'operator': handleOperator(dataset.op); break;
        case 'func': handleFunc(dataset.func); break;
        case 'const': handleConst(dataset.const); break;
        case 'percent': handlePercent(); break;
        case 'sign': handleSign(); break;
        case 'equals': handleEquals(); break;
        case 'backspace': handleBackspace(); break;
        case 'clear': handleClear(); break;
        case 'memory': handleMemory(dataset.mem); break;
      }
    }

    $$('#calculator .btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => handleAction(btn.dataset.action, btn.dataset));
    });

    $('#clear-history').addEventListener('click', () => {
      history.length = 0;
      renderHistory();
    });

    document.addEventListener('keydown', (e) => {
      if (!isCalculatorFocused()) return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) { e.preventDefault(); handleDigit(key); }
      else if (key === '.') { e.preventDefault(); handleDecimal(); }
      else if (key === '+') { e.preventDefault(); handleOperator('+'); }
      else if (key === '-') { e.preventDefault(); handleOperator('-'); }
      else if (key === '*') { e.preventDefault(); handleOperator('*'); }
      else if (key === '/') { e.preventDefault(); handleOperator('/'); }
      else if (key === '^') { e.preventDefault(); handleOperator('^'); }
      else if (key === '%') { e.preventDefault(); handlePercent(); }
      else if (key === 'Enter' || key === '=') { e.preventDefault(); handleEquals(); }
      else if (key === 'Backspace') { e.preventDefault(); handleBackspace(); }
      else if (key === 'Escape') { e.preventDefault(); handleClear(); }
      else if (key === '(') { e.preventDefault(); expression += '('; updateDisplay(); }
      else if (key === ')') { e.preventDefault(); expression += ')'; updateDisplay(); }
    });

    function isCalculatorFocused() {
      const panel = $('#calculator');
      return panel && panel.classList.contains('active');
    }

    updateDisplay();
    renderHistory();
  }

  /* ---------- Unit Converter ---------- */
  const UNITS = {
    length: {
      m: 1,
      mm: 0.001,
      cm: 0.01,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    },
    mass: {
      g: 1,
      mg: 0.001,
      kg: 1000,
      oz: 28.3495,
      lb: 453.592,
      ton: 907184.74,
    },
    area: {
      'sq m': 1,
      'sq km': 1e6,
      'sq ft': 0.092903,
      acre: 4046.86,
      hectare: 10000,
    },
    volume: {
      l: 1,
      ml: 0.001,
      gallon: 3.78541,
      cup: 0.24,
      'fl oz': 0.0295735,
    },
    speed: {
      'm/s': 1,
      'km/h': 0.277778,
      mph: 0.44704,
      knots: 0.514444,
    },
    time: {
      ms: 0.001,
      s: 1,
      min: 60,
      h: 3600,
      days: 86400,
      weeks: 604800,
      years: 31536000,
    },
    digital: {
      b: 1 / 8,
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
      PB: 1024 * 1024 * 1024 * 1024 * 1024,
    },
  };

  function convertTemperature(value, from, to) {
    let celsius;
    switch (from) {
      case 'C': celsius = value; break;
      case 'F': celsius = (value - 32) * 5 / 9; break;
      case 'K': celsius = value - 273.15; break;
      default: throw new Error('Unknown temperature unit');
    }
    switch (to) {
      case 'C': return celsius;
      case 'F': return celsius * 9 / 5 + 32;
      case 'K': return celsius + 273.15;
      default: throw new Error('Unknown temperature unit');
    }
  }

  function initUnitConverter() {
    const categoryEl = $('#unit-category');
    const fromEl = $('#unit-from');
    const toEl = $('#unit-to');
    const inputEl = $('#unit-input');
    const outputEl = $('#unit-output');
    const swapBtn = $('#unit-swap');
    const hintEl = $('#unit-hint');

    function populateSelects(category) {
      const units = category === 'temperature'
        ? { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' }
        : Object.keys(UNITS[category]).reduce((obj, key) => { obj[key] = key; return obj; }, {});
      const opts = Object.entries(units).map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
      fromEl.innerHTML = opts;
      toEl.innerHTML = opts;
      if (category === 'digital') {
        hintEl.textContent = 'Digital storage uses binary prefixes: 1 KB = 1024 B.';
      } else if (category === 'temperature') {
        hintEl.textContent = 'Temperature conversions are handled with proper non-linear formulas.';
      } else {
        hintEl.textContent = '';
      }
      if (toEl.options.length > 1) toEl.selectedIndex = 1;
    }

    function convert() {
      showError('#unit-error', '');
      const value = parseFloat(inputEl.value);
      if (Number.isNaN(value)) {
        outputEl.value = '';
        return;
      }
      const category = categoryEl.value;
      const from = fromEl.value;
      const to = toEl.value;
      let result;
      try {
        if (category === 'temperature') {
          result = convertTemperature(value, from, to);
        } else {
          const rates = UNITS[category];
          const base = value * rates[from];
          result = base / rates[to];
        }
        if (!Number.isFinite(result)) throw new Error('Result is not finite');
        outputEl.value = formatNumber(result) + ' ' + to;
      } catch (e) {
        showError('#unit-error', e.message);
        outputEl.value = '';
      }
    }

    categoryEl.addEventListener('change', () => {
      populateSelects(categoryEl.value);
      convert();
    });
    fromEl.addEventListener('change', convert);
    toEl.addEventListener('change', convert);
    inputEl.addEventListener('input', convert);
    swapBtn.addEventListener('click', () => {
      const temp = fromEl.selectedIndex;
      fromEl.selectedIndex = toEl.selectedIndex;
      toEl.selectedIndex = temp;
      convert();
    });

    populateSelects(categoryEl.value);
  }

  /* ---------- Base Converter ---------- */
  function initBaseConverter() {
    const fields = {
      bin: { base: 2, regex: /^[01]+$/ },
      oct: { base: 8, regex: /^[0-7]+$/ },
      dec: { base: 10, regex: /^-?\d+$/ },
      hex: { base: 16, regex: /^-?[0-9a-fA-F]+$/ },
      custom: { baseField: 'custom-radix' },
    };

    function getRadix() {
      const radix = parseInt($('#base-custom-radix').value, 10);
      return Number.isNaN(radix) || radix < 2 || radix > 36 ? null : radix;
    }

    function getRegexForRadix(radix) {
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, radix);
      return new RegExp(`^-?[${validChars}]+$`, 'i');
    }

    function parseValue(type, value) {
      if (type === 'custom') {
        const radix = getRadix();
        if (radix === null) throw new Error('Custom base must be 2–36');
        if (!getRegexForRadix(radix).test(value)) throw new Error(`Invalid digit for base ${radix}`);
        return parseInt(value, radix);
      }
      const cfg = fields[type];
      if (value.startsWith('-')) throw new Error('Negative values not supported');
      if (!cfg.regex.test(value)) throw new Error(`Invalid ${type} number`);
      return parseInt(value, cfg.base);
    }

    function formatValue(dec, type) {
      if (type === 'custom') {
        const radix = getRadix();
        if (radix === null) throw new Error('Custom base must be 2–36');
        return dec.toString(radix).toUpperCase();
      }
      return dec.toString(fields[type].base).toUpperCase();
    }

    function updateFrom(source) {
      const input = $(`#base-${source}`).value.trim();
      // Clear all errors
      Object.keys(fields).forEach(k => showError(`#base-${k}-error`, ''));
      $(`#base-${source}`).setAttribute('aria-invalid', 'false');

      if (!input) {
        Object.keys(fields).forEach(k => { if (k !== source) $(`#base-${k}`).value = ''; });
        return;
      }

      let dec;
      try {
        dec = parseValue(source, input);
      } catch (e) {
        showError(`#base-${source}-error`, e.message);
        $(`#base-${source}`).setAttribute('aria-invalid', 'true');
        return;
      }
      if (!Number.isFinite(dec) || dec < 0) {
        showError(`#base-${source}-error`, 'Value out of supported range');
        return;
      }
      if (dec > Number.MAX_SAFE_INTEGER) {
        showError(`#base-${source}-error`, 'Value exceeds safe integer range');
        return;
      }

      Object.keys(fields).forEach(k => {
        if (k === source) return;
        try {
          $(`#base-${k}`).value = formatValue(dec, k);
        } catch (e) {
          showError(`#base-${k}-error`, e.message);
        }
      });
    }

    Object.keys(fields).forEach(key => {
      $(`#base-${key}`).addEventListener('input', () => updateFrom(key));
    });
    $('#base-custom-radix').addEventListener('input', () => updateFrom('custom'));

    $('#base-bin').value = '0';
    updateFrom('bin');
  }

  /* ---------- Currency Converter ---------- */
  const CURRENCY_RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    INR: 83.1,
    CAD: 1.35,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.19,
  };

  function initCurrencyConverter() {
    const amountEl = $('#currency-amount');
    const fromEl = $('#currency-from');
    const toEl = $('#currency-to');
    const outputEl = $('#currency-output');
    const rateEl = $('#currency-rate');
    const rateToEl = $('#rate-to');
    const swapBtn = $('#currency-swap');
    const resetBtn = $('#rate-reset');
    const currencies = Object.keys(CURRENCY_RATES).sort();

    function buildOptions() {
      const opts = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
      fromEl.innerHTML = opts;
      toEl.innerHTML = opts;
      fromEl.value = 'USD';
      toEl.value = 'EUR';
    }

    function defaultRate(from, to) {
      return CURRENCY_RATES[to] / CURRENCY_RATES[from];
    }

    function convert() {
      showError('#currency-error', '');
      const amount = parseFloat(amountEl.value);
      const from = fromEl.value;
      const to = toEl.value;
      let rate = parseFloat(rateEl.value);
      if (Number.isNaN(rate) || rate <= 0) {
        rate = defaultRate(from, to);
        rateEl.value = rate.toFixed(5);
      }
      rateToEl.textContent = to;
      if (Number.isNaN(amount)) {
        outputEl.value = '';
        return;
      }
      const result = amount * rate;
      outputEl.value = `${formatNumber(result)} ${to}`;
    }

    function resetRate() {
      rateEl.value = defaultRate(fromEl.value, toEl.value).toFixed(5);
      convert();
    }

    function onPairChanged() {
      resetRate();
    }

    buildOptions();
    resetRate();

    amountEl.addEventListener('input', convert);
    fromEl.addEventListener('change', onPairChanged);
    toEl.addEventListener('change', onPairChanged);
    rateEl.addEventListener('input', convert);
    swapBtn.addEventListener('click', () => {
      const temp = fromEl.value;
      fromEl.value = toEl.value;
      toEl.value = temp;
      onPairChanged();
    });
    resetBtn.addEventListener('click', resetRate);
  }

  /* ---------- Date/Time Calculator ---------- */
  function initDateCalculator() {
    const startEl = $('#date-start');
    const endEl = $('#date-end');
    const diffBtn = $('#date-diff-btn');
    const diffOutput = $('#date-diff-output');
    const baseEl = $('#date-base');
    const daysEl = $('#date-duration-days');
    const hoursEl = $('#date-duration-hours');
    const minutesEl = $('#date-duration-minutes');
    const addBtn = $('#date-add-btn');
    const subBtn = $('#date-sub-btn');
    const resultOutput = $('#date-result-output');

    function nowLocalInput() {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }

    startEl.value = nowLocalInput();
    endEl.value = nowLocalInput();
    baseEl.value = nowLocalInput();

    function getMs(el) {
      const val = el.value;
      if (!val) return null;
      const d = new Date(val);
      return Number.isNaN(d.getTime()) ? null : d.getTime();
    }

    function plural(n, word) {
      return `${n} ${word}${n === 1 ? '' : 's'}`;
    }

    function calculateDiff() {
      showError('#date-error', '');
      const start = getMs(startEl);
      const end = getMs(endEl);
      if (start === null || end === null) {
        showError('#date-error', 'Please select both start and end date/times.');
        diffOutput.textContent = '';
        return;
      }
      const diffMs = end - start;
      const totalSeconds = Math.abs(diffMs) / 1000;
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const sign = diffMs < 0 ? 'End is earlier than start. ' : '';
      diffOutput.textContent = `${sign}${plural(days, 'day')}, ${plural(hours, 'hour')}, ${plural(minutes, 'minute')}, ${plural(seconds, 'second')} (${formatNumber(totalSeconds)} seconds total)`;
    }

    function calculateOffset(isAdd) {
      showError('#date-error', '');
      const base = getMs(baseEl);
      if (base === null) {
        showError('#date-error', 'Please select a base date/time.');
        resultOutput.textContent = '';
        return;
      }
      const days = parseFloat(daysEl.value) || 0;
      const hours = parseFloat(hoursEl.value) || 0;
      const minutes = parseFloat(minutesEl.value) || 0;
      const offsetMs = (days * 86400 + hours * 3600 + minutes * 60) * 1000;
      const resultMs = base + (isAdd ? offsetMs : -offsetMs);
      const result = new Date(resultMs);
      if (Number.isNaN(result.getTime())) {
        showError('#date-error', 'Resulting date is invalid.');
        resultOutput.textContent = '';
        return;
      }
      resultOutput.textContent = result.toLocaleString();
    }

    diffBtn.addEventListener('click', calculateDiff);
    addBtn.addEventListener('click', () => calculateOffset(true));
    subBtn.addEventListener('click', () => calculateOffset(false));
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    initCalculator();
    initUnitConverter();
    initBaseConverter();
    initCurrencyConverter();
    initDateCalculator();
  });
})();
