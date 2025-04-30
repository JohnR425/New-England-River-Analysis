TABLE_WIDTH = 800
TABLE_HEIGHT = 1000

function setupTable (data) {
  d3.select("#table").html("");
    const table = d3.select("#table")
                    .append("table")
                    .attr("id", "gauge-table")
                    .attr("width", TABLE_WIDTH)
                    .attr("height", TABLE_HEIGHT)
                    .style("border", "1px solid black");

    let headers = Object.keys(data[0]).slice(0, 6);
    
    const tableHead = table.append("thead");
    tableHead.append("tr")
                .selectAll("th")
                .data(headers)
                .enter()
                .append("th")
                .text(d => d)
    
    const tableBody = table.append("tbody");

    const rows = tableBody.selectAll("tr")
                        .data(data.slice(0, 6))
                        .enter()
                        .append("tr")
                        .style("background-color", (d, i) => i == 0 ? "lightblue" : "white")
                        .attr("id", (d, i) => i == 0 ? "selected-gage" : null)
                        //Adding Row Selection on Click
                        .on("click", function() {
                          d3.selectAll("#table tr").style("background-color", "white")
                                                    .attr("id", null);
                          
                          d3.select(this).style("background-color", "lightblue")
                                          .attr("id", "selected-gage");
                          
                          //Accessing the data in the selected row:
                          let dataValues = [];
                          d3.select("#selected-gage").selectAll("td").each(function() {
                            dataValues.push(d3.select(this).text());
                          });
                          
                          updateLineCharts();
                          updateGageSummary(dataValues);
                        });

    rows.selectAll("td")
            .data(gauge => headers.map(key => gauge[key]))
            .enter()
            .append("td")
            .text(d => d)
            .style("border", "1px solid black")
            .style("padding", "5px");
}