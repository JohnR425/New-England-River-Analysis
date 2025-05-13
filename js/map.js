MAP = null

//Load the map
function setupMap (firstPoint) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlczM1MiIsImEiOiJjbTlpcjkzMzgwM2gyMmxvbzI2Z3VzaDZpIn0.k9Y1IUGkNfSlEptHSO6_Yw';
    //Create map from mapbox
    MAP = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/charles352/cm9xdvck5002w01s5hy909jue',
        center: [-70.661557, 43.893748],
        zoom: 5.5 
    });
    //Declare popup in outerscope
    current_popup = null;
    //Set up highlight layer which will be updated as the user clicks on gauges.
    MAP.on('load', () => {
        MAP.addSource('highlight-source', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });
        MAP.addLayer({
            id: 'highlight-layer',
            type: 'circle',
            source: 'highlight-source',
            paint: {
                'circle-radius': ['get', 'highlightSize'], //radius of points on layer = highlightSize (defined when highlighting point)
                'circle-color': '#ff0000',  // red highlight
                'circle-stroke-width': 3,
                'circle-stroke-color': '#000000' //white outline
            }
        });
        //Automatically select the first point, zooming, highlighting and displaying its popup
        query_point(firstPoint.latitude, firstPoint.longitude, firstPoint.site_number).then((selected_point) => {
                            highlight_point(selected_point)
                            remove_popup()
                            update_popup(selected_point)
                            display_popup()
                            zoomTo(firstPoint.latitude, firstPoint.longitude)
                        })
        //Add zoom in/out buttons to map
        MAP.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-left');

    })

    //Event click to display pop-up, extract feature info, highlight point
    MAP.on('click', (event) => {
        // If the user clicked on one of your markers, get its information.
        const features = MAP.queryRenderedFeatures(event.point, {
            layers: ['gage-mapboxver-8ywpgf'] // replace with layer name
        });
        //If no feature is selected return the function
        if (!features.length) {
            console.log("No feature selected!")
            return;
        }
        const feature = features[0];
        //Display the popup corresponding to the clicked point:
        update_popup(feature)
        current_popup.addTo(MAP)
        //Highlight the selected point:
        highlight_point(feature)
        //Highlight corresponding row on table
        getGagesByState(feature.properties["State"]).then(function (data) {
            setupTable(data);
            d3.select("#state-selector")
            .property("value", feature.properties["State"]);
            const searchText = feature.properties["Site_Number"];
            d3.selectAll("#gauge-table tr").each(function() {
                const row = d3.select(this);
                if (row.text().includes(searchText)) {
                    row.dispatch("click");
                    row.node().scrollIntoView({ behavior: "smooth", block: "end" });
                }
            });
        });
    });

//Create the map legend
//Make legend container
const legend = d3.select("#map").append('div')
                                .attr("id", "Map-Legend")
                                .style("position", "absolute")
                                .style("bottom", "40px")
                                .style("left", "300px")
                                .style("background", "white")
                                .style("padding", "10px")
                                .style("font-size", "12px")
                                .style("border-radius", "4px")
                                .style("box-shadow", "0 0 5px rgba(0,0,0,0.3)")
                                .style("z-index", "1000")
                                .style("width", "160px")
                                .style("text-align", "center")
                                .style("opacity", "0.2");
//Create mouseover/mouseout events to chance opacity of legend
d3.select("#Map-Legend").on("mouseover", function() {
    d3.select(this)
    .transition()
    .duration(100)
    .style("opacity", "1");
})
d3.select("#Map-Legend").on("mouseout", function() {
    d3.select(this)
    .transition()
    .duration(100)
    .style("opacity", "0.2");
})
//Title of Legend
const title = d3.select("#Map-Legend").append('div')
                                        .text('Median Discharge (ft³/s)')
                                        .style('font-weight', 'bold')
                                        .style('margin-bottom', '8px');
//Gradient bar
d3.select("#Map-Legend")
  .append("div")
  .style("position", "absolute")
  .style("height", "100px")
  .style("width", "12px")
  .style("top", "39px")
  .style("left", "28px")
  .style("border", "2px solid black")
  .style("background", "linear-gradient(to top, #ffffcc, #bef1fe, #2c83fc, #021464)");

//Set parameters for circles
const maxValue = 14000;
const minValue = 0;
const steps = 3;
const maxPixelSize = 20
const minPixelSize = 5

