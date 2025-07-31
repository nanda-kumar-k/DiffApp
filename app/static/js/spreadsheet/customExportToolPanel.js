class CustomExportToolPanel {
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
            <p>Export</p>
        </div>
        <nav class="custom-tool-panel-sidebar">
            <!-- ▸ EXPORT Buttons ----------------------------------------------------- -->
            <div class="d-flex align-items-center justify-content-center mb-2">
                <button class="ag-button ag-standard-button ag-advanced-filter-apply-button" data-ref="eApplyFilterButton" tabindex="0" 
                    onClick="onCsvExport()" style="font-size: 14px; margin: 2px"> CSV Export</button>
                <button class="ag-button ag-standard-button ag-advanced-filter-apply-button" data-ref="eApplyFilterButton" tabindex="0" 
                    onClick="onExcelExport()" style="font-size: 14px; margin: 2px">Excel Export</button>
            </div>

            <!-- ▸ CSV EXPORT ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-csv-export">
                <i class="bi ag-icon ag-icon-tree-closed"></i> CSV EXPORT
            </button>
            <div id="c-csv-export" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="columnSeparatorDefault" onchange="handleChange(this)" id="chkcolumnSeparatorDefault" />
                        <label class="form-check-label" for="chkcolumnSeparatorDefault">Column Separator(default: ,)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="columnSeparatorTab" onchange="handleChange(this)" id="chkcolumnSeparatorTab" />
                        <label class="form-check-label" for="chkcolumnSeparatorTab">Column Separator(Tab)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="columnSeparatorBar" onchange="handleChange(this)" id="chkcolumnSeparatorBar" />
                        <label class="form-check-label" for="chkcolumnSeparatorBar">Column Separator(Bar: |)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="suppressQuotes" onchange="handleChange(this)" id="chksuppressQuotes" />
                        <label class="form-check-label" for="chksuppressQuotes">Suppress Quotes</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="skipColumnGroupHeaders" onchange="handleChange(this)" id="chkskipColumnGroupHeaders" />
                        <label class="form-check-label" for="chkskipColumnGroupHeaders">Skip Column Group Headers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="skipColumnHeaders" onchange="handleChange(this)" id="chkskipColumnHeaders" />
                        <label class="form-check-label" for="chkskipColumnHeaders">Skip Column Headers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="skipPinnedTop" onchange="handleChange(this)" id="chkskipPinnedTop" />
                        <label class="form-check-label" for="chkskipPinnedTop">Skip Pinned Top</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="skipPinnedBottom" onchange="handleChange(this)" id="chkskipPinnedBottom" />
                        <label class="form-check-label" for="chkskipPinnedBottom">Skip Pinned Bottom</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="allColumns" onchange="handleChange(this)" id="chkallColumns" />
                        <label class="form-check-label" for="chkallColumns">All Columns(Hidden Columns Too)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="exportRowNumbers" onchange="handleChange(this)" id="chkexportRowNumbers" />
                        <label class="form-check-label" for="chkexportRowNumbers">Export Row Numbers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="exportedRowsFilteredAndSorted" onchange="handleChange(this)" id="chkexportedRowsFilteredAndSorted" />
                        <label class="form-check-label" for="chkexportedRowsFilteredAndSorted">Exported Rows (Filtered and Sorted)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="exportedRowsAll" onchange="handleChange(this)" id="chkexportedRowsAll" />
                        <label class="form-check-label" for="chkexportedRowsAll">Exported Rows (All)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="onlySelected" onchange="handleChange(this)" id="chkonlySelected" />
                        <label class="form-check-label" for="chkonlySelected">Only Selected</label>
                    </li>
                    <li class="d-flex align-items-center mb-2 ">
                        <input class="form-check-input me-2" type="checkbox" value="exportedRowsOnlySelectedAllPages" onchange="handleChange(this)" id="chkexportedRowsOnlySelectedAllPages" />
                        <label class="form-check-label" for="chkexportedRowsOnlySelectedAllPages">Exported Rows (Only Selected - All Pages)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="skipRowGroups" onchange="handleChange(this)" id="chkskipRowGroups" />
                        <label class="form-check-label" for="chkskipRowGroups">Skip Row Groups</label>
                    </li>
                </ul>
            </div>


            <!-- ▸ EXCEL EXPORT ----------------------------------------------------- -->
            <button class="menu-btn" data-bs-toggle="collapse" data-bs-target="#c-excel-export">
                <i class="bi ag-icon ag-icon-tree-closed"></i> EXCEL EXPORT
            </button>
            <div id="c-excel-export" class="collapse ps-4">
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelExportRowNumbers" onchange="handleChange(this)" id="chkexcelExportRowNumbers" />
                        <label class="form-check-label" for="chkexcelExportRowNumbers">Export Row Numbers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelExportedRowsFilteredAndSorted" onchange="handleChange(this)" id="chkexcelExportedRowsFilteredAndSorted" />
                        <label class="form-check-label" for="chkexcelExportedRowsFilteredAndSorted">Exported Rows (Filtered and Sorted)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelExportedRowsAll" onchange="handleChange(this)" id="chkexcelExportedRowsAll" />
                        <label class="form-check-label" for="chkexcelExportedRowsAll">Exported Rows (All)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelFreezeColumnsPinned" onchange="handleChange(this)" id="chkexcelFreezeColumnsPinned" />
                        <label class="form-check-label" for="chkexcelFreezeColumnsPinned">Freeze Columns (Pinned)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelfreezeRowsHeaders" onchange="handleChange(this)" id="chkexcelfreezeRowsHeaders" />
                        <label class="form-check-label" for="chkexcelfreezeRowsHeaders">Freeze Rows (Headers)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelfreezeRowsHeadersAndPinnedRows" onchange="handleChange(this)" id="chkexcelfreezeRowsHeadersAndPinnedRows" />
                        <label class="form-check-label" for="chkexcelfreezeRowsHeadersAndPinnedRows">Freeze Rows (Headers and Pinned Rows)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelOnlySelected" onchange="handleChange(this)" id="chkexcelOnlySelected" />
                        <label class="form-check-label" for="chkexcelOnlySelected">Only Selected</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelOnlySelectedAllPages" onchange="handleChange(this)" id="chkexcelOnlySelectedAllPages" />
                        <label class="form-check-label" for="chkexcelOnlySelectedAllPages">Only Selected (All Pages)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelRowGroupExpandStateExpanded" onchange="handleChange(this)" id="chkexcelRowGroupExpandStateExpanded" />
                        <label class="form-check-label" for="chkexcelRowGroupExpandStateExpanded">Row Group Expand State (Expanded)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelRowGroupExpandStateCollapsed" onchange="handleChange(this)" id="chkexcelRowGroupExpandStateCollapsed" />
                        <label class="form-check-label" for="chkexcelRowGroupExpandStateCollapsed">Row Group Expand State (Collapsed)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelRowGroupExpandStateMatch" onchange="handleChange(this)" id="chkexcelRowGroupExpandStateMatch" />
                        <label class="form-check-label" for="chkexcelRowGroupExpandStateMatch">Row Group Expand State (Matched)</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSkipColumnGroupHeaders" onchange="handleChange(this)" id="chkexcelSkipColumnGroupHeaders" />
                        <label class="form-check-label" for="chkexcelSkipColumnGroupHeaders">Skip Column Group Headers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSkipColumnHeaders" onchange="handleChange(this)" id="chkexcelSkipColumnHeaders" />
                        <label class="form-check-label" for="chkexcelSkipColumnHeaders">Skip Column Headers</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSkipPinnedBottom" onchange="handleChange(this)" id="chkexcelSkipPinnedBottom" />
                        <label class="form-check-label" for="chkexcelSkipPinnedBottom">Skip Pinned Bottom</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSkipPinnedTop" onchange="handleChange(this)" id="chkexcelSkipPinnedTop" />
                        <label class="form-check-label" for="chkexcelSkipPinnedTop">Skip Pinned Top</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSkipRowGroups" onchange="handleChange(this)" id="chkexcelSkipRowGroups" />
                        <label class="form-check-label" for="chkexcelSkipRowGroups">Skip Row Groups</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSuppressColumnOutline" onchange="handleChange(this)" id="chkexcelSuppressColumnOutline" />
                        <label class="form-check-label" for="chkexcelSuppressColumnOutline">Suppress Column Outline</label>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <input class="form-check-input me-2" type="checkbox" value="excelSuppressRowOutline" onchange="handleChange(this)" id="chkexcelSuppressRowOutline" />
                        <label class="form-check-label" for="chkexcelSuppressRowOutline">Suppress Row Outline</label>
                    </li>
                </ul>
            </div>

         </nav>
        `;
    }
}
