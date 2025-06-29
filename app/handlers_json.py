import json
import logging

import os
from typing import Any, Tuple
from diff_match_patch import diff_match_patch

from deepdiff import DeepDiff
from flask import ( flash, redirect, render_template, request, session, url_for )
from werkzeug.utils import secure_filename

from .store import JsonStore
from .handlers_comman import allowed_file

from flask import current_app


logger = logging.getLogger(__name__)

JSON_STORE = JsonStore()


def upload() -> str:
    if request.method == "POST":
        file1 = request.files.get("json1")
        file2 = request.files.get("json2")

        if not file1 or not file2:
            flash("Both JSON files must be provided.", category="danger")
            return render_template("json/upload.html")
        
        if not allowed_file(file1.filename) or not allowed_file(file2.filename):
            flash("Only files with .json extension are allowed.", category="danger")
            return render_template("json/upload.html")

        fname1 = secure_filename(file1.filename)
        fname2 = secure_filename(file2.filename)

        try:
            data1 = json.load(file1.stream)
        except json.JSONDecodeError:
            flash(f"'{fname1}' is not valid JSON.", category="danger")
            return render_template("json/upload.html")

        try:
            data2 = json.load(file2.stream)
        except json.JSONDecodeError:
            flash(f"'{fname2}' is not valid JSON.", category="danger")
            return render_template("json/upload.html")

        run_id = JSON_STORE.create(data1, data2)
        session["run_id"] = run_id
        logger.info(f"Stored new JSON pair under run_id={run_id}")

        return redirect(url_for("json.dashboard"))
    print("TEMPLATE FOLDERS:", current_app.jinja_loader.searchpath)
    print("CWD:", os.getcwd())
    print("ENDPOINT:", request.endpoint)
    return render_template("json/upload.html")


def dashboard() -> str:
    
    run_id = session.get("run_id")
    if not run_id or not JSON_STORE.exists(run_id):
        flash("No active session. Please upload two JSON files first.", category="warning")
        return redirect(url_for("json.upload"))

    return render_template("json/dashboard.html", run_id=run_id)

def _get_stored_jsons() -> Tuple[Any, Any]:
    
    run_id = session.get("run_id")
    if not run_id or not JSON_STORE.exists(run_id):
        raise KeyError("Invalid run_id or expired session")

    entry = JSON_STORE.get(run_id)
    return entry["json1"], entry["json2"]


def view_jsons() -> str:
    
    try:
        j1, j2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("json.upload"))

    pretty1 = json.dumps(j1, indent=2, ensure_ascii=False)
    pretty2 = json.dumps(j2, indent=2, ensure_ascii=False)
    return render_template("json/view.html", json1=pretty1, json2=pretty2)


def diff_jsons() -> str:
    
    try:
        obj1, obj2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("json.upload"))

    diff_result = DeepDiff(obj1, obj2, view="tree")
    return render_template("json/diff.html", diff=diff_result)


def diff_colored():
    try:
        obj1, obj2 = _get_stored_jsons()
    except KeyError:
        flash("Session expired or invalid. Please re-upload JSON files.", category="warning")
        return redirect(url_for("json.upload"))

    text1 = json.dumps(obj1, indent=2, ensure_ascii=False)
    text2 = json.dumps(obj2, indent=2, ensure_ascii=False)

    dmp = diff_match_patch()
    
    diffs = dmp.diff_main(text1, text2)
    dmp.diff_cleanupSemantic(diffs)

    diff_html = dmp.diff_prettyHtml(diffs)

    return render_template("json/diff_colored.html", diff_html=diff_html)