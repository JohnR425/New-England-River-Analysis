// Main function to draw the line chart
function setupLineChart() {
    const svg = d3.select("#line-graph")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("id", "chart-group");

    // Add axis groups
    g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    g.append("g").attr("class", "y-axis");

    // Add lines
    g.append("path").attr("class", "line-discharge");
    g.append("path").attr("class", "line-precip");

    // Add title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold");

    // Add axis labels
    g.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .text("Day in 2010");

    g.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .text("Mean Discharge (m³)");
}


function updateLineChartData(dischargeData, precipData, gageName) {
    const svg = d3.select("#line-graph").select("svg");
    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dischargeData, (d, i) => i))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([Math.min(d3.min(dischargeData), d3.min(precipData)),
                 Math.max(d3.max(dischargeData), d3.max(precipData))])
        .range([innerHeight, 0]);

    const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

    const g = svg.select("#chart-group");

    // Update axes
    g.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));

    g.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    // Update title
    svg.select(".chart-title")
        .text(`Discharge and Precipitation for ${gageName}`);

    // Update lines with transitions
    g.select(".line-discharge")
        .datum(dischargeData)
        .transition()
        .duration(1000)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    g.select(".line-precip")
        .datum(precipData)
        .transition()
        .duration(1000)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}


/**
 * Note: Filters out Null Values
 */
function updateLineChart() {
    let dataValues = [];
    d3.select("#selected-gage").selectAll("td").each(function() {
        dataValues.push(d3.select(this).text());
    });

    getStatsByGageID(dataValues[0], "2010-01-01", "2010-12-31")
        .then(function (data) {
            // Filter out rows with null or undefined values
            const validData = data.filter(e =>
                e.mean_discharge != null && e.ppt != null
            );

            const discharges = validData.map(e => e.mean_discharge);
            const precipitation = validData.map(e => e.ppt);

            updateLineChartData(discharges, precipitation, dataValues[1]); // assuming gage name is at index 1
        });
}