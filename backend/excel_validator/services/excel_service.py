import pandas as pd
from excel_validator.utils.date_validator import validate_dates

class ExcelService:
    def __init__(self):
        self.validator = validate_dates
        self.allowed_extensions = {'xlsx', 'xls'}

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

    def process_excel(self, file):
        try:
            df = pd.read_excel(file)
            
            if 'Date' not in df.columns:
                return {'error': 'Excel file must contain a "Date" column'}, 400

            dates = pd.to_datetime(df['Date'])
            validation_result = self.validator.validate_dates(dates)
            
            return validation_result

        except Exception as e:
            return {'error': f'Error processing file: {str(e)}'}, 500