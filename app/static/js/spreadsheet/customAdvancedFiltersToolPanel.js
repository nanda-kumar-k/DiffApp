class customAdvancedFiltersToolPanel {
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
                        <input class="form-check-input me-2" type="checkbox" value="ResizeColumnsToFitCellContents" onchange="handleChange(this)" id="chkResizeColumnsToFitCellContents" />
                        <label class="form-check-label" for="chkResizeColumnsToFitCellContents">Resize Columns to fit cell contents</label>
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
                        <input class="form-check-input me-2" type="checkbox" value="ClearSort" onchange="handleChange(this)" id="chkClearSort" />
                        <label class="form-check-label" for="chkClearSort">Clear Sort</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="exportRowNumbers" onchange="handleChange(this)" id="chkexportRowNumbers" />
                        <label class="form-check-label" for="chkexportRowNumbers">Export Row Numbers (Excel)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="columnHoverHighlight" onchange="handleChange(this)" id="chkcolumnHoverHighlight" />
                        <label class="form-check-label" for="chkcolumnHoverHighlight">Column Hover Highlight</label>
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
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="quickFilterText" onchange="handleChange(this)" id="chkquickFilterText" />
                        <label class="form-check-label" for="chkquickFilterText">Quick Filter Text</label>
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
                        <input class="form-check-input me-2" type="checkbox" value="singleRowSelection" onchange="handleChange(this)" id="chkSingleRowSelection" />
                        <label class="form-check-label" for="chkSingleRowSelection">Single Row Selection</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="multiRowSelection" onchange="handleChange(this)" id="chkMultiRowSelection" />
                        <label class="form-check-label" for="chkMultiRowSelection">Multi Row Selection</label>
                    </li>
                </ul>
            </div>


            <!-- ▸ COPY ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-copy">
                <i class="bi ag-icon ag-icon-tree-closed"></i> COPY
            </button>
            <div id="c-copy" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="copyHeadersToClipboard" onchange="handleChange(this)" id="chkcopyHeadersToClipboard" />
                        <label class="form-check-label" for="chkcopyHeadersToClipboard">Copy Headers to Clipboard</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="copySelectedRows" onchange="handleChange(this)" id="chkcopySelectedRows" />
                        <label class="form-check-label" for="chkcopySelectedRows">Copy Selected Rows</label>
                    </li>
                </ul>
            </div>

         </nav>
        `;
    }
}
