const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeSidebarBtn");
window.gridApi = null; // Declare and initialize as global


function showSidebar() {
    sidebar.classList.add("show");
    sidebar.style.display = "block";
    localStorage.setItem("sidebarOpen", "true");
}

function hideSidebar() {
    sidebar.classList.remove("show");
    sidebar.style.display = "none";
    localStorage.setItem("sidebarOpen", "false");
}

function MenuDisplay(compareOption) {
    const json_Links = {
        'Upload JSONs': 'upload',
        'Dashboard': 'dashboard',
        'View Original JSONs': 'view',
        'See Diff': 'diff',
        'View Colorized Diff': 'diff_colored'
    };

    const spreadsheet_Links = {
        'Upload Spreadsheet': 'upload',
        'Dashboard': 'dashboard',
        'View Original First Spreadsheet': 'view/first',
        'View Original Second Spreadsheet': 'view/second',
    };

    const links = compareOption === 'json' ? json_Links : spreadsheet_Links;

    Object.keys(links).forEach(function (key) {
        const link = document.createElement('a');
        // there link should be based on the blueprint name(json or spreadsheet)
        link.href = `/${compareOption}/${links[key]}`;
        link.className = "nav-link";
        link.textContent = key;
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
        sidebar.appendChild(link);
    });
}



function toggleSidebar(compareOption) {

    const sideBarLinks = document.querySelectorAll("#sidebar a");
    sideBarLinks.forEach(link => {
        link.remove();
    });

    showSidebar();

    if (compareOption === 'json') {

        MenuDisplay('json');
        localStorage.setItem("compareOption", "json");

    } else if (compareOption === 'spreadsheet') {

        MenuDisplay('spreadsheet');
        localStorage.setItem("compareOption", "spreadsheet");

    }
}

function toggleSidebarClick(compareOption) {
    toggleSidebar(compareOption);

    if (compareOption === 'json') {
        window.location.href = '/json/dashboard';
    } else if (compareOption === 'spreadsheet') {
        window.location.href = '/spreadsheet/dashboard';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log(window.CURRENT_ENDPOINT)
    const sideBarLinks = document.querySelectorAll("#sidebar a");

    closeBtn.addEventListener("click", function () {
        sideBarLinks.forEach(link => {
            link.remove();
        });
        hideSidebar();
    });

    if (localStorage.getItem("sidebarOpen") === "true") {
        showSidebar();
        compareOption = localStorage.getItem("compareOption") || 'json';
        toggleSidebar(compareOption);
    } else {
        hideSidebar();
    }

    const root = document.documentElement;
    const button = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');

    // Read stored preference or fall back to system
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const getDefault = () => stored ?? (prefersDark ? 'dark' : 'light');

    const applyTheme = theme => {
        root.setAttribute('data-bs-theme', theme);
        root.setAttribute('data-ag-theme-mode', theme);
        localStorage.setItem('theme', theme);
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
    };

    // Initialise
    applyTheme(getDefault());

    // Toggle on click
    button.addEventListener('click', () => {
        const newTheme = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        if (window.gridApi) {
            document.body.dataset.agThemeMode = newTheme;
        }
    });

});



