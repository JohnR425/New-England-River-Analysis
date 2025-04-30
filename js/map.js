//'accessToken'
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlczM1MiIsImEiOiJjbTlpcjkzMzgwM2gyMmxvbzI2Z3VzaDZpIn0.k9Y1IUGkNfSlEptHSO6_Yw';
const map = new mapboxgl.Map({
    container: 'map',
    //STYLE_URL
    style: 'mapbox://styles/charles352/cm9xdvck5002w01s5hy909jue',
    center: [-70.661557, 43.893748],
    zoom: 5.5 
});


//Set up highlight layer: 
//let point_radius = 10
map.on('load', () => {
    console.log('A load event occurred.')
    map.addSource('highlight-source', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    });
    map.addLayer({
        id: 'highlight-layer',
        type: 'circle',
        source: 'highlight-source',
        paint: {
            'circle-radius': ['get', 'highlightSize'], //radius of points on layer = highlightsize (defined when highlighting point)
            'circle-color': '#ff0000',  // red highlight
            'circle-stroke-width': 3,
            'circle-stroke-color': '#000000' //white outline
        }
    });
})


//Event click to display pop-up, extract feature info, highlight point
map.on('click', (event) => {
    // If the user clicked on one of your markers, get its information.
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['gage-mapboxver-8ywpgf'] // replace with layer name
    });
    //If no feature is selected return the function
    if (!features.length) {
        console.log("No feature selected!")
        return;
    }
    const feature = features[0];

    /*
    Create a popup, specify its options
    and properties, and add it to the map.
    */
    // create the popup
    const popup = new mapboxgl.Popup({ offset: [0, 0], })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
        `<h3>${feature.properties["Site_Name"]}</h3>
        <p>This gauge has an elevation of ${feature.properties["Elevation_(ft)"]} ft and it located at ${feature.properties["Latitude"].toFixed(2)} N, ${feature.properties["Longitude"].toFixed(2)} E in ${feature.properties["State"]}</p>
        <p>Top 5% Flow: ${feature.properties["top_5%"].toFixed(1)} cubic ft per second</p>
        <p>Top 10% Flow: ${feature.properties["top_10%"].toFixed(1)} cubic ft per second</p>
        <p>Top 50% Flow: ${feature.properties["Median_Discharge_(cubic_ft/sec)"].toFixed(1)} cubic ft per second</p>
        <p>Top 90% Flow: ${feature.properties["bottom_10%"].toFixed(1)} cubic ft per second</p>
        <p>Top 95% Flow: ${feature.properties["bottom_5%"].toFixed(1)} cubic ft per second</p>`
    ).addTo(map)
    console.log(popup)
    //map.setPaintProperty(feature.id, 'fill-opacity', 1)

    popup.on('open', () => {
        popup.getElement().style.transition = 'opacity 0.5s ease';
        popup.getElement().style.opacity = '0';
        void popup.getElement().offsetWidth();
        popup.getElement().style.opacity = '0.90'

    });
    //Highlight the selected point:
    const draw_radius = feature.layer.paint["circle-radius"] //size of selected point
    //modify highlight layer
    map.getSource('highlight-source').setData({
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: feature.geometry,
            properties: {
                highlightSize: draw_radius
            }
    }]
    });
    
    //Extract site number of selected pop-up
    console.log(feature.properties["Site_Number"]);

    console.log(feature.properties["State"]);
    getGagesByState(feature.properties["State"]).then(function (data) {
        setupTable(data);
        d3.select("#state-selector")
        .property("value", feature.properties["State"]);

        const searchText = feature.properties["Site_Number"];

        d3.selectAll("#gauge-table tr").each(function() {
            const row = d3.select(this);
            if (row.text().includes(searchText)) {
            console.log("Found row:", row.node());
            // You can style it, remove it, etc.
            row.style("background-color", "yellow");
            }
        });
      });
});