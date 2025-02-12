# Excel Date Validator

A comprehensive solution for validating and managing holiday dates through both web and desktop interfaces. This application allows users to upload, validate, and manage holiday dates using Excel files.

## 🏗️ Project Structure

```
hanabi-project/
├── backend/               # Flask REST API
│   ├── excel_validator/   # Core application logic
│   ├── migrations/        # Database migrations
│   ├── tests/            # Unit tests
│   ├── config.py         # Configuration settings
│   ├── requirements.txt  # Python dependencies
│   └── run.py           # Application entry point
├── frontend/             # React Web Interface
│   ├── src/              # Source code
│   ├── public/           # Static files
│   └── package.json      # Node dependencies
├── desktop_app/          # PyQt6 Desktop Application
│   ├── resources/        # Application resources
│   ├── launcher.py       # Main entry point
│   └── excel_validator_ui.py # UI implementation
└── resources/            # Shared resources
```

## ⚙️ Features

### Excel File Management
- Upload and validate Excel files
- Automatic date format checking
- Duplicate date detection
- Bulk date processing

### Holiday Management
- Add and manage holiday dates
- Support for regular holidays and special Saturday handling
- Date conflict resolution

### Multiple Interfaces
- Web Interface (React)
- Desktop Application (PyQt6)
- RESTful API Endpoints

## 🛠️ Technical Stack

### Backend
- Framework: Flask
- Database: SQLAlchemy with SQLite
- Migrations: Flask-Migrate
- API: RESTful with Flask-RESTful
- CORS: Flask-CORS

### Frontend
- Framework: React
- Styling: TailwindCSS
- HTTP Client: Axios
- State Management: React Context

### Desktop Application
- UI Framework: PyQt6
- Packaging: PyInstaller
- Installer: NSIS

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- NSIS (for desktop installer)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up database migrations:
```bash
flask db upgrade
```

5. Start the Flask application:
```bash
flask run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Desktop Application Setup

1. Navigate to the desktop_app directory:
```bash
cd desktop_app
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Launch the desktop application:
```bash
python launcher.py
```

## 📝 Configuration

### Backend Configuration
Edit `.flaskenv` in the backend directory:
```plaintext
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
```

### Frontend Configuration
Edit `.env` in the frontend directory:
```plaintext
VITE_API_BASE_URL=http://localhost:8001/api/
```

### Desktop Configuration
Edit `config.ini` in the desktop directory:
```ini
[Database]
type = sqlite
path = app.db

[API]
port = 8001
```

## 🔨 Building the Desktop Application

### Windows

1. Navigate to the desktop_app directory:
```bash
cd desktop_app
```

2. Setup the development environment:
```bash
.\setup_dev.bat
```

3. Build the executable and installer:
```bash
.\build_app.bat
```

The installer will be created as `ExcelDateValidator_Setup.exe`.

## 📚 API Documentation

### Endpoints
#### Holiday Management
- `GET /api/holidays`: Fetch all holidays
- `POST /api/upload/excel/holidays`: Upload holiday Excel file
- `GET /api/check/excel/holidays`: Validate Excel dates

## ⚠️ Known Issues
- The desktop application requires Python version 3.10 or higher
- Excel files must have a 'Dates' column in the correct format
- CORS settings may need adjustment based on deployment environment
- The desktop application build process is Windows-specific

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support
For support:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🌟 Acknowledgments
- PyQt6 community for the desktop UI framework
- Flask community for the backend framework
- React community for the frontend framework
- All contributors and testers

Made by © Saunak Shrestha