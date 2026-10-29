import os
import sys
import time
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer

DIST_DIR = r"C:\Users\josei\Desktop\insti\DI\gestion-multiplataforma\dist"
SCREENSHOTS_DIR = r"C:\Users\josei\Desktop\insti\DI\gestion-multiplataforma\docs\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE_PATH):
    EDGE_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Si el archivo no existe físicamente en dist y no tiene extensión estática, servir index.html
        path_without_query = self.path.split('?')[0].lstrip('/')
        full_path = os.path.join(DIST_DIR, path_without_query)
        if not os.path.exists(full_path) or os.path.isdir(full_path):
            self.path = '/index.html'
        return super().do_GET()

def start_server(port=8099):
    server = HTTPServer(('127.0.0.1', port), SPAHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    return server

def capture_url(url, output_path, delay=2.5):
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--hide-scrollbars",
        "--window-size=1280,840",
        f"--virtual-time-budget={int(delay * 1000)}",
        f"--screenshot={output_path}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    print("Iniciando servidor SPA local en puerto 8099...")
    server = start_server(8099)
    time.sleep(1)

    views = [
        ("01_login_view.png", "http://127.0.0.1:8099/login"),
        ("02_dashboard_view.png", "http://127.0.0.1:8099/dashboard?demo=admin"),
        ("03_records_table_view.png", "http://127.0.0.1:8099/records?demo=admin"),
        ("04_new_record_form.png", "http://127.0.0.1:8099/records/new?demo=admin"),
        ("05_admin_users_rbac.png", "http://127.0.0.1:8099/admin/users?demo=admin"),
        ("06_help_manual_view.png", "http://127.0.0.1:8099/help?demo=admin"),
        ("07_unauthorized_403.png", "http://127.0.0.1:8099/unauthorized")
    ]

    for filename, url in views:
        out_path = os.path.join(SCREENSHOTS_DIR, filename)
        print(f"Capturando {filename} desde {url}...")
        capture_url(url, out_path, delay=3.0)
        if os.path.exists(out_path):
            size = os.path.getsize(out_path)
            print(f"  -> Generada: {filename} ({size} bytes)")
        else:
            print(f"  -> ERROR: No se pudo generar {filename}")

    server.shutdown()
    print("Capturas finalizadas correctamente.")

if __name__ == "__main__":
    main()