//Generate largest to smallest circles
for (let i = steps; i >= 1; i--) {
  const value = Math.round((i - 1) * maxValue / (steps - 1));
  const radius = minPixelSize + ((i - 1) * (maxPixelSize - minPixelSize) / (steps - 1));

    // Create the wrapper
    const wrapper = d3.select("#Map-Legend")
                        .append("div")
                        .style("position", "relative")
                        .style("height", `${radius * 2}px`)
                        .style("margin-bottom", "15px");

    // Create the circle
    const circle = wrapper.append("div")
                            .style("position", "absolute")
                            .style("top", "50%")
                            .style("left", "50%")
                            .style("transform", "translate(-50%, -50%)")
                            .style("width", `${radius * 2}px`)
                            .style("height", `${radius * 2}px`)
                            .style("border-radius", "50%")
                            .style("background", "rgba(49,130,189,0.6)")
                            .style("border", "2px solid black");

    // Create the label
    const label = wrapper.append("div")
                            .text(value.toLocaleString())
                            .style("position", "absolute")
                            .style("top", "50%")
                            .style("left", "70%")
                            .style("transform", "translateY(-50%)")
                            .style("white-space", "nowrap");
}
}

//Helper Functions
//Load up highlight_point function
    function highlight_point(point_feature) {
        const draw_radius = point_feature.layer.paint["circle-radius"]
        MAP.getSource('highlight-source').setData({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: point_feature.geometry,
                properties: {
                    highlightSize: draw_radius
                }
            }]
        });
    } 

    //Using lon/lat and site_code to get singular point feature
    async function query_point(lat, lon, site_code) {
        return await query_point_helper(lat, lon, site_code);
    }

    function query_point_helper(lat, lon, site_code){
        const point = MAP.project([lon, lat]);
        var features = MAP.queryRenderedFeatures(point, {
            layers: ['gage-mapboxver-8ywpgf'],
            filter: ['==', 'Site_Number', site_code]
        });
        if (!features.length) {
            zoomTo(lat, lon)
            console.log("The point wasn't rendered yet")
            return new Promise((resolve) => {
                setTimeout(() => {
                    const point = MAP.project([lon, lat]);
                    const features2 = MAP.queryRenderedFeatures(point, {
                        layers: ['gage-mapboxver-8ywpgf'],
                        filter: ['==', 'Site_Number', site_code]
                    });
                    //console.log(features2[0])
                    resolve(features2[0]);
                }, 1000);
            })
        }
        return features[0];
    }

    //Display the Pop up of the given point on the map
    function update_popup(point_feature){
        const popup = new mapboxgl.Popup({ offset: [0, 0], })
        .setLngLat(point_feature.geometry.coordinates)
        .setHTML(
            `<h3>${point_feature.properties["Site_Name"]}</h3>
            <p>This gauge has an elevation of ${point_feature.properties["Elevation_(ft)"]} ft and it located at ${point_feature.properties["Latitude"].toFixed(2)} N, ${point_feature.properties["Longitude"].toFixed(2)} E in ${point_feature.properties["State"]}</p>
            <p>95th Percentile Discharge: ${point_feature.properties["top_5%"].toFixed(1)} cubic ft per second</p>
            <p>90th Percentile Discharge: ${point_feature.properties["top_10%"].toFixed(1)} cubic ft per second</p>
            <p>50th Percentile Discharge: ${point_feature.properties["Median_Discharge_(cubic_ft/sec)"].toFixed(1)} cubic ft per second</p>
            <p>10th Percentile Discharge: ${point_feature.properties["bottom_10%"].toFixed(1)} cubic ft per second</p>
            <p>5th Percentile Discharge: ${point_feature.properties["bottom_5%"].toFixed(1)} cubic ft per second</p>`
        );

        popup.on('open', () => {
            popup.getElement().style.opacity = '0.90'
        });

        current_popup = popup;
    }

    function display_popup() {
        current_popup.addTo(MAP);
    }

    function remove_popup() {
        if (current_popup) {
            current_popup.remove();
        }
    }

    //Zooms to given point 
    function zoomTo(lat, lon) {
        MAP.flyTo({
            center: [lon, lat],
            speed: 1,
            curve: 1.4, 
            duration: 1000
        });
    }