from flask import (Blueprint)
from .handlers_spreadsheet import (upload, dashboard, view, test)

spreadsheet_bp = Blueprint("spreadsheet", __name__, url_prefix="/spreadsheet", template_folder="spreadsheet")


spreadsheet_bp.route("/upload", methods=["GET", "POST"])(upload)
spreadsheet_bp.route("/dashboard", methods=["GET"])(dashboard)
spreadsheet_bp.route('/view/<which>', methods=['GET', 'POST'])(view)
spreadsheet_bp.route('/test', methods=['GET'])(test)