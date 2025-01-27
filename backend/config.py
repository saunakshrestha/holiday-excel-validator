import os
from datetime import timedelta

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://saunakshrestha:root@localhost/hanabi_project'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Additional Configuration
    DEBUG = False
    TESTING = False
    