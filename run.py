# run.py
# Entry point: create_app() and run with debug based on environment

import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Allow FLASK_DEBUG or other env vars to control behavior
    debug_flag = os.getenv("FLASK_DEBUG", "False").lower() in ("1", "true", "yes")
    
    # app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)), debug=debug_flag)

    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)), debug=True, use_reloader=True)
