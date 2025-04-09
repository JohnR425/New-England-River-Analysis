TABLE_WIDTH = 1200
TABLE_HEIGHT = 1000

d3.json('data/milestone_dummy_data.json').then(function (data) {
    setup(data);
  });

function setup (data) {
    console.log(data);
    const table = d3.select("body")
                    .append("table")
                    .attr("id", "gauge-table")
                    .attr("width", TABLE_WIDTH)
                    .attr("height", TABLE_HEIGHT)
                    .style("border", "1px solid black");

    let headers = Object.keys(data[0]);
    
    const tableHead = table.append("thead");
    tableHead.append("tr")
                .selectAll("th")
                .data(headers)
                .enter()
                .append("th")
                .text(d => d)
    
    const tableBody = table.append("tbody");

    const rows = tableBody.selectAll("tr")
                        .data(data)
                        .enter()
                        .append("tr");
    
    rows.selectAll("td")
            .data(gauge => headers.map(key => gauge[key]))
            .enter()
            .append("td")
            .text(d => d)
            .style("border", "1px solid black")
            .style("padding", "5px");
}