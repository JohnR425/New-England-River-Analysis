MAP = null

function setupMap (firstPoint) {
    //'accessToken'
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlczM1MiIsImEiOiJjbTlpcjkzMzgwM2gyMmxvbzI2Z3VzaDZpIn0.k9Y1IUGkNfSlEptHSO6_Yw';
    MAP = new mapboxgl.Map({
        container: 'map',
        //STYLE_URL
        style: 'mapbox://styles/charles352/cm9xdvck5002w01s5hy909jue',
        center: [-70.661557, 43.893748],
        zoom: 5.5 
    });
    //Declare popup in outerscope
    current_popup = null;
    //Set up highlight layer: 
    //let point_radius = 10
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
                'circle-radius': ['get', 'highlightSize'], //radius of points on layer = highlightsize (defined when highlighting point)
                'circle-color': '#ff0000',  // red highlight
                'circle-stroke-width': 3,
                'circle-stroke-color': '#000000' //white outline
            }
        });

        query_point(firstPoint.latitude, firstPoint.longitude, firstPoint.site_number).then((selected_point) => {
                            console.log(selected_point)
                            highlight_point(selected_point)
                            remove_popup()
                            update_popup(selected_point)
                            display_popup()
                            zoomTo(firstPoint.latitude, firstPoint.longitude)
                          })

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

        // /*
        // Create a popup, specify its options
        // and properties, and add it to the map.
        // */
        // // create the popup
        // const popup = new mapboxgl.Popup({ offset: [0, 0], })
        // .setLngLat(feature.geometry.coordinates)
        // .setHTML(
        //     `<h3>${feature.properties["Site_Name"]}</h3>
        //     <p>This gauge has an elevation of ${feature.properties["Elevation_(ft)"]} ft and it located at ${feature.properties["Latitude"].toFixed(2)} N, ${feature.properties["Longitude"].toFixed(2)} E in ${feature.properties["State"]}</p>
        //     <p>Top 5% Flow: ${feature.properties["top_5%"].toFixed(1)} cubic ft per second</p>
        //     <p>Top 10% Flow: ${feature.properties["top_10%"].toFixed(1)} cubic ft per second</p>
        //     <p>Top 50% Flow: ${feature.properties["Median_Discharge_(cubic_ft/sec)"].toFixed(1)} cubic ft per second</p>
        //     <p>Top 90% Flow: ${feature.properties["bottom_10%"].toFixed(1)} cubic ft per second</p>
        //     <p>Top 95% Flow: ${feature.properties["bottom_5%"].toFixed(1)} cubic ft per second</p>`
        // ).addTo(map)
        // //map.setPaintProperty(feature.id, 'fill-opacity', 1)

        // popup.on('open', () => {
        //     popup.getElement().style.transition = 'opacity 0.5s ease';
        //     popup.getElement().style.opacity = '0';
        //     void popup.getElement().offsetWidth();
        //     popup.getElement().style.opacity = '0.90'

        // });
        update_popup(feature)
        current_popup.addTo(MAP)

        //Highlight the selected point:
        highlight_point(feature)
        
        // const draw_radius = feature.layer.paint["circle-radius"] //size of selected point
        // //modify highlight layer
        // map.getSource('highlight-source').setData({
        //     type: 'FeatureCollection',
        //     features: [{
        //         type: 'Feature',
        //         geometry: feature.geometry,
        //         properties: {
        //             highlightSize: draw_radius
        //         }
        //     }]
        // });
        
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
                    row.dispatch("click");
                    row.node().scrollIntoView({ behavior: "smooth", block: "end" });
                }
            });
        });
    });

const legend = document.createElement('div');
legend.id = "Map-Legend"
legend.style.position = 'absolute';
legend.style.bottom = '40px';
legend.style.left = '400px';
legend.style.background = 'white';
legend.style.padding = '10px';
legend.style.fontSize = '12px';
legend.style.borderRadius = '4px';
legend.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
legend.style.zIndex = '1000';
legend.style.width = '160px';
legend.style.textAlign = 'center';
legend.style.opacity = '0.2'
document.getElementById('map').appendChild(legend);

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

// Title
const title = document.createElement('div');
title.textContent = 'Median Discharge (ft³/s)';
title.style.fontWeight = 'bold';
title.style.marginBottom = '8px';
legend.appendChild(title);

