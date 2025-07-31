let headerMode = 'normal'; // or 'upper', 'lower'

const columnDefs = columns.map((col) => ({
    field: col,
    // headerName: col.toUpperCase(),
    headerStyle: { fontWeight: 'bold' },
    filter: "agMultiColumnFilter",
    headerTooltip: col.toUpperCase(),
    tooltipValueGetter: (col) => {
        return col.value == null || col.value === "" ? "- Missing -" : col.value;
    },
}));


let selectedNode = null;
let csvExportParams = {
    columnSeparator: ',',
    suppressQuotes: false,
    skipColumnGroupHeaders: false,
    skipColumnHeaders: false,
    skipPinnedTop: false,
    skipPinnedBottom: false,
    allColumns: false,
    exportRowNumbers: false,
    exportedRows: "filteredAndSorted",
    onlySelected: false,
    onlySelectedAllPages: false,
    skipRowGroups: false,
    fileName: "DiffAppExport.csv",
};

let excelExportParams = {
    author: "DiffApp",
    exportRowNumbers: false,
    exportedRows: "filteredAndSorted",
    fileName: "DiffAppExport.xlsx",
    freezeColumns: 'none',
    freezeRows: 'none',
    onlySelected: false,
    onlySelectedAllPages: false,
    rowGroupExpandState: 'expanded',
    sheetName: "DiffAppExport",
    skipColumnGroupHeaders: false,
    skipColumnHeaders: false,
    skipPinnedBottom: false,
    skipPinnedTop: false,
    skipRowGroups: false,
    suppressColumnOutline: false,
    suppressRowOutline: false
};



const gridOptions = {
    theme: myTheme,
    rowData: [],
    columnDefs: columnDefs,
    defaultColDef: {
        filter: true,
        flex: 1,
        minWidth: 100,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
    },
    icons: {
        "custom-advanced-filters": '<span class="ag-icon ag-icon-filter-add"></span>',
        "custom-export": '<span class="ag-icon ag-icon-save"></span>',
    },
    multiSortKey: "ctrl",
    rowNumbers: {
        suppressCellSelectionIntegration: false,
        enableRowResizer: true
    },

    cellSelection: {
        enableHeaderHighlight: true,
        handle: {
            mode: "fill",
        },
    },
    enableRowPinning: true,

    tooltipShowDelay: 0,
    tooltipHideDelay: 2000,

    autoGroupColumnDef: {
        minWidth: 200,
    },
    sideBar: {
        toolPanels: [
            "columns",
            "filters",
            {
                id: "customAdvancedFilters",
                labelDefault: "Advanced Filters",
                labelKey: "customAdvancedFilters",
                iconKey: "custom-advanced-filters",
                toolPanel: customAdvancedFiltersToolPanel,
                toolPanelParams: {
                    title: "Advanced Filters",
                },
            },
            {
                id: "customExport",
                labelDefault: "Export",
                labelKey: "customExport",
                iconKey: "custom-export",
                toolPanel: CustomExportToolPanel,
                toolPanelParams: {
                    title: "Export",
                },
            },
        ],
        defaultToolPanel: "columns",
    },
    // pivotMode: true,
    rowGroupPanelShow: "always",
    pivotPanelShow: "always",

    pagination: true,
    paginationPageSize: 100,
    paginationPageSizeSelector: [100, 200, 500, 1000],

    enableCharts: true,
    allowContextMenuWithControlKey: true,
    getContextMenuItems: (params) => {
        const result = [
            'autoSizeAll',
            'expandAll',
            'contractAll',
            'copy',
            'copyWithHeaders',
            'copyWithGroupHeaders',
            'cut',
            'paste',
            'resetColumns',
            'chartRange',
            'pinRowSubMenu',
            'unpinRows',
        ];
        return result;
    },
    statusBar: {
        statusPanels: [
            { statusPanel: "agFilteredRowCountComponent" },
            { statusPanel: "agSelectedRowCountComponent" },
            { statusPanel: "agAggregationComponent" },
        ],
    },
    defaultCsvExportParams: csvExportParams,
    defaultExcelExportParams: excelExportParams,

};

function onQuickFilterTextBoxChanged() {
    gridApi.setGridOption(
        "quickFilterText",
        document.getElementById("quickFilterText-filter-text-box").value,
    );
}


