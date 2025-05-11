function setupGageSummary(data) {
    const textDiv = d3.select("#gage-summary");

    console.log(Object.entries(data));
    let dataArr = Object.entries(data);
    console.log("DATA ARR", dataArr);

    //site_name
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .classed("selected-gage-title", true)
        .style("font-weight", "bold")
        .text("Selected Gage Point: ");

    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .classed("selected-gage-name", true)
        .text(dataArr[1][1]);

    //site_number, elevation, lat, long.
    const staticGageInfo = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1]
    ];
    console.log("STATIC ARR", staticGageInfo);

    const dischargeInfo = [
        dataArr[6][1],
        dataArr[7][1],
        dataArr[8][1],
        dataArr[9][1],
        dataArr[10][1]
    ];
    console.log("DISCHARGE ARR", dischargeInfo);
    
    const bodyLine1 = textDiv.append("div")
                              .classed("gage-summary", true)
                              .classed("body", true)
                              .classed("gage-summary-basic-info", true);

    const bodyLine2 = textDiv.append("div")
                              .classed("gage-summary", true)
                              .classed("body", true)
                              .classed("gage-summary-median-info", true);

    bodyLine1.selectAll("div")
          .data(staticGageInfo)
          .enter()
          .append("div")
          .attr("class", "gage-summary")
          .html((d, i) => {
              console.log(d);
              if (i == 0) {
                return "<strong>Site Number:</strong> <br>" + d;
              }
              else if (i == 1) {
                return "<strong>Elevation (ft):</strong> <br>" + d;
              }
              else if (i == 2) {
                return "<strong>Latitude: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " N";
              }
              else if (i == 3) {
                return "<strong>Longitude: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " E";
              }
          });
      
    bodyLine2.selectAll("div")
              .data(dischargeInfo)
              .enter()
              .append("div")
              .attr("class", "gage-summary")
              .html((d, i) => {
                  console.log(d);
                  if (i == 0) {
                    return "<strong>Bottom 5% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 1) {
                    return "<strong>Bottom 10% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 2) {
                    return "<strong>Median Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 3) {
                    return "<strong>Top 10% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 4) {
                    return "<strong>Top 5% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
              });                       
}

function updateGageSummary(data) {
  const textDiv = d3.select("#gage-summary");

    let dataArr = Object.entries(data);
    console.log("DATA ARR", dataArr);

    d3.select(".selected-gage-name")
        .text(dataArr[1][1]);

    //site_number, elevation, lat, long.
    const staticGageInfo = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1]
    ];
    console.log("STATIC ARR", staticGageInfo);

    const dischargeInfo = [
        dataArr[6][1],
        dataArr[7][1],
        dataArr[8][1],
        dataArr[9][1],
        dataArr[10][1]
    ];

    console.log("DISCHARGE ARR", dischargeInfo);
    
    const bodyLine1 = d3.select(".gage-summary-basic-info");
    const bodyLine2 = d3.select(".gage-summary-median-info");

    bodyLine1.selectAll("div")
          .data(staticGageInfo)
          .join("div")
          .attr("class", "gage-summary")
          .html((d, i) => {
              console.log(d);
              if (i == 0) {
                return "<strong>Site Number:</strong> <br>" + d;
              }
              else if (i == 1) {
                return "<strong>Elevation (ft):</strong> <br>" + d;
              }
              else if (i == 2) {
                return "<strong>Latitude: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " N";
              }
              else if (i == 3) {
                return "<strong>Longitude: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " E";
              }
          });
      
    bodyLine2.selectAll("div")
              .data(dischargeInfo)
              .join("div")
              .attr("class", "gage-summary")
              .html((d, i) => {
                  console.log(d);
                  if (i == 0) {
                    return "<strong>Bottom 5% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 1) {
                    return "<strong>Bottom 10% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 2) {
                    return "<strong>Median Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 3) {
                    return "<strong>Top 10% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 4) {
                    return "<strong>Top 5% Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
              });  
}