#!/usr/bin/env python3
"""Verify the HTML calculator project meets all requirements."""
import ast
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

# 7. Nav bar with calculator + todo tabs
if '<nav' not in html:
    errors.append('Navigation bar (<nav>) not found in index.html')
for element_id in ['tab-calculator', 'tab-todo', 'view-calculator', 'view-todo']:
    if f'id="{element_id}"' not in html:
        errors.append(f'Nav/view element with id="{element_id}" not found in index.html')
if 'Todo List' not in html:
    errors.append('"Todo List" tab label not found in index.html')

# 8. Todo list UI elements
for element_id in ['todo-input', 'todo-add', 'todo-list', 'todo-empty']:
    if f'id="{element_id}"' not in html:
        errors.append(f'Todo element with id="{element_id}" not found in index.html')
if 'checkbox' not in html:
    errors.append('Todo checkbox not found in index.html')
if 'line-through' not in html:
    errors.append('Strikethrough style for completed todos not found in index.html')

# 9. Todo frontend wired to the REST API
if 'fetch(' not in html:
    errors.append('fetch() calls to the todo API not found in index.html')
if '/api/todos' not in html:
    errors.append('/api/todos endpoint not referenced in index.html')
for method in ['POST', 'PUT', 'DELETE']:
    if f"'{method}'" not in html:
        errors.append(f'{method} request to the todo API not found in index.html')

# --- server.py checks ---
if not os.path.exists('server.py'):
    errors.append('server.py does not exist')
else:
    with open('server.py', 'r', encoding='utf-8') as f:
        server_src = f.read()
    try:
        ast.parse(server_src)
    except SyntaxError as exc:
        errors.append(f'server.py is not valid Python: {exc}')
    for handler in ['do_GET', 'do_POST', 'do_PUT', 'do_DELETE']:
        if handler not in server_src:
            errors.append(f'server.py is missing the {handler} handler')
    if '/api/todos' not in server_src:
        errors.append('server.py does not define the /api/todos route')
    if 'todos.json' not in server_src:
        errors.append('server.py does not store todos in a JSON file')
    if 'makedirs' not in server_src or 'exist_ok' not in server_src:
        errors.append('server.py does not auto-create the data directory (os.makedirs(..., exist_ok=True))')
    if '8000' not in server_src:
        errors.append('server.py does not run on port 8000')

# --- .gitignore checks ---
if not os.path.exists('.gitignore'):
    errors.append('.gitignore does not exist')
else:
    with open('.gitignore', 'r', encoding='utf-8') as f:
        gitignore_lines = [line.strip() for line in f]
    if 'data/' not in gitignore_lines:
        errors.append('.gitignore does not ignore data/')

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
    print('  - Nav bar: Calculator + Todo List tabs present')
    print('  - Todo UI: input, add button, list container, empty state, strikethrough')
    print('  - Todo frontend: fetch calls for GET/POST/PUT/DELETE /api/todos')
    print('  - server.py: valid Python, REST handlers, JSON storage, auto-creates data/, port 8000')
    print('  - .gitignore: ignores data/')
    print('  - README.md: mentions HTML calculator, Tailwind, scientific functions, how to run')
    print('  - Old Python files: deleted')
    sys.exit(0)
