
// --- “Select All” logic -----------------------
const checkAll = document.getElementById('check_all');
const colChecks = document.querySelectorAll('.col-check');

function setAll(state) { colChecks.forEach(cb => cb.checked = state); }
checkAll?.addEventListener('change', () => setAll(checkAll.checked));
colChecks.forEach(cb => cb.addEventListener('change', () => {
    if (!cb.checked) checkAll.checked = false;
    else checkAll.checked = Array.from(colChecks).every(x => x.checked);
}));

let gridApi;

const myTheme = agGrid.themeQuartz.withParams({
  backgroundColor: "rgb(249, 245, 227)",
  foregroundColor: "rgb(126, 46, 132)",
  headerTextColor: "rgb(204, 245, 172)",
  headerBackgroundColor: "rgb(209, 64, 129)",
  oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
  headerColumnResizeHandleColor: "rgb(126, 46, 132)",
});

const columnDefs = columns.map((col) => ({
    field: col,
    headerName: col.toUpperCase(),
    // headerStyle: { color: 'blue', fontWeight: 'bold' },
    headerStyle: {fontWeight: 'bold' },
    // suppressHeaderFilterButton: true,
    filter: "agMultiColumnFilter",
    headerTooltip: col.toUpperCase(),
    // tooltipField: col,
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
        // cellStyle: { fontWeight: 'bold' },
    },
    multiSortKey: "ctrl",
    rowNumbers: {
        suppressCellSelectionIntegration: false,
        enableRowResizer: true
    },
    defaultCsvExportParams: {
        exportRowNumbers: true,
    },
    defaultExcelExportParams: {
        exportRowNumbers: true,
    },
    cellSelection: {
        enableHeaderHighlight: true,
            handle: {
            mode: "fill",
            },
    },
    // columnHoverHighlight: true,
    enableRowPinning: true,
    theme: agGrid.themeQuartz.withParams({
        pinnedRowBorder: {
        width: 2,
        },
        // backgroundColor: "#2b3035",
        backgroundColor: "#212529",
//   foregroundColor: "rgb(126, 46, 132)",
//   headerTextColor: "rgb(204, 245, 172)",
  headerBackgroundColor: "rgba(57,63,69,255)",
  oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
//   headerColumnResizeHandleColor: "rgb(126, 46, 132)",
    }),

    tooltipShowDelay: 0,
    tooltipHideDelay: 2000,
    // enableCellTextSelection: true,
    // ensureDomOrder: true,
    
    autoGroupColumnDef: {
        minWidth: 200,
    },
    sideBar: {
        toolPanels: ["columns", "filters"],
        defaultToolPanel: "columns", 
    },
    // enableAdvancedFilter: true,
    // pivotMode: true,
    
    // rowGroupPanelShow: "always",
    pivotPanelShow: "always",
    pagination: true,
    paginationPageSize: 100,
    paginationPageSizeSelector: [100, 500, 1000],
    // paginateChildRows: true,
    
    // rowSelection: {
    //     mode: 'multiRow',
    //     // checkboxLocation: 'autoGroupColumn',
    //     groupSelects: 'descendants',
    // },
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
    //   { statusPanel: "agTotalAndFilteredRowCountComponent" },
    //   { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
 
};


document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
  gridApi.setGridOption("rowData", rowData);
});


