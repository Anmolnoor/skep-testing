#!/usr/bin/env python3
"""Verify the HTML calculator project meets all requirements."""
import re
import sys
import os

errors = []

# --- index.html checks ---
if not os.path.exists('index.html'):
    errors.append('index.html does not exist')
    sys.exit(1)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Valid HTML structure
if '<!DOCTYPE html>' not in html.lower() and '<!doctype html>' not in html.lower():
    errors.append('Missing DOCTYPE declaration')
if '<html' not in html:
    errors.append('Missing <html> tag')
if '</html>' not in html:
    errors.append('Missing closing </html> tag')
if '<head>' not in html or '</head>' not in html:
    errors.append('Missing <head> section')
if '<body' not in html or '</body>' not in html:
    errors.append('Missing <body> section')

# 2. Tailwind CSS CDN
if 'cdn.tailwindcss.com' not in html:
    errors.append('Tailwind CSS CDN not found in index.html')

# 3. Required button elements
required_buttons = {
    '+': r'\+',
    '-': '−|-',
    '×': '×|\\*',
    '÷': '÷|/',
    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'log': 'log',
    'ln': 'ln',
    '√': '√',
    'x²': 'x²',
    'x^y': 'x\^y',
    'n!': 'n!',
    'π': 'π',
    'e': '>e<|data-action="e"',
    '%': '%',
    '±': '±',
    'AC': 'AC',
    'Del': 'Del',
    '=': '=',
}
for name, pattern in required_buttons.items():
    if not re.search(pattern, html):
        errors.append(f'Missing button element for: {name}')

# 4. Keyboard event listeners
if 'addEventListener' not in html or 'keydown' not in html:
    errors.append('Keyboard event listeners (keydown) not found in JS')
if 'Backspace' not in html:
    errors.append('Backspace keyboard handler not found')
if 'Escape' not in html:
    errors.append('Escape keyboard handler not found')
if 'Enter' not in html:
    errors.append('Enter keyboard handler not found')

# 5. Degree/radian toggle
if 'DEG' not in html or 'RAD' not in html:
    errors.append('DEG/RAD toggle not found')

# 6. Division by zero handling
if 'Error' not in html:
    errors.append('Error handling for division by zero not found')

# --- README.md checks ---
if not os.path.exists('README.md'):
    errors.append('README.md does not exist')
else:
    with open('README.md', 'r', encoding='utf-8') as f:
        readme = f.read()
    readme_lower = readme.lower()
    if 'html' not in readme_lower or 'calculator' not in readme_lower:
        errors.append('README does not mention HTML calculator')
    if 'tailwind' not in readme_lower:
        errors.append('README does not mention Tailwind CSS')
    if 'scientific' not in readme_lower:
        errors.append('README does not mention scientific functions')
    if 'how to run' not in readme_lower and 'open' not in readme_lower:
        errors.append('README does not mention how to run')

# --- Deleted files check ---
for deleted_file in ['calculator.py', 'hello.py', 'test_calculator.py', 'pyproject.toml']:
    if os.path.exists(deleted_file):
        errors.append(f'{deleted_file} should have been deleted but still exists')

# --- Report ---
if errors:
    print('VERIFICATION FAILED:')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print('VERIFICATION PASSED')
    print('  - index.html: valid HTML structure')
    print('  - Tailwind CSS CDN: present')
    print('  - All required buttons: present')
    print('  - Keyboard event listeners: present')
    print('  - DEG/RAD toggle: present')
    print('  - Division by zero error handling: present')
    print('  - README.md: mentions HTML calculator, Tailwind, scientific functions, how to run')
    print('  - Old Python files: deleted')
    sys.exit(0)
