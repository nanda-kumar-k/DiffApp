import json
import logging
from pathlib import Path
from typing import Any, Tuple
from typing import Optional  # only if you need it elsewhere
from diff_match_patch import diff_match_patch

from deepdiff import DeepDiff
from flask import (
    Blueprint, current_app, flash, redirect, render_template,
    request, session, url_for
)
from markupsafe import Markup
from werkzeug.utils import secure_filename

from .store import JsonStore
from .store import DataFrameStore

main_bp = Blueprint("main", __name__)
logger = logging.getLogger(__name__)

# Single JsonStore instance for this example (threading considerations apply for production)
JSON_STORE = JsonStore()
DATAFRAME_STORE = DataFrameStore()

def allowed_file(filename: str) -> bool:
    """
    Check if the file has an allowed extension based on the app config.
    """
    ext = Path(filename).suffix.lower()
    return ext in current_app.config["UPLOAD_EXTENSIONS"]

@main_bp.route("/", methods=["GET"])
def index():
    return redirect(url_for("main.upload"))

@main_bp.route("/upload", methods=["GET", "POST"])
def upload() -> str:
    """
    Upload page: allow users to POST two JSON files. Validate, parse, and store in memory.
    """
    if request.method == "POST":
        file1 = request.files.get("json1")
        file2 = request.files.get("json2")

        # Validate presence
        if not file1 or not file2:
            flash("Both JSON files must be provided.", category="danger")
            return render_template("upload.html")

        # Validate extensions
        if not allowed_file(file1.filename) or not allowed_file(file2.filename):
            flash("Only files with .json extension are allowed.", category="danger")
            return render_template("upload.html")

        # Secure filenames (even though we do not save to disk here)
        fname1 = secure_filename(file1.filename)
        fname2 = secure_filename(file2.filename)

        try:
            data1 = json.load(file1.stream)
        except json.JSONDecodeError:
            flash(f"'{fname1}' is not valid JSON.", category="danger")
            return render_template("upload.html")

        try:
            data2 = json.load(file2.stream)
        except json.JSONDecodeError:
            flash(f"'{fname2}' is not valid JSON.", category="danger")
            return render_template("upload.html")

        # Create new run ID and store JSONs
        run_id = JSON_STORE.create(data1, data2)
        session["run_id"] = run_id
        logger.info(f"Stored new JSON pair under run_id={run_id}")

        return redirect(url_for("main.dashboard"))

    # GET request: just render upload form
    return render_template("upload.html")

@main_bp.route("/dashboard", methods=["GET"])
def dashboard() -> str:
    """
    Dashboard page: if there's a valid run_id in session, show dashboard; otherwise redirect to /upload.
    """
    run_id = session.get("run_id")
    if not run_id or not JSON_STORE.exists(run_id):
        flash("No active session. Please upload two JSON files first.", category="warning")
        return redirect(url_for("main.upload"))

    return render_template("dashboard.html", run_id=run_id)

def _get_stored_jsons() -> Tuple[Any, Any]:
    """
    Helper to fetch JSON1 and JSON2 for the current run_id. 
    If session is invalid or store missing, redirects to upload.
    """
    run_id = session.get("run_id")
    if not run_id or not JSON_STORE.exists(run_id):
        raise KeyError("Invalid run_id or expired session")

    entry = JSON_STORE.get(run_id)
    return entry["json1"], entry["json2"]

@main_bp.route("/view", methods=["GET"])
def view_jsons() -> str:
    """
    Render both stored JSONs side by side (pretty-printed).
    """
    try:
        j1, j2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("main.upload"))

    pretty1 = json.dumps(j1, indent=2, ensure_ascii=False)
    pretty2 = json.dumps(j2, indent=2, ensure_ascii=False)
    return render_template("view.html", json1=pretty1, json2=pretty2)

@main_bp.route("/diff", methods=["GET"])
def diff_jsons() -> str:
    """
    Compute a DeepDiff between the two JSON objects in "tree" view and render it.
    """
    try:
        obj1, obj2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("main.upload"))

    # Use DeepDiff in “tree” mode so we can iterate by category in the template
    diff_result = DeepDiff(obj1, obj2, view="tree")
    return render_template("diff.html", diff=diff_result)

@main_bp.route("/diff_colored", methods=["GET"])
def diff_colored():
    """
    Generate a side-by-side, colorized HTML diff of the two uploaded JSON files.
    """
    try:
        obj1, obj2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("main.upload"))

    # Pretty-print each JSON into a multiline string
    text1 = json.dumps(obj1, indent=2, ensure_ascii=False)
    text2 = json.dumps(obj2, indent=2, ensure_ascii=False)

    # Instantiate diff_match_patch and compute diff
    dmp = diff_match_patch()
    # diff_main returns a list of (op, data) tuples, where op is -1, 0, +1
    diffs = dmp.diff_main(text1, text2)
    dmp.diff_cleanupSemantic(diffs)

    # Generate HTML: <ins> tags for additions, <del> for deletions
    diff_html = dmp.diff_prettyHtml(diffs)

    # Render template, passing raw HTML
    return render_template("diff_colored.html", diff_html=diff_html)