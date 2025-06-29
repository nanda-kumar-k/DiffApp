const columnDefs = columns.map((col) => ({
    field: col,
    headerName: col.toUpperCase(),
    headerStyle: { fontWeight: 'bold' },
    filter: "agMultiColumnFilter",
    headerTooltip: col.toUpperCase(),
    tooltipValueGetter: (col) => {
        return col.value == null || col.value === "" ? "- Missing -" : col.value;
    }
}));



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
        "custom-stats": '<span class="ag-icon ag-icon-custom-stats"></span>',
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
                id: "customStats",
                labelDefault: "Custom Stats",
                labelKey: "customStats",
                iconKey: "custom-stats",
                toolPanel: CustomToolPanel,
                toolPanelParams: {
                    title: "Custom Stats",
                },
        },
        ],
        defaultToolPanel: "customStats",
    },
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
            'export',
            {
                name: 'Export as CSV',
                subMenu: [
                    {
                        name: 'Export all data as CSV',
                        action: () => params.api.exportDataAsCsv({ allColumns: true }),
                    },
                    {
                        name: 'Export selected rows as CSV',
                        action: () => params.api.exportDataAsCsv({ onlySelected: true }),
                    },
                ],
            },
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

};

function clearSort() {
  window.gridApi.applyColumnState({
    defaultState: { sort: null },
  });
}

function handleChange(el){
      const state = el.checked ? 'checked' : 'unchecked';
      console.log(`${el.value} → ${state}`);
      
        if (el.value === "advancedFilterBuilder") {
            if (el.checked) {
                window.gridApi.setGridOption("enableAdvancedFilter", true);
            } else {
                window.gridApi.setGridOption("enableAdvancedFilter", false);
            }
        }  
}

document.addEventListener("DOMContentLoaded", function () {
    const gridDiv = document.querySelector("#myGrid");
    window.gridApi = agGrid.createGrid(gridDiv, gridOptions);
    window.gridApi.setGridOption("rowData", rowData);
    
});


