from pathlib import Path
from flask import current_app

def allowed_file(filename: str) -> bool:
    """
    Check if the file has an allowed extension based on the app config.
    """
    ext = Path(filename).suffix.lower()
    return ext in current_app.config["UPLOAD_EXTENSIONS"]
