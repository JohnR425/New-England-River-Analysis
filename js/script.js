//Creating Table

let selectedState = d3.select("#state").node().value;

//Setup Table
getGagesByState(selectedState).then(function (data) {
    setupTable(data);
    console.log(selectedState);
  });

//Setup Line Chart
getStatsByGageID("01010070", "2010-01-01", "2010-12-31")
.then(function (data) {
    console.log("data", data);
    let discharges = data.map(elem => {return elem.mean_discharge});
    console.log("discharges", discharges);
    setupLineChart(discharges);
});