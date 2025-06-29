class CustomToolPanel {
    eGui;
    init(params) {
        this.eGui = document.createElement('div');
        // this.eGui.style.textAlign = 'center';
        this.eGui.classList.add('custom-tool-panel');

        // calculate stats when new rows loaded, i.e. onModelUpdated
        const renderStats = () => {
            this.eGui.innerHTML = this.calculateStats(params);
        };
        params.api.addEventListener('modelUpdated', renderStats);
    }

    getGui() {
        return this.eGui;
    }

    refresh() { }

    calculateStats(params) {
        return `
        <div class="custom-tool-panel-sidebar-header">
            <p>Custom Stats</p>
        </div>
        <nav class="custom-tool-panel-sidebar">

            <!-- ▸ Columns ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-columns">
                <i class="bi ag-icon ag-icon-tree-closed"></i> COLUMNS
            </button>
            <div id="c-columns" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="advancedFilterBuilder" onchange="handleChange(this)" id="chkAdvancedFilterBuilder" />
                        <label class="form-check-label" for="chkAdvancedFilterBuilder">Advanced Filter Builder</label>
                    </li>
                </ul>
            </div>

            <!-- ▸ Rows ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-rows">
                <i class="bi ag-icon ag-icon-tree-closed"></i> ROWS
            </button>
            <div id="c-rows" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="advancedFilterBuilder" onchange="handleChange(this)" id="chkAdvancedFilterBuilder" />
                        <label class="form-check-label" for="chkAdvancedFilterBuilder">Advanced Filter Builder</label>
                    </li>
                </ul>
            </div>

            <!-- ▸ Cells ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-cells">
                <i class="bi ag-icon ag-icon-tree-closed"></i> CELLS
            </button>
            <div id="c-cells" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="advancedFilterBuilder" onchange="handleChange(this)" id="chkAdvancedFilterBuilder" />
                        <label class="form-check-label" for="chkAdvancedFilterBuilder">Advanced Filter Builder</label>
                    </li>
                </ul>
            </div>

            <!-- ▸ FILTERS ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-filters">
                <i class="bi ag-icon ag-icon-tree-closed"></i> FILTERS
            </button>
            <div id="c-filters" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="advancedFilterBuilder" onchange="handleChange(this)" id="chkAdvancedFilterBuilder" />
                        <label class="form-check-label" for="chkAdvancedFilterBuilder">Advanced Filter Builder</label>
                    </li>
                </ul>
            </div>

            <!-- ▸ SELECTION ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-selection">
                <i class="bi ag-icon ag-icon-tree-closed"></i> SELECTION
            </button>
            <div id="c-selection" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="advancedFilterBuilder" onchange="handleChange(this)" id="chkAdvancedFilterBuilder" />
                        <label class="form-check-label" for="chkAdvancedFilterBuilder">Advanced Filter Builder</label>
                    </li>
                </ul>
            </div>

         </nav>
        `;
    }
}
