# New-England-River-Analysis
### Link to Data: [Here](https://drive.google.com/drive/folders/1xEUJQEgcSy5NSzGPgh-T3u0zRgrU3nbA?usp=sharing) 

### Link to Website: [Here](https://johnr425.github.io/New-England-River-Analysis/) 

### Link to Screencast: [Here](https://drive.google.com/file/d/1KWwwFAnCdVtBjTAU89-Q2G_zi11LFJDH/view?usp=sharing) 


### Launch: Run live server in VSCode while viewing the index.html file.  

## File Structure:
The Preprocessing script is what we used to turn our data from USGS and PRISM into our two csv files, one representing every gage, and the other representing the discharge each day for each gage.  

The js folder holds our JavaScript files used to customize our website.  
- gageSummary.js: displays a text summary of the selected gage point.
- graphLegend.js: displays the legend for the discharge graph where a different color corresponds to each recorded percentile of discharge in our data.  
- lineGraph.js: controls the discharge vs. time and precipitation vs. time graphs.  
- map.js: controls the functionality of the map.  
- script.js: calls functions for initalizing visualizations across all js files.  
- sliderSelection.js: controls the date sliders for the graph visualization.  
- table.js: controls the functionality of the table selector.  
- tableSelection.js: controls the state selection dropdown for the table.  

The modules folder holds the file WorkerAPI.js which connects our website to our database which holds our CSVs.  

The 571 Process Book.pdf documents our project progress and direction throughout it's creation.  

index.html is the main html file that displays our website and contains our styling.  
