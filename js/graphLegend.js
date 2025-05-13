function initializeLegend(){ 
    const legendWidth = 620;
    const legendHeight = 40; // increased for 2 rows

    const svgLegend = d3.select("#discharge-legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    const legendItems = [
        { label: "95th Percentile Discharge", color: "#B3CCE0" },
        { label: "90th Percentile Discharge", color: "rgba(70, 130, 180, 0.15)" },
        { label: "Median Discharge", color: "gray" },
        { label: "10th Percentile Discharge", color: "rgba(218, 192, 157, 0.3)" },
        { label: "5th Percentile Discharge", color: "#ECD6BA" },
    ];

    const itemsPerRow = 3;
    const itemSpacingX = 200;
    const itemSpacingY = 20;

    const legend = svgLegend.append("g");

    legendItems.forEach((item, i) => {
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;

        const g = legend.append("g")
            .attr("transform", `translate(${col * itemSpacingX}, ${row * itemSpacingY})`);

        g.append("rect")
            .attr("width", 18)
            .attr("height", 12)
            .attr("fill", item.color)
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        g.append("text")
            .attr("x", 24)
            .attr("y", 10)
            .attr("fill", "black")
            .style("font-size", "12px")
            .text(item.label);
    });
}
