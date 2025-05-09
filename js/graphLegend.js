function initializeLegend(){ 
    // Legend for Discharge Chart
    const legendWidth = 500;
    const legendHeight = 80;

    const svgLegend = d3.select("#discharge-legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    const legendMargin = { left: 0, top: 0 };
    const legendItems = [
        { label: "Top 5% Discharge", color: "rgba(215, 152, 70, 0.3)" },
        { label: "Top 10% Discharge", color: "rgba(218, 192, 157, 0.3)" },
        { label: "Median Discharge", color: "gray" },
        { label: "Bottom 10% Discharge", color: "rgba(70, 130, 180, 0.15)" },
        { label: "Bottom 5% Discharge", color: "rgba(70, 130, 180, 0.3)" },

    ];

    const itemsPerRow = Math.ceil(legendItems.length / 2);
    const itemSpacingX = 160;
    const itemSpacingY = 25;

    const legend = svgLegend.append("g")
        .attr("transform", `translate(${legendMargin.left}, ${legendMargin.top})`);

    legendItems.forEach((item, i) => {
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;

        const g = legend.append("g")
            .attr("transform", `translate(${col * itemSpacingX}, ${row * itemSpacingY})`);

        g.append("rect")
            .attr("width", 18)
            .attr("height", 12)
            .attr("fill", item.color)
            .attr("stroke", item.label.includes("Median") ? item.color : "none");

        g.append("text")
            .attr("x", 24)
            .attr("y", 10)
            .attr("dy", "0.25em")
            .attr("fill", "black")
            .style("font-size", "12px")
            .text(item.label);
    });
}