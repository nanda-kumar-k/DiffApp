import json
import logging

from typing import Any, Tuple
from diff_match_patch import diff_match_patch

from deepdiff import DeepDiff
from flask import ( flash, redirect, render_template, request, session, url_for )
from werkzeug.utils import secure_filename

from .store import DataFrameStore
from .handlers_comman import allowed_file

import pandas as pd


logger = logging.getLogger(__name__)

SPREADSHEET_STORE = DataFrameStore()

def upload() -> str:
    if request.method == "POST":
        file1 = request.files.get("spreadsheet1")
        file2 = request.files.get("spreadsheet2")

        if not file1 or not file2:
            flash("Both spreadsheet files must be provided.", category="danger")
            return render_template("spreadsheet/upload.html")
        
        if not allowed_file(file1.filename) or not allowed_file(file2.filename):
            flash("Only files with .xlsx, .xls, .csv extension are allowed.", category="danger")
            return render_template("spreadsheet/upload.html")

        fname1 = secure_filename(file1.filename)
        fname2 = secure_filename(file2.filename)

        try:
            if fname1.endswith(('.xlsx', '.xls')):
                data1 = pd.read_excel(file1)
            elif fname1.endswith('.csv'):
                data1 = pd.read_csv(file1)
            else:
                flash(f"Unsupported file format for '{fname1}'.", category="danger")
                return render_template("spreadsheet/upload.html")

            if fname2.endswith(('.xlsx', '.xls')):
                data2 = pd.read_excel(file2)
            elif fname2.endswith('.csv'):
                data2 = pd.read_csv(file2)
            else:
                flash(f"Unsupported file format for '{fname2}'.", category="danger")
                return render_template("spreadsheet/upload.html")
        except Exception as e:
            flash(f"Error reading '{fname1}': {e}", category="danger")
            print(f"Error reading '{fname1}': {e}")
            return render_template("spreadsheet/upload.html")

        run_id = SPREADSHEET_STORE.create(data1, data2)
        if not run_id:
            flash("Failed to store the uploaded spreadsheets.", category="danger")
            return render_template("spreadsheet/upload.html")

        session.clear()  # Clear previous session data
        session["run_id"] = run_id
        logger.info(f"Stored new spreadsheet pair under run_id={run_id}")
        
        return redirect(url_for("spreadsheet.dashboard"))

    return render_template("spreadsheet/upload.html")

def dashboard() -> str:
    """
    Display the dashboard with options to view or compare the uploaded spreadsheets.
    """
    run_id = session.get("run_id")
    if not run_id or not SPREADSHEET_STORE.exists(run_id):
        flash("No active session. Please upload two spreadsheet files first.", category="warning")
        return redirect(url_for("spreadsheet.upload"))
    
    df1, df2 = _get_stored_dataframes()
    if df1 is None or df2 is None:
        return redirect(url_for("spreadsheet.upload"))

    return render_template("spreadsheet/dashboard.html", run_id=run_id)

def _get_stored_dataframes() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Retrieve the stored DataFrames from the session.
    """
    run_id = session.get("run_id")
    if not run_id or not SPREADSHEET_STORE.exists(run_id):
        flash("No active session. Please upload two spreadsheet files first.", category="warning")
        return None, None

    df1 = SPREADSHEET_STORE.get(run_id).get("df1")
    df2 = SPREADSHEET_STORE.get(run_id).get("df2")

    # Check if both DataFrames are valid
    if not isinstance(df1, pd.DataFrame) or not isinstance(df2, pd.DataFrame):
        flash("Stored data is not valid. Please re-upload the spreadsheets.", category="danger")
        SPREADSHEET_STORE.delete(run_id)  # Clean up invalid session
        session.pop("run_id", None)
        return None, None

    # If either DataFrame is None, it indicates an issue with retrieval
    # This can happen if the session has expired or the data was not stored correctly
    if df1.empty and df2.empty:
        flash("No data found in the stored spreadsheets. Please re-upload.", category="warning")
        SPREADSHEET_STORE.delete(run_id)  # Clean up empty session
        session.pop("run_id", None)
        return None, None

    return df1, df2 

def view(which: str) -> str:
    """
    View the contents of the uploaded spreadsheets.
    """
    if which not in ["first", "second"]:
        flash("Invalid request. Please specify 'first' or 'second'.", category="danger")
        return redirect(url_for("spreadsheet.upload"))

    df1, df2 = _get_stored_dataframes()
    if df1 is None or df2 is None:
        return redirect(url_for("spreadsheet.upload"))

    if which == "first":
        df = df1
    else:
        df = df2

    all_cols = df.columns.tolist()

    selected = request.form.getlist('columns') or all_cols
    print(f"Selected columns: {selected}")
    if 'all' in selected:
        selected = all_cols

    df_records = df[selected].to_dict(orient='records')
    return render_template('spreadsheet/view.html',
                            which=which.title(),
                            columns=all_cols,
                            selected=selected,
                            df_records=df_records)


def test() -> str:
    """
    Test function to compare two DataFrames and return the differences.
    """
    return render_template("spreadsheet/test.html")