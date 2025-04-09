const execute = function() {
    class LineGraph {
      constructor(json) {
          this.json = json;
          this.stJohnRiverData = [];
          json.forEach(x => {
              if (x.site_name === "St. John River at Ninemile Bridge, Maine") {
                  this.stJohnRiverData.push(x);
              }
          })
          console.log(this.stJohnRiverData);
      }

      displayStJohnTmean() {
        let svgWidth = 1200;
        let svgHeight = 1200;
        let xInterval = svgWidth / this.stJohnRiverData.length;  
        let points = [];
        let currIndex = 0
        
        this.stJohnRiverData.forEach(x => {
          points.push({x: currIndex * xInterval, y: x.mean_discharge});
          currIndex += 1;
        });
        console.log(points);

        let lineFn = d3.line()
                        .x(d => d.x)
                        .y(d => d.y);

        d3.select("body")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        const svg = d3.select("svg");

        svg.append("path")
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 2)  
            .attr("d", lineFn(points));
        console.log(lineFn(points));
        // let d3Scale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, svgHeight]);
        // let xAxis = d3.axisBottom().scale(d3Scale);

          // svg.selectAll("path")
          //     .data(data)
          //     .join("path")
          //     .attr("d", line(data))
          //     // .attr("x", (d, i) => i * xInterval)
          //     // .attr("y", d => d3Scale(d))
          //     // .attr("width", d => d3Scale(d))
          //     // .attr("height", 20)
          //     // .style("fill", "steelblue");
          
          // svg.append("g")
          //     .attr("transform", `translate(0, ${height})`)
          //     .call(xAxis);


      }
    }   

    d3.json('data/milestone_dummy_data.json').then(function (data) {
      const lineGraph = new LineGraph(data);
      lineGraph.displayStJohnTmean();
    });
  }