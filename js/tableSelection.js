function setupTableSelection (data) {
    //Creating options based on query of States
    d3.select("#state-selector").selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    //Set up initial table
    let initState = d3.select("#state-selector").node().value;
    getGagesByState(initState).then(function (data) {
        setupTable(data);
      });

    //Makes table update whenever the selected state changes
    d3.select("#state-selector").on("change", () => {
      let selectedState = d3.select("#state-selector").node().value;
      getGagesByState(selectedState).then(function (data) {
        setupTable(data);
      });
    });

    return initState;
}