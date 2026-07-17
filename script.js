(function() {
  'use strict';

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('theme-toggle');
  let darkTheme = false;
  themeToggle.addEventListener('click', () => {
    darkTheme = !darkTheme;
    document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light');
    themeToggle.textContent = darkTheme ? '☀️' : '🌙';
  });

  // ===== Tab Navigation =====
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function activateTab(tab) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    const panelId = tab.getAttribute('aria-controls');
    panels.forEach(p => {
      p.hidden = p.id !== panelId;
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const currentIndex = Array.from(tabs).indexOf(tab);
      let newIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }
      e.preventDefault();
      const newTab = tabs[newIndex];
      newTab.focus();
      activateTab(newTab);
    });
  });

  // ===== Standard Calculator =====
  const standardDisplay = document.getElementById('display-standard');
  let currentInput = '0';
  let previousInput = '';
  let operator = null;
  let resetNext = false;

  function updateStandardDisplay() {
    standardDisplay.textContent = currentInput;
  }

  function inputDigit(digit) {
    if (resetNext) {
      currentInput = digit;
      resetNext = false;
    } else {
      if (currentInput === '0' && digit !== '.') {
        currentInput = digit;
      } else {
        currentInput += digit;
      }
    }
    updateStandardDisplay();
  }

  function inputDecimal() {
    if (resetNext) {
      currentInput = '0.';
      resetNext = false;
      updateStandardDisplay();
      return;
    }
    if (!currentInput.includes('.')) {
      currentInput += '.';
    }
    updateStandardDisplay();
  }

  function handleOperator(op) {
    if (operator && !resetNext) {
      calculate();
    }
    previousInput = currentInput;
    operator = op;
    resetNext = true;
  }

  function calculate() {
    if (!operator) return;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;
    switch (operator) {
      case 'add': result = prev + curr; break;
      case 'subtract': result = prev - curr; break;
      case 'multiply': result = prev * curr; break;
      case 'divide': result = curr !== 0 ? prev / curr : 'Error'; break;
      default: return;
    }
    currentInput = String(result);
    operator = null;
    previousInput = '';
    resetNext = true;
    updateStandardDisplay();
  }

  function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetNext = false;
    updateStandardDisplay();
  }

  function backspace() {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateStandardDisplay();
  }

  function toggleSign() {
    if (currentInput !== '0') {
      currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
      updateStandardDisplay();
    }
  }

  function percent() {
    const num = parseFloat(currentInput);
    currentInput = String(num / 100);
    updateStandardDisplay();
  }

  // Standard calculator event delegation
  document.querySelector('#panel-standard .buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (value !== undefined) {
      if (value === '.') inputDecimal();
      else inputDigit(value);
    } else if (action) {
      switch (action) {
        case 'clear': clearAll(); break;
        case 'backspace': backspace(); break;
        case 'percent': percent(); break;
        case 'sign': toggleSign(); break;
        case 'equals': calculate(); break;
        case 'add': case 'subtract': case 'multiply': case 'divide': handleOperator(action); break;
      }
    }
  });

  // ===== Scientific Calculator =====
  const scientificDisplay = document.getElementById('display-scientific');
  let sciInput = '0';
  let sciReset = false;

  function updateSciDisplay() {
    scientificDisplay.textContent = sciInput;
  }

  function sciDigit(d) {
    if (sciReset) {
      sciInput = d;
      sciReset = false;
    } else {
      if (sciInput === '0' && d !== '.') sciInput = d;
      else sciInput += d;
    }
    updateSciDisplay();
  }

  function sciDecimal() {
    if (sciReset) { sciInput = '0.'; sciReset = false; updateSciDisplay(); return; }
    if (!sciInput.includes('.')) sciInput += '.';
    updateSciDisplay();
  }

  function sciClear() { sciInput = '0'; sciReset = false; updateSciDisplay(); }
  function sciBackspace() {
    if (sciInput.length > 1) sciInput = sciInput.slice(0, -1);
    else sciInput = '0';
    updateSciDisplay();
  }
  function sciSign() {
    if (sciInput !== '0') {
      sciInput = sciInput.startsWith('-') ? sciInput.slice(1) : '-' + sciInput;
      updateSciDisplay();
    }
  }

  function sciUnaryOp(fn) {
    const num = parseFloat(sciInput);
    if (isNaN(num)) return;
    let result;
    try {
      result = fn(num);
    } catch (e) {
      result = 'Error';
    }
    sciInput = String(result);
    sciReset = true;
    updateSciDisplay();
  }

  function sciBinaryOp(op) {
    // For simplicity, we treat x^y as a binary operation that uses the current input as base and then prompts for exponent.
    // We'll store base and then wait for next input.
    if (sciBinaryOp.pending) {
      // Already waiting for exponent, compute
      const base = sciBinaryOp.base;
      const exp = parseFloat(sciInput);
      if (isNaN(base) || isNaN(exp)) return;
      let result;
      if (op === 'pow') result = Math.pow(base, exp);
      else result = 'Error';
      sciInput = String(result);
      sciBinaryOp.pending = false;
      sciReset = true;
      updateSciDisplay();
    } else {
      sciBinaryOp.base = parseFloat(sciInput);
      sciBinaryOp.pending = true;
      sciReset = true;
      // Display nothing special, just wait for next number
    }
  }
  sciBinaryOp.pending = false;
  sciBinaryOp.base = 0;

  document.querySelector('#panel-scientific .buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (value !== undefined) {
      if (value === '.') sciDecimal();
      else sciDigit(value);
    } else if (action) {
      switch (action) {
        case 'clear': sciClear(); break;
        case 'backspace': sciBackspace(); break;
        case 'sign': sciSign(); break;
        case 'sin': sciUnaryOp(Math.sin); break;
        case 'cos': sciUnaryOp(Math.cos); break;
        case 'tan': sciUnaryOp(Math.tan); break;
        case 'log': sciUnaryOp(Math.log10); break;
        case 'ln': sciUnaryOp(Math.log); break;
        case 'sqrt': sciUnaryOp(Math.sqrt); break;
        case 'pi': sciInput = String(Math.PI); sciReset = true; updateSciDisplay(); break;
        case 'e': sciInput = String(Math.E); sciReset = true; updateSciDisplay(); break;
        case 'factorial': sciUnaryOp(n => { if (n < 0 || !Number.isInteger(n)) return 'Error'; let r=1; for(let i=2;i<=n;i++) r*=i; return r; }); break;
        case 'pow': sciBinaryOp('pow'); break;
        case 'add': case 'subtract': case 'multiply': case 'divide':
          // For simplicity, we reuse standard calculator logic? No, we'll just do basic binary ops using same pattern as pow but with different ops.
          // Actually we can implement a simple binary operation handler.
          if (sciBinaryOp.pending) {
            // Compute previous pending
            const base = sciBinaryOp.base;
            const curr = parseFloat(sciInput);
            if (isNaN(base) || isNaN(curr)) return;
            let result;
            switch (sciBinaryOp.op) {
              case 'add': result = base + curr; break;
              case 'subtract': result = base - curr; break;
              case 'multiply': result = base * curr; break;
              case 'divide': result = curr !== 0 ? base / curr : 'Error'; break;
              default: result = 'Error';
            }
            sciInput = String(result);
            sciBinaryOp.pending = false;
            sciReset = true;
            updateSciDisplay();
          }
          // Now set new pending
          sciBinaryOp.base = parseFloat(sciInput);
          sciBinaryOp.op = action;
          sciBinaryOp.pending = true;
          sciReset = true;
          break;
        case 'equals':
          if (sciBinaryOp.pending) {
            const base = sciBinaryOp.base;
            const curr = parseFloat(sciInput);
            if (isNaN(base) || isNaN(curr)) return;
            let result;
            switch (sciBinaryOp.op) {
              case 'add': result = base + curr; break;
              case 'subtract': result = base - curr; break;
              case 'multiply': result = base * curr; break;
              case 'divide': result = curr !== 0 ? base / curr : 'Error'; break;
              case 'pow': result = Math.pow(base, curr); break;
              default: result = 'Error';
            }
            sciInput = String(result);
            sciBinaryOp.pending = false;
            sciReset = true;
            updateSciDisplay();
          }
          break;
      }
    }
  });

  // ===== Unit Converter =====
  const unitCategory = document.getElementById('unit-category');
  const unitFrom = document.getElementById('unit-from');
  const unitTo = document.getElementById('unit-to');
  const unitValue = document.getElementById('unit-value');
  const unitConvert = document.getElementById('unit-convert');
  const unitResult = document.getElementById('unit-result');

  const unitData = {
    length: {
      units: ['meters', 'kilometers', 'miles', 'feet', 'inches', 'centimeters'],
      toBase: { meters: 1, kilometers: 1000, miles: 1609.344, feet: 0.3048, inches: 0.0254, centimeters: 0.01 },
      fromBase: { meters: 1, kilometers: 0.001, miles: 0.000621371, feet: 3.28084, inches: 39.3701, centimeters: 100 }
    },
    temperature: {
      units: ['Celsius', 'Fahrenheit', 'Kelvin'],
      toBase: { Celsius: v => v, Fahrenheit: v => (v - 32) * 5/9, Kelvin: v => v - 273.15 },
      fromBase: { Celsius: v => v, Fahrenheit: v => v * 9/5 + 32, Kelvin: v => v + 273.15 }
    },
    weight: {
      units: ['grams', 'kilograms', 'pounds', 'ounces'],
      toBase: { grams: 1, kilograms: 1000, pounds: 453.592, ounces: 28.3495 },
      fromBase: { grams: 1, kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274 }
    },
    volume: {
      units: ['liters', 'milliliters', 'gallons', 'quarts', 'cups'],
      toBase: { liters: 1, milliliters: 0.001, gallons: 3.78541, quarts: 0.946353, cups: 0.236588 },
      fromBase: { liters: 1, milliliters: 1000, gallons: 0.264172, quarts: 1.05669, cups: 4.22675 }
    }
  };

  function populateUnitSelects() {
    const cat = unitCategory.value;
    const data = unitData[cat];
    unitFrom.innerHTML = '';
    unitTo.innerHTML = '';
    data.units.forEach(u => {
      const opt1 = document.createElement('option');
      opt1.value = u;
      opt1.textContent = u;
      unitFrom.appendChild(opt1);
      const opt2 = document.createElement('option');
      opt2.value = u;
      opt2.textContent = u;
      unitTo.appendChild(opt2);
    });
    // Set default selections
    unitFrom.value = data.units[0];
    unitTo.value = data.units[1] || data.units[0];
  }

  unitCategory.addEventListener('change', populateUnitSelects);
  populateUnitSelects();

  unitConvert.addEventListener('click', () => {
    const cat = unitCategory.value;
    const data = unitData[cat];
    const from = unitFrom.value;
    const to = unitTo.value;
    const value = parseFloat(unitValue.value);
    if (isNaN(value)) {
      unitResult.textContent = 'Please enter a valid number.';
      return;
    }
    let result;
    if (cat === 'temperature') {
      const celsius = data.toBase[from](value);
      result = data.fromBase[to](celsius);
    } else {
      const base = value * data.toBase[from];
      result = base * data.fromBase[to];
    }
    unitResult.textContent = `${value} ${from} = ${result.toFixed(6)} ${to}`;
  });

  // ===== Base Converter =====
  const baseInput = document.getElementById('base-input');
  const baseFrom = document.getElementById('base-from');
  const baseTo = document.getElementById('base-to');
  const baseConvert = document.getElementById('base-convert');
  const baseResult = document.getElementById('base-result');

  baseConvert.addEventListener('click', () => {
    const fromRadix = parseInt(baseFrom.value);
    const toRadix = parseInt(baseTo.value);
    const input = baseInput.value.trim();
    if (!input) {
      baseResult.textContent = 'Please enter a number.';
      return;
    }
    let decimal;
    try {
      decimal = parseInt(input, fromRadix);
      if (isNaN(decimal)) throw new Error();
    } catch (e) {
      baseResult.textContent = 'Invalid input for the selected base.';
      return;
    }
    const result = decimal.toString(toRadix).toUpperCase();
    baseResult.textContent = `${input} (base ${fromRadix}) = ${result} (base ${toRadix})`;
  });

  // ===== Currency Converter =====
  const currencyAmount = document.getElementById('currency-amount');
  const currencyFrom = document.getElementById('currency-from');
  const currencyTo = document.getElementById('currency-to');
  const currencyConvert = document.getElementById('currency-convert');
  const currencyResult = document.getElementById('currency-result');

  const rates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110.0,
    CNY: 6.45
  };

  currencyConvert.addEventListener('click', () => {
    const amount = parseFloat(currencyAmount.value);
    if (isNaN(amount)) {
      currencyResult.textContent = 'Please enter a valid amount.';
      return;
    }
    const from = currencyFrom.value;
    const to = currencyTo.value;
    const usdAmount = amount / rates[from];
    const result = usdAmount * rates[to];
    currencyResult.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
  });

  // ===== Date Calculator =====
  const dateStart = document.getElementById('date-start');
  const dateEnd = document.getElementById('date-end');
  const dateCalculate = document.getElementById('date-calculate');
  const dateResult = document.getElementById('date-result');

  dateCalculate.addEventListener('click', () => {
    const start = new Date(dateStart.value);
    const end = new Date(dateEnd.value);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      dateResult.textContent = 'Please select both dates.';
      return;
    }
    const diffMs = Math.abs(end - start);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    dateResult.textContent = `Difference: ${days} days, ${hours} hours, ${minutes} minutes`;
  });

  // Set default dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateStart.value = `${yyyy}-${mm}-${dd}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy2 = tomorrow.getFullYear();
  const mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd2 = String(tomorrow.getDate()).padStart(2, '0');
  dateEnd.value = `${yyyy2}-${mm2}-${dd2}`;
})();