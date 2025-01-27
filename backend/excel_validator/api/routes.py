from flask import jsonify, request
from excel_validator.api import bp
from excel_validator.models.dates import Saturday, Holiday, ValidationResult
from excel_validator import db
from flask_cors import cross_origin
import pandas as pd
from datetime import datetime



@bp.route('/some_endpoint', methods=['GET', 'POST'])
# @cross_origin()
def some_endpoint():
    return jsonify({"message": "Success"})


@bp.route('/validate-excel', methods=['POST'])
@cross_origin()
def validate_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read Excel file
        df = pd.read_excel(file)
        
        # Check if Date column exists
        if 'Date' not in df.columns:
            return jsonify({'error': 'Excel file must contain a "Date" column'}), 400

        invalid_dates = []
        errors = []

        # Process each date
        for idx, row in df.iterrows():
            try:
                # Convert string date to datetime
                date_str = row['Date']
                if pd.isna(date_str):
                    errors.append({
                        'row': idx + 2,
                        'error': 'Empty date value'
                    })
                    continue

                date_obj = datetime.strptime(str(date_str), '%Y-%m-%d').date()

                reasons = []
                if Saturday.is_saturday(date_obj):
                    reasons.append('Saturday')
                if Holiday.is_holiday(date_obj):
                    reasons.append('Public Holiday')

                if reasons:
                    invalid_dates.append({
                        'date': date_str,
                        'row': idx + 2,
                        'reasons': reasons
                    })

            except Exception as e:
                errors.append({
                    'row': idx + 2,
                    'error': f'Invalid date format: {str(e)}'
                })

        # Store validation result
        result = ValidationResult(
            filename=file.filename,
            invalid_dates=invalid_dates,
            total_invalid=len(invalid_dates),
            total_records=len(df)
        )
        db.session.add(result)
        db.session.commit()

        response = {
            'status': 'success',
            'invalid_dates': invalid_dates,
            'errors': errors,
            'total_invalid': len(invalid_dates),
            'total_errors': len(errors),
            'total_records': len(df)
        }

        return jsonify(response), 200 if not invalid_dates and not errors else 400

    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500