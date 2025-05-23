
MARGIN = { top: 60, right: 30, bottom: 60, left: 60 };

function initializeCharts() {
    setupLineCharts();
    // initialize with default dates
    getStatsByGageID("01010000", "2010-01-01", "2010-12-31") 
        .then(function (data) {
            //Filtering out null values
            const validData = data.filter(e => e.mean_discharge != null && e.ppt != null);

            const discharges = validData.map(e => e.mean_discharge);
            const precipitation = validData.map(e => e.ppt);

            updateLineCharts(discharges, precipitation, "Gage Name");
        });
}

//Initializing all line chart components
function setupLineCharts() {
    // Setup Discharge Chart
    const svgDischarge = d3.select("#line-graph-discharge")
        .append("svg")
        .attr("width", 650)
        .attr("height", 300);

    const width = +svgDischarge.attr("width");
    const height = +svgDischarge.attr("height");
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    const gDischarge = svgDischarge.append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`)
        .attr("id", "chart-group-discharge");


    //  axis groups
    gDischarge.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    gDischarge.append("g").attr("class", "y-axis");

    //Main Line
    gDischarge.append("path").attr("class", "line-discharge");

    //Shaded areas for each graph region
    gDischarge.append("path").attr("class", "area-top-5");
    gDischarge.append("path").attr("class", "area-bottom-5");
    gDischarge.append("path").attr("class", "area-top-10");
    gDischarge.append("path").attr("class", "area-bottom-10");
    gDischarge.append("path").attr("class", "line-median-discharge");


    // Add title
    svgDischarge.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", MARGIN.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Discharge Over Time");

    // axis labels
    gDischarge.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .text("Date");

    gDischarge.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -43)
        .text("Mean Discharge (ft³/sec)");

    // Setup Precipitation Chart
    const svgPrecipitation = d3.select("#line-graph-precipitation")
        .append("svg")
        .attr("width", 650)
        .attr("height", 300);

    const gPrecipitation = svgPrecipitation.append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`)
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
        .attr("y", MARGIN.top / 2)
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
        .text("Date");

    gPrecipitation.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -43)
        .text("Precipitation (mm)");

    gDischarge.insert("rect", ":first-child")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "white");

    // Add white background to precipitation chart area (between axes)
    gPrecipitation.insert("rect", ":first-child")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "white");
}

