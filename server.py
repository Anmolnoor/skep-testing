#!/usr/bin/env python3
"""Static file server + todo REST API. Python stdlib only.

Serves index.html (and other static files) at / and exposes:
    GET    /api/todos       -> list all todos
    POST   /api/todos       -> create a todo   {"text": "..."}
    PUT    /api/todos/<id>  -> update a todo   {"text": "...", "completed": bool}
    DELETE /api/todos/<id>  -> delete a todo

Todos live in a single JSON file at data/todos.json.
"""
import json
import os
import threading
import uuid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
TODOS_FILE = os.path.join(DATA_DIR, 'todos.json')
API_PATH = '/api/todos'

# Serialises reads/writes of the JSON file across handler threads.
_lock = threading.Lock()


def load_todos():
    """Read the todo list from disk, returning [] if it is missing or corrupt."""
    if not os.path.exists(TODOS_FILE):
        return []
    try:
        with open(TODOS_FILE, 'r', encoding='utf-8') as f:
            todos = json.load(f)
    except (json.JSONDecodeError, OSError):
        return []
    return todos if isinstance(todos, list) else []


def save_todos(todos):
    with open(TODOS_FILE, 'w', encoding='utf-8') as f:
        json.dump(todos, f, indent=2)


class TodoHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    # --- helpers ---
    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        try:
            length = int(self.headers.get('Content-Length') or 0)
        except ValueError:
            return None
        if length <= 0:
            return None
        try:
            data = json.loads(self.rfile.read(length).decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return None
        return data if isinstance(data, dict) else None

    def _todo_id(self):
        """Return the <id> from /api/todos/<id>, or None if the path is not that shape."""
        prefix = API_PATH + '/'
        if not self.path.startswith(prefix):
            return None
        todo_id = self.path[len(prefix):]
        return todo_id if todo_id and '/' not in todo_id else None

    # --- routes ---
    def do_GET(self):
        if self.path == API_PATH:
            with _lock:
                self._send_json(load_todos())
            return
        super().do_GET()

    def do_POST(self):
        if self.path != API_PATH:
            self._send_json({'error': 'Not found'}, 404)
            return
        data = self._read_json() or {}
        text = data.get('text')
        if not isinstance(text, str) or not text.strip():
            self._send_json({'error': 'A non-empty "text" field is required'}, 400)
            return
        todo = {'id': str(uuid.uuid4()), 'text': text.strip(), 'completed': False}
        with _lock:
            todos = load_todos()
            todos.append(todo)
            save_todos(todos)
        self._send_json(todo, 201)

    def do_PUT(self):
        todo_id = self._todo_id()
        if todo_id is None:
            self._send_json({'error': 'Not found'}, 404)
            return
        data = self._read_json()
        if data is None:
            self._send_json({'error': 'A JSON body is required'}, 400)
            return
        with _lock:
            todos = load_todos()
            for todo in todos:
                if todo.get('id') != todo_id:
                    continue
                if 'text' in data:
                    text = data['text']
                    if not isinstance(text, str) or not text.strip():
                        self._send_json({'error': '"text" must be a non-empty string'}, 400)
                        return
                    todo['text'] = text.strip()
                if 'completed' in data:
                    todo['completed'] = bool(data['completed'])
                save_todos(todos)
                self._send_json(todo)
                return
        self._send_json({'error': 'Todo not found'}, 404)

    def do_DELETE(self):
        todo_id = self._todo_id()
        if todo_id is None:
            self._send_json({'error': 'Not found'}, 404)
            return
        with _lock:
            todos = load_todos()
            remaining = [t for t in todos if t.get('id') != todo_id]
            if len(remaining) == len(todos):
                self._send_json({'error': 'Todo not found'}, 404)
                return
            save_todos(remaining)
        self._send_json({'deleted': todo_id})


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    server = ThreadingHTTPServer(('', PORT), TodoHandler)
    print(f'Serving {BASE_DIR} on http://localhost:{PORT} (Ctrl+C to stop)')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down.')
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
