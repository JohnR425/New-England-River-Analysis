/**
 * @param data = array of all gage point objects in the default selected state
 */
function setupGageSummary(data) {
    const textDiv = d3.select("#gage-summary-div");
    let dataArr = Object.entries(data);

    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .classed("selected-gage-title", true)
        .style("font-weight", "bold")
        .text("Selected Gage Point: ");

    //appending site name
    textDiv.append("div")
        .classed("gage-summary", true)
        .classed("heading", true)
        .classed("selected-gage-name", true)
        .text(dataArr[1][1]);

    //site_number, elevation, latitude, longitude
    const staticGageInfo = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1]
    ];

    //5th, 10th, median, 90th, 95th percentile discharge
    const dischargeInfo = [
        dataArr[6][1],
        dataArr[7][1],
        dataArr[8][1],
        dataArr[9][1],
        dataArr[10][1]
    ];
    
    //appending div for storing static gage info
    const staticInfoDiv = textDiv.append("div")
                              .classed("gage-summary", true)
                              .classed("body", true)
                              .classed("gage-summary-basic-info", true);

    //appending div for storing dynamic gage info
    const dynamicInfoDiv = textDiv.append("div")
                              .classed("gage-summary", true)
                              .classed("body", true)
                              .classed("gage-summary-median-info", true);

    populateDivs(staticGageInfo, dischargeInfo);                      
}

function updateGageSummary(data) {
    let dataArr = Object.entries(data);
    d3.select(".selected-gage-name")
        .text(dataArr[1][1]);

    //site_number, elevation, latitude, longitude
    const staticGageInfo = [
        dataArr[0][1],
        dataArr[3][1],
        dataArr[4][1],
        dataArr[5][1]
    ];

    //5th, 10th, median, 90th, 95th percentile discharge
    const dischargeInfo = [
        dataArr[6][1],
        dataArr[7][1],
        dataArr[8][1],
        dataArr[9][1],
        dataArr[10][1]
    ];
    populateDivs(staticGageInfo, dischargeInfo);
    
}

function populateDivs(staticGageInfo, dischargeInfo) {
  //selecting div for storing static gage info
  const staticInfoDiv = d3.select(".gage-summary-basic-info");
  //selecting div for storing dynamic gage info
  const dynamicInfoDiv = d3.select(".gage-summary-median-info");
  
  //populating static info div with text
    staticInfoDiv.selectAll("div")
          .data(staticGageInfo)
          .join("div")
          .attr("class", "gage-summary")
          .html((d, i) => {
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
      
    //populating dynamic info div with text
    dynamicInfoDiv.selectAll("div")
              .data(dischargeInfo)
              .join("div")
              .attr("class", "gage-summary")
              .html((d, i) => {
                  if (i == 0) {
                    return "<strong>5th Percentile Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 1) {
                    return "<strong>10th Percentile Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 2) {
                    return "<strong>Median Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 3) {
                    return "<strong>90th Percentile Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
                  else if (i == 4) {
                    return "<strong>95th Percentile Discharge: </strong> <br>" + d.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ft<sup>3</sup> / sec";
                  }
              });  
}