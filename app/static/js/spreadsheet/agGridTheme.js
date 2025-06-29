const myTheme = agGrid.themeQuartz
    .withParams(
        {
            pinnedRowBorder: {
                width: 2,
            }
        }
    )
    .withParams(
        {
            // backgroundColor: "#2b3035",
            backgroundColor: "#212529",
            //   foregroundColor: "rgb(126, 46, 132)",
            //   headerTextColor: "rgb(204, 245, 172)",
            headerBackgroundColor: "rgba(57,63,69,255)",
            oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
            //   headerColumnResizeHandleColor: "rgb(126, 46, 132)",
        },
        "dark",
    )
    .withPart(
        agGrid.iconOverrides({
            type: "image",
            mask: true,
            icons: {
                // map of icon names to images
                "custom-stats": {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g stroke="#7F8C8D" fill="none" fill-rule="evenodd"><path d="M10.5 6V4.5h-5v.532a1 1 0 0 0 .36.768l1.718 1.432a1 1 0 0 1 0 1.536L5.86 10.2a1 1 0 0 0-.36.768v.532h5V10"/><rect x="1.5" y="1.5" width="13" height="13" rx="2"/></g></svg>',
                },
            },
        }),
    );