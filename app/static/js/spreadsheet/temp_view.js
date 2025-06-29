<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="en" >

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>{% block title %}JSON Diff App{% endblock %}</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        /* Ensure body content isn’t hidden under the fixed navbar */
        body {
            padding-top: 56px;
        }
        
        .side-content-wrapper {
            display: flex;
            flex-direction: row;
            height: 100vh;
        }

        /* Persistent sidebar, hidden by default */
        #sidebar {
            position: fixed;
            top: 56px;
            /* just below the navbar */
            left: 0;
            width: 240px;
            height: 100%;
            background-color: #f8f9fa;
            border-right: 1px solid #dee2e6;
            padding-top: 0.5rem;
            overflow-y: auto;
            display: none;
            z-index: 1030;
            /* below navbar (1040+) */
        }

        /* When sidebar is shown, push page content to the right */
        #sidebar.show~.content-wrapper {
            margin-left: 240px;
        }

        /* Sidebar header and close icon */
        #sidebar .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid #dee2e6;
        }

        #sidebar .sidebar-header h5 {
            margin: 0;
            font-size: 1rem;
        }

        #sidebar .sidebar-close {
            font-size: 1.2rem;
            cursor: pointer;
            color: #212529;
        }

        #sidebar a {
            display: block;
            padding: 0.5rem 1rem;
            color: #212529;
            text-decoration: none;
        }

        #sidebar a:hover {
            background-color: rgba(0, 0, 0, 0.05);
            font-weight: bold;
        }

        .nav-btn{
            border-width: 0 0 2px 0 !important;
            border-bottom-style: solid !important;
            border-bottom-color: none !important; 
            border-radius: 0 !important;
        }

        .nav-btn:hover {
            border-bottom-color: white !important;
        }
    </style>
    {% block head %}{% endblock %}
</head>

<body>
    <!-- Fixed-top Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
            <!-- “Nanda” on the left -->
            <a class="navbar-brand" href="#">Diff App</a>
            <!-- Right-aligned links -->
            <ul class="navbar-nav flex-row gap-2">
                <li class="nav-item">
                    <button onclick="toggleSidebar('json')" class="btn text-white btn-outline-none nav-btn" type="button">
                        JSON Compare
                    </button>
                </li>
                <li class="nav-item">
                    <button onclick="toggleSidebar('spreadsheet')" class="btn text-white btn-outline-none nav-btn" type="button">
                        Spreadsheet Compare
                    </button>
                </li>

            </ul>   
        </div>
    </nav>

    <div class="side-content-wrapper">
            <!-- Persistent Sidebar -->
        <div id="sidebar">
            <div class="sidebar-header">
                <h5>Menu</h5>
                <!-- Close icon -->
                <span id="closeSidebarBtn" class="sidebar-close">&times;</span>
            </div>
        </div>

        <!-- Main content area; will shift right when sidebar is shown -->
        <div class="content-wrapper">
            <div class="container-fluid px-4 py-4">
                {% block content %}{% endblock %}
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle (with Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ url_for('static', filename='js/basic.js') }}"></script>
    {% block scripts %}{% endblock %}
</body>

</html>