import click
from flask.cli import with_appcontext
from excel_validator import db
from excel_validator.models.dates import Holiday
from sqlalchemy import func

@click.command('remove-duplicate-dates')
@with_appcontext
def remove_duplicate_dates():
    """Remove duplicate dates from the Holiday table."""
    try:
        # Find duplicates
        duplicates = db.session.query(
            Holiday.date,
            Holiday.day_type,
            func.count('*').label('count')
        ).group_by(
            Holiday.date,
            Holiday.day_type
        ).having(func.count('*') > 1).all()

        total_removed = 0
        
        for date, day_type, count in duplicates:
            # Keep the first entry, delete the rest
            holidays_to_delete = Holiday.query.filter_by(
                date=date,
                day_type=day_type
            ).offset(1).all()
            
            for holiday in holidays_to_delete:
                db.session.delete(holiday)
                total_removed += 1

        db.session.commit()
        click.echo(f"Successfully removed {total_removed} duplicate entries")

    except Exception as e:
        db.session.rollback()
        click.echo(f"Error: {str(e)}")