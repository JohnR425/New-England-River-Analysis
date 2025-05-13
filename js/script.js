//Setup Selection
let selectedState = null;

//Initializing Visualizations
getStates().then(function (data) {
  selectedState = setupTableSelection(data);
  getGagesByState(selectedState).then(function (data) {
    setupMap(data[0]);
    setupTable(data);
    setupGageSummary(data[0]);
    syncFromSliders();

    getStatsByGageID(data[0].site_number, "2010-01-01", "2010-12-31")
    .then(function (data) {
        initializeCharts();
        initializeLegend();
    });
  });
});

