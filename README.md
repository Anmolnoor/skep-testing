# Advanced Calculator

A complete, browser-based advanced calculator built with vanilla HTML5, CSS3, and JavaScript. No frameworks, no build step, and no external dependencies except the optional Inter web font loaded from Google Fonts.

## Features

- **Standard & Scientific Calculator**
  - Basic arithmetic: add, subtract, multiply, divide, percentage, sign toggle, decimals, backspace, clear
  - Scientific functions: sin, cos, tan (radians), log, ln, sqrt, square, power, factorial, abs, π, e
  - Memory functions: MC, MR, M+, M-
  - Calculation history panel (last 20 results), clickable to reuse
  - Full keyboard support for numbers, operators, Enter, Escape, Backspace
  - Safe expression evaluation without using `eval()`

- **Unit Converter**
  - Length, mass/weight, temperature (with correct non-linear formulas), area, volume, speed, time, digital storage
  - Digital storage uses binary prefixes: 1 KB = 1024 B

- **Number Base Converter**
  - Binary, octal, decimal, hexadecimal, plus a custom base from 2 to 36
  - Real-time updates across all fields
  - Invalid input is highlighted with a friendly message

- **Currency Converter**
  - Hardcoded approximate rates for USD, EUR, GBP, JPY, INR, CAD, AUD, CHF, CNY
  - Clearly marked as manual/educational rates
  - Editable exchange rate field for custom rates

- **Date / Time Calculator**
  - Difference between two date+time values in days, hours, minutes, seconds
  - Add or subtract a duration (days, hours, minutes) from a start date+time

- **Accessibility & UX**
  - Responsive layout for desktop and mobile
  - Dark / light theme with CSS variables and system-preference detection
  - Focus states, labels, ARIA live regions, and clear button states

## How to open in a browser

1. Clone or download this repository.
2. Open the `index.html` file directly in any modern web browser:
   - **Windows:** double-click `index.html`, or right-click and choose *Open with* → your browser.
   - **macOS:** double-click `index.html`, or right-click and choose *Open With* → Safari / Chrome / Firefox.
   - **Linux:** run `xdg-open index.html` from the terminal.
3. Alternatively, start a simple local server for the best experience:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

No installation, build tools, or package managers are required.

## File overview

- `index.html` — single-page app structure
- `style.css` — responsive theme and layout
- `script.js` — all calculator logic
- `README.md` — this file

## Notes

- Currency exchange rates are approximate and intended for demonstration. For real conversions, update the rates manually in the currency converter.
- Scientific trigonometric functions operate in radians.
- The calculator parser intentionally avoids `eval()` and supports standard operator precedence.
