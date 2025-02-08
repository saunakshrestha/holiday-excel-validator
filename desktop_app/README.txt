EXCEL DATE VALIDATOR - BUILD AND SETUP INSTRUCTIONS
================================================

1. PREREQUISITES
---------------
- Windows 10 or later
- Python 3.10 or later
- NSIS (Nullsoft Scriptable Install System)
- Git (optional)

2. AUTOMATED SETUP (RECOMMENDED)
------------------------------
a) Using Batch Scripts:
   1. Navigate to desktop_app folder
   2. Double-click setup_dev.bat
      - Creates virtual environment
      - Installs dependencies
      - Sets up resource directories
   3. Double-click build_app.bat
      - Builds executable
      - Creates installer package

3. MANUAL SETUP
--------------
a) Environment Setup:
   cd desktop_app
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt

b) Create Directories:
   mkdir resources\database
   mkdir resources\icons

c) Build Steps:
   pyinstaller excel_validator.spec
   makensis installer.nsi

4. FILE STRUCTURE
----------------
desktop_app/
├── resources/
│   ├── database/
│   └── icons/
├── setup_dev.bat
├── build_app.bat
├── launcher.py
├── excel_validator_ui.py
├── config.ini
├── excel_validator.spec
├── installer.nsi
└── requirements.txt

5. BUILD VERIFICATION
--------------------
1. Check dist/ folder for ExcelValidator.exe
2. Verify ExcelDateValidator_Setup.exe in root folder
3. Test installation package on clean system

6. COMMON ISSUES
---------------
1. If setup_dev.bat fails:
   - Verify Python installation
   - Run as administrator
   - Check PATH environment variable

2. If build_app.bat fails:
   - Ensure NSIS is installed
   - Verify all dependencies installed
   - Check resources folder structure

7. TESTING
----------
1. Install on test machine
2. Verify application launches
3. Test Excel file upload
4. Test holiday management
5. Verify database creation

8. DEPLOYMENT
------------
1. Distribute ExcelDateValidator_Setup.exe
2. Users run installer
3. Application available in Start Menu
4. Desktop shortcut created automatically

For technical support:
Contact: support@example.com