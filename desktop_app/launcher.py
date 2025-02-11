import os
import sys
import subprocess
import time
import signal
import socket

def is_port_in_use(port):
    """Check if a port is in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('localhost', port))
            return False
        except socket.error:
            return True

def start_application():
    """Start the Flask backend and UI application."""
    
    # Get correct paths for packaged app
    if getattr(sys, 'frozen', False):  # If running as an executable
        application_path = os.path.dirname(sys.executable)
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))
    
    backend_path = os.path.join(application_path, 'backend')
    db_path = os.path.join(application_path, 'data')

    # Debugging paths
    print(f"[INFO] Application Path: {application_path}")
    print(f"[INFO] Backend Path: {backend_path}")
    print(f"[INFO] Database Path: {db_path}")

    # Ensure the backend directory exists
    if not os.path.exists(backend_path):
        print(f"[ERROR] Backend directory not found: {backend_path}")
        sys.exit(1)

    # Create data directory if it doesn't exist
    os.makedirs(db_path, exist_ok=True)

    # Set environment variables for Flask
    flask_env = os.environ.copy()
    flask_env['FLASK_APP'] = 'run.py'
    flask_env['FLASK_ENV'] = 'production'
    flask_env['DATABASE_PATH'] = os.path.join(db_path, 'app.db')

    # Start Flask backend if not already running
    backend = None
    if not is_port_in_use(8001):
        try:
            backend = subprocess.Popen(
                [sys.executable, 'run.py'],
                cwd=backend_path,
                env=flask_env
            )
            print("[INFO] Flask server started.")
        except Exception as e:
            print(f"[ERROR] Failed to start Flask server: {e}")
            sys.exit(1)
    else:
        print("[INFO] Flask server already running.")

    # Give Flask some time to initialize
    time.sleep(2)

    try:
        # Start the GUI application
        from excel_validator_ui import main
        print("[INFO] Starting UI application...")
        main()
    except Exception as e:
        print(f"[ERROR] Failed to start UI: {e}")
    finally:
        # Cleanup: Stop the Flask server if we started it
        if backend:
            print("[INFO] Stopping Flask server...")
            backend.terminate() if sys.platform == 'win32' else os.kill(backend.pid, signal.SIGTERM)

if __name__ == '__main__':
    start_application()
