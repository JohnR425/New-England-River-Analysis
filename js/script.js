const globalApplicationState = {
  map: null
};

//Setup Selection
let selectedState = null;

getStates().then(function (data) {
  selectedState = setupTableSelection(data);
  getGagesByState(selectedState).then(function (data) {
    //Setup Table
    setupMap(data[0]);
    setupTable(data);
    //Setup Gage Summary
    setupGageSummary(data[0]);
    //console.log("TESTTESTSTEST", data[0]);

    getStatsByGageID(data[0].site_number, "2010-01-01", "2010-12-31")
    .then(function (data) {
        let discharges = data.map(elem => {return elem.mean_discharge});
        let precipitation = data.map(elem => {return elem.precipitation});
        initializeCharts();
        initializeLegend();
    });
  });
});

