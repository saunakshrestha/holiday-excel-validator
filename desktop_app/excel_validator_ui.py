import sys
import requests
from datetime import datetime
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                           QPushButton, QFileDialog, QLabel, QTextEdit, 
                           QGridLayout, QScrollArea)
from PyQt6.QtCore import Qt

class ExcelValidatorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.api_url = 'http://localhost:8001/api'
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Excel Date Validator')
        self.setGeometry(100, 100, 800, 600)

        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        grid = QGridLayout(central_widget)

        # Upload Section for Holiday Management
        upload_widget = QWidget()
        upload_layout = QVBoxLayout(upload_widget)
        
        # Regular validation button
        self.upload_label = QLabel('Upload Excel file to validate dates')
        self.validate_button = QPushButton('Validate Dates Against Holidays')
        self.validate_button.clicked.connect(self.upload_file)
        
        upload_layout.addWidget(self.upload_label)
        upload_layout.addWidget(self.validate_button)

        # Results Section and Holidays Display Section remain the same
        self.results_text = QTextEdit()
        self.results_text.setReadOnly(True)
        
        # Holidays Display Section
        holidays_widget = QWidget()
        holidays_layout = QVBoxLayout(holidays_widget)
        
        self.holidays_label = QLabel('Public Holidays:')
        self.holidays_text = QTextEdit()
        self.holidays_text.setReadOnly(True)
        self.refresh_holidays_button = QPushButton('Refresh Holidays')
        self.refresh_holidays_button.clicked.connect(self.fetch_holidays)
        
        holidays_layout.addWidget(self.holidays_label)
        holidays_layout.addWidget(self.holidays_text)
        holidays_layout.addWidget(self.refresh_holidays_button)

        # Add widgets to grid
        # Add Admin Section at bottom
        admin_widget = QWidget()
        admin_layout = QVBoxLayout(admin_widget)
        
        warning_label = QLabel('⚠️ ADMIN ONLY - Database Management ⚠️')
        warning_label.setStyleSheet("QLabel { color: red; font-weight: bold; }")
        
        self.upload_button = QPushButton('🔒 Admin Upload')
        self.upload_button.setFixedWidth(120)  # Set fixed width
        self.upload_button.setStyleSheet("""
            QPushButton {
                background-color: #FF4444;
                color: white;
                padding: 8px;
                border: 2px solid #CC0000;
                border-radius: 4px;
                font-weight: bold;
                min-height: 20px;
            }
            QPushButton:hover {
                background-color: #CC0000;
            }
        """)
        self.upload_button.clicked.connect(self.confirm_holiday_upload)
        
        admin_layout.addWidget(warning_label)
        admin_layout.addWidget(self.upload_button)

        # Update grid layout
        grid.addWidget(upload_widget, 0, 0)
        grid.addWidget(self.results_text, 1, 0)
        grid.addWidget(holidays_widget, 0, 1, 2, 1)
        grid.addWidget(admin_widget, 2, 0, 1, 2)  # Span across both columns at bottom

        self.fetch_holidays()

    def upload_file(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select Excel File",
            "",
            "Excel Files (*.xlsx *.xls)"
        )
        
        if file_path:
            self.validate_excel(file_path)

    def validate_excel(self, file_path):
        try:
            files = {'file': open(file_path, 'rb')}
            response = requests.post(f'{self.api_url}/check/excel/holidays', files=files)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.results_text.setHtml(
                        '<p style="color: green;">✓ All dates are valid!</p>'
                    )
                else:
                    holiday_dates = data.get('holiday_dates', [])
                    invalid_dates = data.get('invalid_dates', [])
                    
                    html = '<p style="color: red;">⚠ Found conflicts:</p>'
                    if holiday_dates:
                        html += '<p>Holiday dates found:</p>'
                        html += '<ul>'
                        for date in holiday_dates:
                            html += f'<li>{date}</li>'
                        html += '</ul>'
                    
                    if invalid_dates:
                        html += '<p>Invalid dates found:</p>'
                        html += '<ul>'
                        for date in invalid_dates:
                            html += f'<li>{date}</li>'
                        html += '</ul>'
                    
                    self.results_text.setHtml(html)
            else:
                self.results_text.setHtml(
                    f'<p style="color: red;">Error: {response.json().get("error", "Unknown error")}</p>'
                )
                
        except Exception as e:
            self.results_text.setHtml(
                f'<p style="color: red;">Error: {str(e)}</p>'
            )

    def fetch_holidays(self):
        try:
            response = requests.get(f'{self.api_url}/holidays')
            if response.status_code == 200:
                holidays = response.json().get('holidays', [])
                self.holidays_text.setText('\n'.join(holidays))
            else:
                self.holidays_text.setText('Failed to fetch holidays')
        except Exception as e:
            self.holidays_text.setText(f'Error: {str(e)}')

    def upload_holidays(self):
        """Upload holidays to database"""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select Excel File with Holidays",
            "",
            "Excel Files (*.xlsx *.xls)"
        )
        
        if file_path:
            try:
                with open(file_path, 'rb') as file:
                    files = {'file': file}
                    data = {'type': 'holiday'}
                    
                    response = requests.post(
                        f'{self.api_url}/upload/excel/holidays',
                        files=files,
                        data=data
                    )
                
                if response.status_code == 200:
                    self.results_text.setHtml(
                        '<p style="color: green;">✓ Holidays uploaded successfully!</p>'
                    )
                    self.fetch_holidays()  # Refresh the holidays list
                else:
                    data = response.json()
                    if 'invalid_dates' in data:
                        html = '<p style="color: orange;">⚠ Some dates were invalid:</p><ul>'
                        for date in data.get('invalid_dates', []):
                            html += f'<li>{date}</li>'
                        html += '</ul>'
                        self.results_text.setHtml(html)
                    else:
                        self.results_text.setHtml(
                            f'<p style="color: red;">Error: {data.get("error", "Unknown error")}</p>'
                        )
                    
            except Exception as e:
                self.results_text.setHtml(
                    f'<p style="color: red;">Error uploading holidays: {str(e)}</p>'
                )

    def confirm_holiday_upload(self):
        """Confirm before uploading holidays"""
        from PyQt6.QtWidgets import QMessageBox
        
        confirm = QMessageBox()
        confirm.setIcon(QMessageBox.Icon.Warning)
        confirm.setText("⚠️ WARNING: Database Modification")
        confirm.setInformativeText("This action will modify the holiday database.\nAre you sure you want to proceed?")
        confirm.setWindowTitle("Admin Action Required")
        confirm.setStandardButtons(QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        confirm.setDefaultButton(QMessageBox.StandardButton.No)
        
        if confirm.exec() == QMessageBox.StandardButton.Yes:
            self.upload_holidays()

def main():
    app = QApplication(sys.argv)
    ex = ExcelValidatorApp()
    ex.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()