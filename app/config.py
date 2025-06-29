# app/config.py
# Centralized configuration; pulls sensitive values from environment

import os

class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "please_change_this_to_a_random_value")
    MAX_CONTENT_LENGTH = 2 * 1024 * 1024  # 2 MB max per request
    UPLOAD_EXTENSIONS = {".json", ".txt", ".csv", ".xlsx", ".xls"}
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
