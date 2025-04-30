

function initializeCharts() {
    setupLineCharts();

    getStatsByGageID("12345", "2010-01-01", "2010-12-31")
        .then(function (data) {
            const validData = data.filter(e => e.mean_discharge != null && e.ppt != null);

            const discharges = validData.map(e => e.mean_discharge);
            const precipitation = validData.map(e => e.ppt);

            updateLineCharts(discharges, precipitation, "Gage Name");
        });
}

// Main function to draw the line chart
function setupLineCharts() {
    // Setup Discharge Chart
    const svgDischarge = d3.select("#line-graph-discharge")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = +svgDischarge.attr("width");
    const height = +svgDischarge.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const gDischarge = svgDischarge.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("id", "chart-group-discharge");

    // Add axis groups
    gDischarge.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    gDischarge.append("g").attr("class", "y-axis");

    // Add line for discharge
    gDischarge.append("path").attr("class", "line-discharge");

    // Add title
    svgDischarge.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Discharge Over Time");

    // Add axis labels
    gDischarge.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .text("Day in 2010");

    gDischarge.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .text("Mean Discharge (m³)");

    // Setup Precipitation Chart
    const svgPrecipitation = d3.select("#line-graph-precipitation")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    const gPrecipitation = svgPrecipitation.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("id", "chart-group-precipitation");

    // Add axis groups
    gPrecipitation.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    gPrecipitation.append("g").attr("class", "y-axis");

    // Add line for precipitation
    gPrecipitation.append("path").attr("class", "line-precip");

    // Add title
    svgPrecipitation.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Precipitation Over Time");

    // Add axis labels
    gPrecipitation.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .text("Day in 2010");

    gPrecipitation.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .text("Precipitation (mm)");
}

function updateDischargeChart(discharges) {
    const svgDischarge = d3.select("#line-graph-discharge").select("svg");

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = +svgDischarge.attr("width");
    const height = +svgDischarge.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, discharges.length - 1])
        .range([0, innerWidth]);

    const yScaleDischarge = d3.scaleLinear()
        .domain([d3.min(discharges), d3.max(discharges)])
        .nice()
        .range([innerHeight, 0]);

    const lineDischarge = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScaleDischarge(d));

    const gDischarge = svgDischarge.select("#chart-group-discharge");

    // Update axes
    gDischarge.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));

    gDischarge.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScaleDischarge));

    // Update discharge line
    gDischarge.select(".line-discharge")
        .datum(discharges)
        .transition()
        .duration(1000)
        .attr("d", lineDischarge)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
}

function updatePrecipitationChart(precipitation) {
    const svgPrecipitation = d3.select("#line-graph-precipitation").select("svg");

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = +svgPrecipitation.attr("width");
    const height = +svgPrecipitation.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, precipitation.length - 1])
        .range([0, innerWidth]);

    const yScalePrecipitation = d3.scaleLinear()
        .domain([d3.min(precipitation), d3.max(precipitation)])
        .nice()
        .range([innerHeight, 0]);

    const linePrecipitation = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScalePrecipitation(d));

    const gPrecipitation = svgPrecipitation.select("#chart-group-precipitation");

    // Update axes
    gPrecipitation.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));

    gPrecipitation.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScalePrecipitation));

    // Update precipitation line
    gPrecipitation.select(".line-precip")
        .datum(precipitation)
        .transition()
        .duration(1000)
        .attr("d", linePrecipitation)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}

/**
 * Note: Filters out Null Values
 */
function updateLineCharts() {
    // Get the selected gage's data from the table
    let dataValues = [];
    d3.select("#selected-gage").selectAll("td").each(function () {
        dataValues.push(d3.select(this).text());
    });
    // Ensure a gage is selected
    if (dataValues.length === 0) {
        console.warn("No gage selected.");
        return;
    }
    // Fetch data for the selected gage
    getStatsByGageID(dataValues[0], "2010-01-01", "2010-12-31")
        .then(function (data) {
            // Filter out rows with null or undefined values
            const validData = data.filter(e =>
                e.mean_discharge != null && e.ppt != null
            );
            const discharges = validData.map(e => e.mean_discharge);
            const precipitation = validData.map(e => e.ppt);

            updateDischargeChart(discharges);
            updatePrecipitationChart(precipitation);
        });
}