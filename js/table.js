TABLE_WIDTH = 300
TABLE_HEIGHT = 600

function setupTable (data) {
  //Initialize Table
  d3.select("#table").html("");
    const table = d3.select("#table")
                    .append("table")
                    .attr("id", "gauge-table")
                    .attr("width", TABLE_WIDTH)
                    .attr("height", TABLE_HEIGHT)
                    .style("border", "1px solid black");

    let headers = ["Site Number", "Site Name"];
    let column_names = Object.keys(data[0]).slice(0, 2);
    
    //Initialize Headers
    const tableHead = table.append("thead");
    tableHead.append("tr")
                .selectAll("th")
                .data(headers)
                .enter()
                .append("th")
                .attr("id", "table-head")
                .text(d => d)
    
    //Initialize Rows
    const tableBody = table.append("tbody");
    const rows = tableBody.selectAll("tr")
                        .data(data)
                        .enter()
                        .append("tr")
                        .style("background-color", (d, i) => i == 0 ? "lightblue" : "white")
                        .attr("id", (d, i) => i == 0 ? "selected-gage" : null)
                        //Adding Row Selection on Click
                        .on("click", function(i, d) {
                          //Make all rows except the selected row white
                          d3.selectAll("#table tr").style("background-color", "white")
                                                    .attr("id", null);
                          d3.select(this).style("background-color", "lightblue")
                                          .attr("id", "selected-gage");
                          dataValues = Object.values(d);
                          
                          //Update Line Charts, Gage Summary and highlight point on the map
                          updateLineCharts();
                          updateGageSummary(dataValues);
                          query_point(dataValues[4], dataValues[5], dataValues[0]).then((selected_point) => {
                            highlight_point(selected_point);
                            remove_popup();
                            update_popup(selected_point);
                            display_popup();
                            zoomTo(dataValues[4], dataValues[5]);
                          })
                        });

    //Populate Rows
    rows.selectAll("td")
            .data(gauge => column_names.map(key => gauge[key]))
            .enter()
            .append("td")
            .text(d => d)
            .attr("id", "table-body")
            .style("border", "1px solid black")
            .style("padding", "5px");
}