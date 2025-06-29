import os
import logging
from flask import Flask
from app.config import Config
from .routes_json import json_dp
from .routes_spreadsheet import spreadsheet_bp

from flask import redirect, url_for

_logger = logging.getLogger(__name__)

def create_app():
    """
    Application factory for creating and configuring the Flask app.
    """
    app = Flask(__name__, template_folder="templates")
    app.config.from_object(Config)

    # Configure logging
    logging.basicConfig(
        level=app.config["LOG_LEVEL"],
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler("app.log", mode="a")
        ],
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    _logger.info("Starting Flask application")

    # Register blueprints
    app.register_blueprint(json_dp)
    app.register_blueprint(spreadsheet_bp)

    @app.route("/")
    def index():
        return redirect(url_for("json.upload"))

    return app
