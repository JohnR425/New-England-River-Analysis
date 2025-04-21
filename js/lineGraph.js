// Main function to draw the line chart
    function setupLineChart(dischargeData, precipData) {
        //Remove previous line graphs
        d3.select("#line-graph").selectAll("svg").remove();

        const svg = d3.select("#line-graph")
                        .append("svg")
                        .attr("width", 600)
                        .attr("height", 400);
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const xAxisLabels = 10

        // Clear previous content
        svg.selectAll("*").remove();

        const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set scales
        const xScale = d3.scaleLinear()
        .domain(d3.extent(dischargeData, (d, i) => i))
        .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
        .domain([d3.min(dischargeData), d3.max(dischargeData)])
        .range([innerHeight, 0]);

        // Define line generator
        const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

        // X-axis
        g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(xAxisLabels));

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + margin.bottom-20)
            .text("Day in 2010")
            .style("font-size", "12px")
            .style("fill", "#000000")

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-90)`)
            .attr("x", -innerHeight / 2)
            .attr("y", -margin.left + 10) 
            .text("Mean Discharge (m^3)") 
            .style("font-size", "12px")
            .style("fill", "#000000");


        // Y-axis
        g.append("g")
        .call(d3.axisLeft(yScale));

        // Discharge
        g.append("path")
        .datum(dischargeData)
        .attr("class", "line")
        .attr("d", line);

        // Precipitation
        g.append("path")
        .datum(precipData)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "red");
    }

    //Updates line chart when a new criteria has been selected
    function updateLineChart() {
        //dataValues is an array containing the string values containining data for each corresponding column for an entry
        let dataValues = [];
        d3.select("#selected-gage").selectAll("td").each(function() {
            dataValues.push(d3.select(this).text());
        });

        getStatsByGageID(dataValues[0], "2010-01-01", "2010-12-31")
            .then(function (data) {
                console.log("data", data);
                let discharges = data.map(elem => {return elem.mean_discharge});
                let precipitation = data.map(elem => {return elem.ppt});
                console.log("discharges", discharges);
                console.log("precip", precipitation);
                setupLineChart(discharges, precipitation);
            });
    }