function updateDischargeChart(discharges, parsedDates, top_5,bottom_5, top_10, bottom_10, median_disc) {
    const svgDischarge = d3.select("#line-graph-discharge").select("svg");
    const gDischarge = svgDischarge.select("#chart-group-discharge");

    // Clear any previous "No Data Available" message
    svgDischarge.select(".no-data-text").remove();

    // Check if the data is invalid (all nulls or empty or invalid dates entered)
    if (!discharges || discharges.every(d => d === null) || parsedDates.length <= 1) {
        svgDischarge.append("text")
            .attr("class", "no-data-text")
            .attr("x", +svgDischarge.attr("width") / 2)
            .attr("y", +svgDischarge.attr("height") / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .attr("fill", "gray") 
            .text("[No Data Available]");
    }
    
    // Otherwise Update Discharge Graph
    const width = +svgDischarge.attr("width");
    const height = +svgDischarge.attr("height");
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    const xScale = d3.scaleTime()
    .domain(d3.extent(parsedDates))
    .range([0, innerWidth]);

    const yScaleDischarge = d3.scaleLinear()
        .domain([0, d3.max(discharges)])
        .nice()
        .range([innerHeight, 0]);

    const lineDischarge = d3.line()
        .x((d, i) => xScale(parsedDates[i]))
        .y(d => yScaleDischarge(d));

    //THRESHOLD DATA

    //areas:
    const line_top_5 = d3.line().x(d => xScale(d.x)).y(d => yScaleDischarge(d.y));
    const line_bottom_5 = d3.line().x(d => xScale(d.x)).y(d => yScaleDischarge(d.y));
    const line_top_10 = d3.line().x(d => xScale(d.x)).y(d => yScaleDischarge(d.y));
    const line_bottom_10 = d3.line().x(d => xScale(d.x)).y(d => yScaleDischarge(d.y));

    const area_top_5 = d3.area().x(d => xScale(d.x)).y0(d => yScaleDischarge(d.y)).y1(() => 0); // Top boundary (max discharge)
    const area_top_10 = d3.area().x(d => xScale(d.x)).y0(d => yScaleDischarge(d.y)).y1(() => 0); // Top boundary (max discharge)
    const area_bottom_5 = d3.area().x(d => xScale(d.x)).y0(d => yScaleDischarge(d.y)).y1(() => yScaleDischarge(0)); // Bottom Boundary
    const area_bottom_10 = d3.area().x(d => xScale(d.x)).y0(d => yScaleDischarge(d.y)).y1(() => yScaleDischarge(0)); // Bottom Boundary
2010
    const line_median_discharge = d3.line().x(d => xScale(d.x)).y(d => yScaleDischarge(d.y))

    // END THRESHOLD DATA
    
    const dateSpan = (parsedDates[parsedDates.length - 1] - parsedDates[0]) / (1000 * 60 * 60 * 24); // in days
    let xFormat;

    if (dateSpan <= 180) {
        xFormat = d3.timeFormat("%m/%d");
    } else if (dateSpan <= 365) {
        xFormat = d3.timeFormat("%b '%y");
    } else if (dateSpan <= 1460){
        xFormat = d3.timeFormat("%m/%y");
    } else {
        xFormat = d3.timeFormat("%Y");
    }

    // Update discharge axes
    gDischarge.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale).tickFormat(xFormat));

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
        .attr("stroke", "#0D318C")
        .attr("stroke-width", 2);

    const makeConstantLine = (threshold) => [
        { x: parsedDates[0], y: threshold },
        { x: parsedDates[parsedDates.length - 1], y: threshold } 
    ];

    gDischarge.select(".area-top-5")
        .datum(makeConstantLine(top_5))
        .transition()
        .duration(1000)
        .attr("d", top_5 < yScaleDischarge.domain()[1] ? area_top_5:null)
        .attr("fill", "rgba(70, 130, 180, 0.3)")
        .attr("stroke", "none");

    gDischarge.select(".area-bottom-5")
        .datum(makeConstantLine(bottom_5))
        .transition()
        .duration(1000)
        .attr("d", area_bottom_5)
        .attr("fill", "rgba(215, 152, 70, 0.3)")
        .attr("stroke", "none");

    gDischarge.select(".area-top-10")
        .datum(makeConstantLine(top_10))
        .transition()
        .duration(1000)
        .attr("d", top_10 < yScaleDischarge.domain()[1] ? area_top_10: null)
        .attr("fill", "rgba(70, 130, 180, 0.15)")
        .attr("stroke", "none");

    gDischarge.select(".area-bottom-10")
        .datum(makeConstantLine(bottom_10))
        .transition()
        .duration(1000)
        .attr("d", area_bottom_10)
        .attr("fill", "rgba(218, 192, 157, 0.3)")
        .attr("stroke", "none");

    gDischarge.select(".line-median-discharge")
        .datum(makeConstantLine(median_disc))
        .transition()
        .duration(1000)
        .attr("d", line_median_discharge)
        .attr("fill", "none")
        .attr("stroke", "gray") 
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4");

        // HOVERING FUNCTION
        // Add hover interaction
        const hoverLineGroup = gDischarge.append("g")
            .attr("class", "hover-line-group")
            .style("display", "none");

        hoverLineGroup.append("line")
            .attr("class", "hover-line")
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .attr("stroke", "rgba(255, 0, 0, 0.64)")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");

            
        const hoverLabel = hoverLineGroup.append("text")
            .attr("class", "hover-label")
            .attr("text-anchor", "start")
            .attr("dy", "-0.5em")
            .attr("fill", "black") 
            .attr("stroke", "white") 
            .attr("stroke-width", 3) 
            .style("paint-order", "stroke") 
            .style("font-weight", "bold");

            // Add a transparent overlay for capturing mouse events
            gDischarge.append("rect")
            .attr("class", "hover-overlay")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseover", () => hoverLineGroup.style("display", null))
            .on("mouseout", () => hoverLineGroup.style("display", "none"))
            .on("mousemove", function (event) {
                const [mouseX] = d3.pointer(event, this);
                const xDate = xScale.invert(mouseX);
                const bisect = d3.bisector(d => d).left;
                const index = bisect(parsedDates, xDate, 1);
                const startDate = parsedDates[index - 1];
                const endDate = parsedDates[index];
                const closestDate = xDate - startDate > endDate - xDate ? endDate : startDate;
                const closestIndex = parsedDates.indexOf(closestDate);
                const closestValue = discharges[closestIndex];

                const formatDate = d3.timeFormat("%-m/%-d/%y");
                const formattedDate = formatDate(closestDate);

                // Update hover line position
                hoverLineGroup.select(".hover-line")
                    .attr("x1", xScale(closestDate))
                    .attr("x2", xScale(closestDate));

                // Update hover label position and text
                const labelX = xScale(closestDate);
                const labelY = yScaleDischarge(closestValue);
                const labelPadding = 5;
                const labelText = `${closestValue.toFixed(2)}mm - ${formattedDate}`;

                // Estimate text width (~7px per character for 12px font)
                const estimatedTextWidth = labelText.length * 7;
                const maxX = innerWidth;

                //determine whether text label should appear to left or right depending on position within graph:
                let anchor = "start";
                let labelXAdjusted = labelX + labelPadding;
                if (labelX + estimatedTextWidth + labelPadding > maxX) {
                anchor = "end";
                labelXAdjusted = labelX - labelPadding;
                }

                hoverLabel
                    .attr("x", labelXAdjusted)
                    .attr("y", labelY)
                    .attr("text-anchor", anchor)
                    .text(labelText);
            });
}

