function setupGageSummary(data) {
    const textDiv = d3.select("#gage-summary");

    console.log(Object.entries(data));
    let dataArr = Object.entries(data);

    //site_name
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .style("font-weight", "bold")
        .text("Selected Gage Point: ");

    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .text(dataArr[1][1]);

    //site_number, elevation, lat, long.
    const newDataOrder = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1],
    ];
    
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("body", true)
        .selectAll("div")
        .data(newDataOrder)
        .enter()
        .append("div")
        .attr("class", "gage-summary")
        .text((d, i) => {
            console.log(d);
            if (i == 0) {
              return "Site Number: " + d;
            }
            else if (i == 1) {
              return "Elevation (ft): " + d;
            }
            else if (i == 2) {
              return "Latitude: " + d;
            }
            else if (i == 3) {
              return "Longitude: " + d;
            }
        });                     
    
}

function updateGageSummary(data) {
  const textDiv = d3.select("#gage-summary");
  textDiv.selectAll("*").remove();

    console.log(Object.entries(data));
    let dataArr = Object.entries(data);

    //site_name
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .style("font-weight", "bold")
        .text("Selected Gage Point: ");

    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .text(dataArr[1][1]);

    //site_number, elevation, lat, long.
    const newDataOrder = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1],
    ];
    
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("body", true)
        .selectAll("div")
        .data(newDataOrder)
        .enter()
        .append("div")
        .attr("class", "gage-summary")
        .text((d, i) => {
            console.log(d);
            if (i == 0) {
              return "Site Number: " + d;
            }
            else if (i == 1) {
              return "Elevation (ft): " + d;
            }
            else if (i == 2) {
              return "Latitude: " + d;
            }
            else if (i == 3) {
              return "Longitude: " + d;
            }
        });    
}