// Values for circles
const maxValue = 14000;
const minValue = 0;
const steps = 5;
const maxPixelSize = 20
const minPixelSize = 5

// Gradient bar
const bar = document.createElement('div');
bar.style.position = 'absolute'
bar.style.height = '185px';
bar.style.width = '12px'
bar.style.top = '39px'
bar.style.left = '28px'
bar.style.border = '2px solid black'
// bar.style.borderRadius = '3px';
// bar.style.marginBottom = '5px';
bar.style.background = 'linear-gradient(to top, #ffffcc, #bef1fe,  #2c83fc, #021464)';
legend.appendChild(bar);

// Generate largest to smallest circles
for (let i = steps; i >= 1; i--) {
  const value = Math.round((i-1) * maxValue/(steps-1));
  const radius = minPixelSize + ((i-1)*(maxPixelSize-minPixelSize)/(steps-1)); // visually scaled size

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.height = `${radius * 2}px`;
    wrapper.style.marginBottom = '15px'; // overlap the circles a bit

    const circle = document.createElement('div');
    circle.style.position = 'absolute';          // position inside wrapper
    circle.style.top = '50%';
    circle.style.left = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.width = `${radius * 2}px`;
    circle.style.height = `${radius * 2}px`;
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(49,130,189,0.6)';
    circle.style.border = '2px solid black'
    wrapper.appendChild(circle);

    const label = document.createElement('div');
    label.textContent = value.toLocaleString();
    label.style.position = 'absolute';
    label.style.top = '50%';
    label.style.left = '70%';
    label.style.transform = 'translateY(-50%)';
    label.style.whiteSpace = 'nowrap';
    wrapper.appendChild(label);

    wrapper.appendChild(label);
    legend.appendChild(wrapper);
}



    return MAP;
}

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
        return await query_point_helper(lat, lon, site_code)
    }

    function query_point_helper(lat, lon, site_code){
        const point = MAP.project([lon, lat]);
        var features = MAP.queryRenderedFeatures(point, {
            layers: ['gage-mapboxver-8ywpgf'],
            filter: ['==', 'Site_Number', site_code]
        });
        if (!features.length) {
            zoomTo(lat, lon)
            console.log("Oops! The point wasn't rendered yet, can you try that again?")
            return new Promise((resolve) => {
                setTimeout(() => {
                    const point = MAP.project([lon, lat]);
                    const features2 = MAP.queryRenderedFeatures(point, {
                        layers: ['gage-mapboxver-8ywpgf'],
                        filter: ['==', 'Site_Number', site_code]
                    });
                    console.log(features2[0])
                    resolve(features2[0]);
                }, 1000);
            })
        }
        return features[0]
    }


    //Display the Pop up of the given point on the map
    function update_popup(point_feature){
        const popup = new mapboxgl.Popup({ offset: [0, 0], })
        .setLngLat(point_feature.geometry.coordinates)
        .setHTML(
            `<h3>${point_feature.properties["Site_Name"]}</h3>
            <p>This gauge has an elevation of ${point_feature.properties["Elevation_(ft)"]} ft and it located at ${point_feature.properties["Latitude"].toFixed(2)} N, ${point_feature.properties["Longitude"].toFixed(2)} E in ${point_feature.properties["State"]}</p>
            <p>Top 5% Flow: ${point_feature.properties["top_5%"].toFixed(1)} cubic ft per second</p>
            <p>Top 10% Flow: ${point_feature.properties["top_10%"].toFixed(1)} cubic ft per second</p>
            <p>Top 50% Flow: ${point_feature.properties["Median_Discharge_(cubic_ft/sec)"].toFixed(1)} cubic ft per second</p>
            <p>Top 90% Flow: ${point_feature.properties["bottom_10%"].toFixed(1)} cubic ft per second</p>
            <p>Top 95% Flow: ${point_feature.properties["bottom_5%"].toFixed(1)} cubic ft per second</p>`
        )

        popup.on('open', () => {
            popup.getElement().style.opacity = '0.90'
        });

        current_popup = popup
    }

    function display_popup() {
        current_popup.addTo(MAP)
    }

    function remove_popup() {
        if (current_popup) {
            current_popup.remove()
        }
    }

    //Zooms to given point 
    function zoomTo(lat, lon) {
        MAP.flyTo({
            center: [lon, lat],
            speed: 1,
            curve: 1.4, 
            duration: 1000
        })
    }