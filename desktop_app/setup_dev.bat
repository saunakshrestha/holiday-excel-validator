@echo off
echo Setting up development environment...

:: Create virtual environment
python -m venv venv
call venv\Scripts\activate

:: Install requirements
pip install -r requirements.txt

:: Create necessary directories
mkdir resources\database
mkdir resources\icons

echo Setup Complete!
pause