function updatePrecipitationChart(precipitation, parsedDates) {
    const svgPrecipitation = d3.select("#line-graph-precipitation").select("svg");
    const gPrecipitation = svgPrecipitation.select("#chart-group-precipitation");

    // Clear any previous "No Data Available" message
    svgPrecipitation.select(".no-data-text").remove();

    // Check if the data is invalid (all nulls or empty or invalid dates entered)
    if (!precipitation || precipitation.every(p => p === null) || parsedDates.length <= 1) {
        svgPrecipitation.append("text")
            .attr("class", "no-data-text")
            .attr("x", +svgPrecipitation.attr("width") / 2)
            .attr("y", +svgPrecipitation.attr("height") / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .attr("fill", "gray") 
            .text("[No Data Available]");
    }
    const width = +svgPrecipitation.attr("width");
    const height = +svgPrecipitation.attr("height");
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    
    const xScale = d3.scaleTime()
    .domain(d3.extent(parsedDates))
    .range([0, innerWidth]);

    const yScalePrecipitation = d3.scaleLinear()
        .domain([d3.min(precipitation), d3.max(precipitation)])
        .nice()
        .range([innerHeight, 0]);

    const linePrecipitation = d3.line()
        .x((d, i) => xScale(parsedDates[i]))
        .y(d => yScalePrecipitation(d));

    const dateSpan = (parsedDates[parsedDates.length - 1] - parsedDates[0]) / (1000 * 60 * 60 * 24); // in days
    let xFormat;

    //Different x-axis tick formatting based on dateSpan
    if (dateSpan <= 180) {
        xFormat = d3.timeFormat("%m/%d");
    } else if (dateSpan <= 365) {
        xFormat = d3.timeFormat("%b '%y");
    } else if (dateSpan <= 1460){
        xFormat = d3.timeFormat("%m/%y");
    } else {
        xFormat = d3.timeFormat("%Y");
    }
    
    // Update axes
    gPrecipitation.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale).tickFormat(xFormat));

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
        .attr("stroke", "violet")
        .attr("stroke-width", 2);

    // Add hover interaction
    const hoverLineGroup = gPrecipitation.append("g")
    .attr("class", "hover-line-group")
    .style("display", "none");

    hoverLineGroup.append("line")
        .attr("class", "hover-line")
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 4");

        
    const hoverLabel = hoverLineGroup.append("text")
            .attr("class", "hover-label")
            .attr("text-anchor", "start")
            .attr("dy", "-0.5em")
            .attr("fill", "black") 
            .attr("stroke", "white") 
            .attr("stroke-width", 3) 
            .style("paint-order", "stroke") 
            .style("font-weight", "bold");


        // Add a transparent overlay for capturing mouse events
        gPrecipitation.append("rect")
        .attr("class", "hover-overlay")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseover", () => hoverLineGroup.style("display", null))
        .on("mouseout", () => hoverLineGroup.style("display", "none"))
        .on("mousemove", function (event) {
            const [mouseX] = d3.pointer(event, this);
            const xDate = xScale.invert(mouseX); // Get the date corresponding to the mouse position
            const bisect = d3.bisector(d => d).left;
            const index = bisect(parsedDates, xDate, 1);
            const startDate = parsedDates[index - 1];
            const endDate = parsedDates[index];
            const closestDate = xDate - startDate > endDate - xDate ? endDate : startDate;
            const closestIndex = parsedDates.indexOf(closestDate);
            const closestValue = precipitation[closestIndex];

            const formatDate = d3.timeFormat("%-m/%-d/%y");
            const formattedDate = formatDate(closestDate);

            // Update hover line position
                hoverLineGroup.select(".hover-line")
                    .attr("x1", xScale(closestDate))
                    .attr("x2", xScale(closestDate));

                // Update hover label position and text
                const labelX = xScale(closestDate);
                const labelY = yScalePrecipitation(closestValue);
                const labelPadding = 5;
                const labelText = `${closestValue.toFixed(2)}mm - ${formattedDate}`;

                // Estimate text width (~7px per character for 12px font)
                const estimatedTextWidth = labelText.length * 7;
                const maxX = innerWidth;

                //determine whether text label should appear to left or right depending on position within graph:
                let anchor = "start";
                let labelXAdjusted = labelX + labelPadding;
                if (labelX + estimatedTextWidth + labelPadding > maxX) {
                anchor = "end";
                labelXAdjusted = labelX - labelPadding;
                }

                hoverLabel
                    .attr("x", labelXAdjusted)
                    .attr("y", labelY)
                    .attr("text-anchor", anchor)
                    .text(labelText);
        });
}