function handleChange(el) {
    const state = el.checked ? 'checked' : 'unchecked';
    console.log(`${el.value} → ${state}`);

    // --- Update grid options ---
    if (el.value === "advancedFilterBuilder") {
        window.gridApi.setGridOption("enableAdvancedFilter", el.checked);
    } else if (el.value === "ResizeColumnsToFitCellContents") {
        const colIds = [];
        window.gridApi.getColumns().forEach((column) => {
            colIds.push(column.getId());
        });

        window.gridApi.autoSizeColumns({
            colIds,
            skipHeader: el.checked,
            // defaultMaxWidth: 150,
            // defaultMinWidth: 80,
        });
    } else if (el.value === "ClearSort") {
        window.gridApi.applyColumnState({
            defaultState: { sort: null },
        });
    } else if (el.value === "exportRowNumbers") {
        window.gridApi.setGridOption("defaultExcelExportParams", { "exportRowNumbers": el.checked });
    } else if (el.value === "columnHoverHighlight") {
        // window.gridApi.setGridOption("suppressRowHoverHighlight", el.checked);
        window.gridApi.setGridOption("columnHoverHighlight", el.checked);
    } else if (el.value === "singleRowSelection") {
        if (el.checked) {
            selectedNode = 'singleRow'
            gridApi.setGridOption("rowSelection", {
                mode: selectedNode,
                checkboxes: false,
                headerCheckbox: false,
                enableSelectionWithoutKeys: true,
                enableClickSelection: true,
            });
            el.disabled = true;
        }
        // window.gridApi.setGridOption("rowSelection", undefined);
        // gridApi.setGridOption("rowSelection", false);
    } else if (el.value === "multiRowSelection") {
        if (el.checked) {
            selectedNode = 'multiRow'
            gridApi.setGridOption("rowSelection", {
                mode: selectedNode,
                checkboxes: false,
                headerCheckbox: false,
                enableSelectionWithoutKeys: true,
                enableClickSelection: true,
            });
            el.disabled = true;
        }
    } else if (el.value === "quickFilterText") {
        if (el.checked) {
            const header = document.querySelector('.ag-header.ag-focus-managed.ag-pivot-off.ag-header-allow-overflow');
            if (!header) return;

            // Create a container for your advanced filter HTML
            const filterDiv = document.createElement('div');
            filterDiv.className = 'quickFilterText';
            filterDiv.innerHTML = `
            <div class="ag-advanced-filter-header" role="row" aria-hidden="false" style="height: 48px; min-height: 48px;" aria-rowindex="1">
                <div class="ag-advanced-filter ag-advanced-filter-header-cell" role="gridcell" tabindex="-1" aria-colindex="1" aria-colspan="7">
                <div class="ag-autocomplete" role="presentation" data-ref="eAutocomplete">
                    <div role="presentation" data-ref="eAutocompleteInput" class="ag-labeled ag-label-align-left ag-text-field ag-input-field">
                        <div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper" data-ref="eWrapper" role="presentation">
                            <input class="ag-input-field-input ag-text-field-input" 
                                data-ref="eInput" type="text" id="quickFilterText-filter-text-box" tabindex="0" 
                                autocomplete="off" oninput="onQuickFilterTextBoxChanged()">
                        </div>
                    </div>
                </div>
                <button class="ag-button ag-standard-button ag-advanced-filter-apply-button" data-ref="eApplyFilterButton" tabindex="0" 
                    onClick="onQuickFilterTextBoxChanged()">Apply</button>
                </div>
            </div>
            `;
            window.gridApi.setGridOption("enableAdvancedFilter", true);
            window.gridApi.setGridOption("enableAdvancedFilter", false);
            // Insert after the header
            header.parentNode.insertBefore(filterDiv, header.nextSibling);
        }
        else {
            // Remove the filterDiv if it exists
            const filterDiv = document.querySelector('.quickFilterText');
            if (filterDiv) {
                filterDiv.remove();
            }
        }
    } else if (el.value === "copyHeadersToClipboard") {
        window.gridApi.setGridOption("copyHeadersToClipboard", el.checked);
    } else if (el.value === "copySelectedRows") {
        gridApi.setGridOption("rowSelection", {
            mode: selectedNode || 'singleRow',
            checkboxes: false,
            headerCheckbox: false,
            enableSelectionWithoutKeys: true,
            enableClickSelection: true,
            copySelectedRows: el.checked,
        })
    } else if (el.value === "columnSeparatorDefault") {
        csvExportParams.columnSeparator = ',';
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "columnSeparatorTab") {
        if (el.checked) {
            csvExportParams.columnSeparator = '\t';
        } else {
            csvExportParams.columnSeparator = ',';
        }
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "columnSeparatorBar") {
        if (el.checked) {
            csvExportParams.columnSeparator = '|';
        } else {
            csvExportParams.columnSeparator = ',';
        }
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "suppressQuotes") {
        csvExportParams.suppressQuotes = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "skipColumnGroupHeaders") {
        csvExportParams.skipColumnGroupHeaders = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "skipColumnHeaders") {
        csvExportParams.skipColumnHeaders = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "skipPinnedTop") {
        csvExportParams.skipPinnedTop = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "skipPinnedBottom") {
        csvExportParams.skipPinnedBottom = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "allColumns") {
        csvExportParams.allColumns = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "exportRowNumbers") {
        csvExportParams.exportRowNumbers = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "exportedRowsFilteredAndSorted") {
        csvExportParams.exportedRows = "filteredAndSorted";
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "exportedRowsAll") {
        if (el.checked) {
            csvExportParams.exportedRows = "all";
        } else {
            csvExportParams.exportedRows = "filteredAndSorted";
        }
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "OnlySelected") {
        csvExportParams.onlySelected = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "exportedRowsOnlySelectedAllPages") {
        csvExportParams.onlySelectedAllPages = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    } else if (el.value === "skipRowGroups") {
        csvExportParams.skipRowGroups = el.checked;
        window.gridApi.setGridOption("defaultCsvExportParams", csvExportParams);
    }

    else if (el.value === "excelExportRowNumbers") {
        excelExportParams.exportRowNumbers = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelExportedRowsFilteredAndSorted") {
        excelExportParams.exportedRows = "filteredAndSorted";
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelExportedRowsAll") {
        if (el.checked) {
            excelExportParams.exportedRows = "all";
        } else {
            excelExportParams.exportedRows = "filteredAndSorted";
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelFreezeColumnsPinned") {
        if (el.checked) {
            excelExportParams.freezeColumns = 'pinned';
        } else {
            excelExportParams.freezeColumns = null;
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelfreezeRowsHeaders") {
        if (el.checked) {
            excelExportParams.freezeRows = 'headers';
        } else {
            excelExportParams.freezeRows = null;
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelfreezeRowsHeadersAndPinnedRows") {
        if (el.checked) {
            excelExportParams.freezeRows = 'headersAndPinnedRows';
        } else {
            excelExportParams.freezeRows = null;
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelOnlySelected") {
        excelExportParams.onlySelected = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelOnlySelectedAllPages") {
        excelExportParams.onlySelectedAllPages = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelRowGroupExpandStateExpanded") {
        excelExportParams.rowGroupExpandState = 'expanded';
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelRowGroupExpandStateCollapsed") {
        if (el.checked) {
            excelExportParams.rowGroupExpandState = 'collapsed';
        } else {
            excelExportParams.rowGroupExpandState = 'expanded';
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelRowGroupExpandStateMatch") {
        if (el.checked) {
            excelExportParams.rowGroupExpandState = 'match';
        } else {
            excelExportParams.rowGroupExpandState = 'expanded';
        }
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSkipColumnGroupHeaders") {
        excelExportParams.skipColumnGroupHeaders = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSkipColumnHeaders") {
        excelExportParams.skipColumnHeaders = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSkipPinnedBottom") {
        excelExportParams.skipPinnedBottom = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSkipPinnedTop") {
        excelExportParams.skipPinnedTop = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSkipRowGroups") {
        excelExportParams.skipRowGroups = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSuppressColumnOutline") {
        excelExportParams.suppressColumnOutline = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    } else if (el.value === "excelSuppressRowOutline") {
        excelExportParams.suppressRowOutline = el.checked;
        window.gridApi.setGridOption("defaultExcelExportParams", excelExportParams);
    }
}

function onExcelExport() {
    const params = window.gridApi.getGridOption("defaultExcelExportParams");
    if (params) {
        window.gridApi.exportDataAsExcel(params);
    }
}

function onCsvExport() {
    const params = window.gridApi.getGridOption("defaultCsvExportParams");
    if (params) {
        window.gridApi.exportDataAsCsv(params);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const gridDiv = document.querySelector("#myGrid");
    window.gridApi = agGrid.createGrid(gridDiv, gridOptions);
    window.gridApi.setGridOption("rowData", rowData);

});


