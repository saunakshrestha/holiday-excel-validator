from excel_validator import create_app, db
from excel_validator.models import dates

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")