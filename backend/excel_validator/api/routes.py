from excel_validator.api import bp
from excel_validator.models.dates import Holiday
from excel_validator import db
from flask_cors import cross_origin, CORS
from sqlalchemy import func
import pandas as pd
from datetime import datetime
from flask import request, jsonify
from werkzeug.utils import secure_filename
from sqlalchemy import exc as sqlalchemy_exc

# CORS Configuration
cors = CORS(bp, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": "*",
        "expose_headers": "*",
        "supports_credentials": True
    }
})



# write an api to list all holidays stored in table Holiday
@bp.route('/holidays', methods=['GET'])
# @cross_origin()
def list_holidays():
    holidays = Holiday.query.filter(func.lower(Holiday.day_type).like('%holiday%')).all()  # Query all holidays
    holidays_list = [ holiday.date.strftime('%Y-%m-%d') for holiday in holidays]
    response_data = {
        "success": True,
        "message": "Holidays fetched successfully",
        "holidays": holidays_list
    }
    return jsonify(response_data), 200

# Write an API to list all Saturdays stored in table Holiday
@bp.route('/saturdays', methods=['GET'])
# @cross_origin()
def list_saturdays():
    saturdays = Holiday.query.filter(func.lower(Holiday.day_type).like('%saturday%')).all()
    saturdays_list = [saturday.date.strftime("%Y-%m-%d") for saturday in saturdays]
    response_data = {
        "success": True,
        "message": "Saturdays fetched successfully",
        "saturdays": saturdays_list
    }
    return jsonify(response_data), 200



# Allow only certain file extensions for security
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload/excel/holidays', methods=['POST'])
def upload_holidays():
    holiday_type = request.form.get('type', '')
    if holiday_type.lower() not in ['holiday','saturday']:
        return jsonify({"error": "Invalid type parameter. Expected 'holidays'."}), 400
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Please upload an Excel file."}), 400

    try:
        # Read Excel file into a pandas dataframe
        filename = secure_filename(file.filename)
        df = pd.read_excel(file)

        # Ensure the Excel file has a 'Dates' column
        if 'Dates' not in df.columns:
            return jsonify({"error": "Excel file must contain a 'Dates' column."}), 400
        
        invalid_dates = []
        valid_dates = []

        # Process each row in the 'Dates' column
        for index, row in df.iterrows():
            date_str = str(row['Dates']).strip()
            try:
                # Validate and parse the date using the Holiday model
                holiday = Holiday(
                    date_str=date_str,
                    day_type="Holiday" if holiday_type == 'holiday' else "Saturday",
                    description="Custom Holiday"
                )
                
                valid_dates.append(holiday)
            except ValueError:
                print(f"Invalid date format: {date_str}")
                invalid_dates.append(date_str)

        # Store valid holidays in the database
        try:
            db.session.bulk_save_objects(valid_dates)
            db.session.commit()
        except sqlalchemy_exc.IntegrityError:
            db.session.rollback()
            return jsonify({
                "success": False,
                "message": "Some dates already exist in the database",
                "invalid_dates": invalid_dates
            }), 409  # HTTP 409 Conflict

        # Return a response
        if invalid_dates:
            return jsonify({
                "message": f"Successfully uploaded valid holidays. Some dates were invalid and skipped.",
                "invalid_dates": invalid_dates
            }), 400
        else:
            return jsonify({"message": "All holidays were uploaded successfully!"}), 200


    except pd.errors.EmptyDataError:
        return jsonify({
            "success": False,
            "message": "The uploaded file is empty"
        }), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500




# Helper function to check for valid date format
def is_valid_date(date_str):
    """
    Check if the date is in the format 'dd/mm/yyyy'.
    """
    try:
        # Attempt to parse the date with the 'dd/mm/yyyy' format
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

# API view to upload and check holidays in Excel
@bp.route('/check/excel/holidays', methods=['POST'])  # Ensure route is correctly defined
def check_holidays():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Ensure the file is an allowed extension
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Please upload an Excel file."}), 400

    try:
        # Read the uploaded Excel file into a pandas dataframe
        filename = secure_filename(file.filename)
        df = pd.read_excel(file)

        # Filter the rows, checking for valid dates in the first column (assumed column A)
        valid_dates = []
        invalid_dates = []
        
        # Loop over the first column (first column index is 0)
        for index, row in df.iterrows():
            date_str = str(row.iloc[0]).strip().split()[0] # Use iloc to access the first column by position
            if is_valid_date(date_str):  # Check if the date is valid
                valid_dates.append(date_str)
            else:
                invalid_dates.append(date_str)

        # Query the database for all holiday dates in 'dd/mm/yyyy' format
        holiday_dates = {holiday.date.strftime("%Y-%m-%d") for holiday in Holiday.query.all()}

        # Check which of the valid dates are actual holidays
        holidays_found = [date for date in valid_dates if date in holiday_dates]

        # Respond with a message about holidays found
        if holidays_found:
            return jsonify({
                "success": False,
                "message": "Some dates are holidays.",
                "holiday_dates": holidays_found,
                "invalid_dates":[ date for date in invalid_dates if not date.isalpha() ]
            }), 200
        else:
            return jsonify({
                "success": True,
                "message": "All dates are valid and none are holidays.",
                "holidays": [],
                "invalid_dates":[ date for date in invalid_dates if not date.isalpha() ] if invalid_dates else [],
            }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500