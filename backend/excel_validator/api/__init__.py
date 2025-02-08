from flask import Blueprint

bp = Blueprint('api', __name__)

from excel_validator.api import routes