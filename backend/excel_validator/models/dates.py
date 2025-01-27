from excel_validator import db
from datetime import datetime

class Saturday(db.Model):
    __tablename__ = 'saturdays'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False, index=True)
    year = db.Column(db.Integer, nullable=False, index=True)
    month = db.Column(db.Integer, nullable=False, index=True)
    
    __table_args__ = (
        db.Index('idx_saturday_date', 'date'),
        db.Index('idx_saturday_year_month', 'year', 'month'),
    )

    @staticmethod
    def is_saturday(date):
        return Saturday.query.filter_by(date=date).first() is not None

class Holiday(db.Model):
    __tablename__ = 'holidays'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False, index=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    year = db.Column(db.Integer, nullable=False, index=True)
    month = db.Column(db.Integer, nullable=False, index=True)
    nepali_date = db.Column(db.String(10), index=True)
    holiday_type = db.Column(db.String(50))  # public, religious, etc.
    
    __table_args__ = (
        db.Index('idx_holiday_date', 'date'),
        db.Index('idx_holiday_year_month', 'year', 'month'),
        db.Index('idx_holiday_type', 'holiday_type'),
    )

    @staticmethod
    def is_holiday(date):
        return Holiday.query.filter_by(date=date).first() is not None

class ValidationResult(db.Model):
    __tablename__ = 'validation_results'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    validation_date = db.Column(db.DateTime, default=datetime.utcnow)
    invalid_dates = db.Column(db.JSON)
    total_invalid = db.Column(db.Integer)
    total_records = db.Column(db.Integer)