/**
 * Note: Filters out Null Values
 */
function updateLineCharts() {
    // Get the selected gage's data from the table
    let dataValues = [];
    let startDate =  d3.select("#startDateLabel").text() || "2010-01-01" // default
    let endDate = d3.select("#endDateLabel").text()  || "2010-12-31" // default 

    d3.select("#selected-gage").selectAll("td").each(function () {
        dataValues.push(d3.select(this).text());
    });

    // console.log("START DATE", startDate)
    // console.log("END DATE", endDate)

    // Ensure a gage is selected
    if (dataValues.length === 0) {
        console.warn("No gage selected.");
        return;
    }

    // Fetch data for the selected gage
    getStatsByGageID(dataValues[0], startDate, endDate)
        .then(function (dateData) {

            // Filter out rows with null or undefined values
            const validDateData = dateData.filter(e =>
                e.mean_discharge != null && e.ppt != null
            );
            const dates = validDateData.map(e => new Date(e.date)); // Parse to Date objects
            const discharges = validDateData.map(e => e.mean_discharge);
            const precipitation = validDateData.map(e => e.ppt);

            // then, get gage data
            getGageInfoByGageID(dataValues[0])
                .then((gageData)=> {
                    updateDischargeChart(discharges, dates, gageData.top_5, gageData.bottom_5, gageData.top_10,gageData.bottom_10,gageData.median_discharge);
                    updatePrecipitationChart(precipitation, dates);
                })
        });
}