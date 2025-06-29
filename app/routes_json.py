from flask import (Blueprint)
from .handlers_json import (upload, dashboard, view_jsons, diff_jsons, diff_colored)

json_dp = Blueprint("json", __name__, url_prefix="/json", template_folder="json")


json_dp.route("/upload", methods=["GET", "POST"])(upload)
json_dp.route("/dashboard", methods=["GET"])(dashboard)
json_dp.route("/view", methods=["GET"])(view_jsons)
json_dp.route("/diff", methods=["GET"])(diff_jsons)
json_dp.route("/diff_colored", methods=["GET"])(diff_colored)