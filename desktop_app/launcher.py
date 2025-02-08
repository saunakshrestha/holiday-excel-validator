import os
import sys
import subprocess
import time
import signal
import psutil

def is_port_in_use(port):
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('localhost', port))
            return False
        except socket.error:
            return True

def start_application():
    # Get correct paths for packaged app
    if getattr(sys, 'frozen', False):
        application_path = os.path.dirname(sys.executable)
        backend_path = os.path.join(application_path, 'backend')
        db_path = os.path.join(application_path, 'data')
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))
        backend_path = os.path.abspath(os.path.join(application_path, '..', 'backend'))
        db_path = os.path.join(application_path, 'data')

    # Create data directory
    os.makedirs(db_path, exist_ok=True)

    # Start backend server
    flask_env = os.environ.copy()
    flask_env['FLASK_APP'] = 'run.py'
    flask_env['FLASK_ENV'] = 'production'
    flask_env['DATABASE_PATH'] = os.path.join(db_path, 'app.db')
    
    # Start Flask backend
    if not is_port_in_use(8001):
        backend = subprocess.Popen(
            [sys.executable, 'run.py'],
            cwd=backend_path,
            env=flask_env
        )
    else:
        backend = None
        print("Flask server already running")

    # Give Flask time to start
    time.sleep(2)

    try:
        # Start the GUI application
        from excel_validator_ui import main
        main()
    finally:
        # Cleanup: Stop the Flask server if we started it
        if backend:
            if sys.platform == 'win32':
                backend.terminate()
            else:
                os.kill(backend.pid, signal.SIGTERM)

if __name__ == '__main__':
    start_application()