from excel_validator import db
from datetime import datetime

class Holiday(db.Model):
    __tablename__ = 'holidays'  # Changed table name to 'holidays'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, index=True)  # Date column for storing normalized dates
    day_type = db.Column(db.String(50), nullable=False)    # Field to determine if it's 'Saturday', 'Public Holiday', etc.
    description = db.Column(db.String(255), nullable=True)  # Optionally store a description for the day (e.g., holiday name)
    
    __table_args__ = (
        db.Index('idx_holiday_date', 'date'),  # Index for fast date-based queries
        db.Index('idx_holiday_type', 'day_type'),  # Index for fast type-based queries
    )
    
    def __init__(self, date_str, day_type, description=None):
        self.date = self.parse_date(date_str)
        self.day_type = day_type
        self.description = description

    @staticmethod
    def parse_date(date_str):
        """
        Helper function to parse multiple date formats for holidays (e.g., Saturdays or Public Holidays).
        """
        date_formats = ["%Y-%m-%d", "%Y-%b-%d", "%d/%m/%Y"]  # Formats: 'yyyy-MMM-dd' and 'dd/MM/yyyy'
        for fmt in date_formats:
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        raise ValueError(f"Invalid date format: {date_str}")  # Raise error if format doesn't match
    
    @staticmethod
    def find_by_range(start_date, end_date):
        """
        Find holidays (Saturdays, Public Holidays) within a specific date range.
        """
        return Holiday.query.filter(Holiday.date.between(start_date, end_date)).all()

    @staticmethod
    def find_by_type(day_type):
        """
        Find holidays by type (e.g., Saturdays, Public Holidays).
        """
        return Holiday.query.filter_by(day_type=day_type).all()
    
    def to_dict(self):
        """
        Convert Holiday object to a dictionary for JSON serialization.
        """
        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d"),
            "day_type": self.day_type,
            "description": self.description
        }
        

