@echo off
echo Building Excel Validator Application...

:: Activate virtual environment
call venv\Scripts\activate

:: Build the application
pyinstaller excel_validator.spec

:: Create installer
makensis installer.nsi

echo Build Complete! Check ExcelDateValidator_Setup.exe in the current directory
pause