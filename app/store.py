# app/store.py
# Simple in-memory store wrapper for JSON objects.
# In a real production app, replace this with a database or persistent cache.

import uuid
from typing import Dict, Any, Optional
import pandas as pd

class JsonStore:
    """
    Thread‐safe in‐memory store for JSON objects, keyed by UUID.
    """
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}

    def create(self, json1: Any, json2: Any) -> str:
        run_id = str(uuid.uuid4())
        self._store[run_id] = {"json1": json1, "json2": json2}
        return run_id

    def get(self, run_id: str) -> Optional[Dict[str, Any]]:
        return self._store.get(run_id)

    def exists(self, run_id: str) -> bool:
        return run_id in self._store

    def delete(self, run_id: str) -> None:
        if run_id in self._store:
            del self._store[run_id]

class DataFrameStore:
    """
    Simple in-memory store for DataFrames, keyed by UUID.
    """
    def __init__(self):
        self._store: Dict[str, Dict[str, pd.DataFrame]] = {}

    def create(self, df1: pd.DataFrame, df2: pd.DataFrame) -> str:
        run_id = str(uuid.uuid4())
        self._store[run_id] = {"df1": df1, "df2": df2}
        return run_id

    def get(self, run_id: str) -> Optional[Dict[str, pd.DataFrame]]:
        return self._store.get(run_id)

    def exists(self, run_id: str) -> bool:
        return run_id in self._store

    def delete(self, run_id: str) -> None:
        if run_id in self._store:
            del self._store[run_id]