from datetime import datetime
import pandas as pd

def validate_dates(dates):
    # Define Nepali public holidays
    nepali_holidays = holidays.Nepal(years=[2022, 2023, 2024, 2025])

    # Find Saturdays and public holidays
    invalid_dates = [
        str(date.date()) for date in dates
        if date.weekday() == 5 or date in nepali_holidays  # Saturday (5) or holiday
    ]
    return invalid_dates

