function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");
  console.log("You selected: " + dataset);
  //call filter function which will return the JSON-like object
  buildPlot(dataset);
}

var url = "https://cnjanssen.github.io/plotly-homework/samples.json";

populateOptions();
var subjID = d3.select("#selDataset");
var first = 940;
buildPlot(first);




//the filter function takes the option's value we picked from the dropdown and returns a JSON-like object containing only the 
//the information for the relevant participant

function buildPlot(id_num) {
  //read JSON file creating a reference to it called data
  d3.json(url).then((importedData) => {
    // console.log(importedData);
    console.log("build plot");
    var data = importedData;
    var names = data['names'];
    var position = 0;
    for (var i =0; i<names.length; i++)
    {
      
      if (names[i] == id_num){
        console.log("match found at position " +i);
        position = i;
        //break;
      }
    }

    
    //populate metadata
    d3.selectAll("li").remove();
    
    metadata = data['metadata'][position];
    console.log(metadata);
    //clear existing metadata

    Object.entries(metadata).forEach(function([key, value])
    {
      met = d3.select("#sample-metadata").append("li");
      met.text(key +" : " +value);
    });
      
    
    

    //return the first 10 OTU sample_values, assuming data is already sorted
    var x = data['samples'][position]['sample_values'].slice(0, 10);
    //console.log(x);
    //return the OTU ID's which are the labels to be used`
    var labels = data['samples'][position]['otu_ids'].slice(0, 10);
    var str_labels = labels.map(String);
    //console.log(str_labels);
    var tooltips = data['samples'][0]['otu_labels'].slice(0, 10);

    //set up the chart and plot it in the correct div
    var trace1 =
    {
      x: x,
      y: str_labels,
      type: 'bar',
      //text: x.map(String),
      //text: tooltips,
      orientation: 'h',

    };
    //trace2 is for the bubble plot
    var trace2 =
    {
        //swap x and y
        x: x,
        y: str_labels,
      mode: 'markers',
      orientation: 'h',
      //text: x.map(String),
      //text: tooltips,
      marker: {
        size: x
      },
    };
    //set up layout using the tooltips as previously returned from the JSON object. 
    var layout =
    {
      title: 'Abundance of Taxonomic Units by OTU ID',
      font:
      {
        family: 'Raleway, sans-serif'
      },
      showlegend: true,
      xaxis:
      {
        // tickangle: -45,
        title: 'Abundance'
      },
      yaxis:
      {
        // zeroline: false,
        // gridwidth: 20,
        title: 'ID of OTU',
        type: 'category'
      },

    };

    var chart_data = [trace1];
    var bubble_data = [trace2];

    Plotly.newPlot('bar', chart_data, layout);
    //plot bubble chart in the bubble divider
    Plotly.newPlot('bubble', bubble_data, layout);
  });
}
function populateOptions() {
      //get reference to dataset dropdown
      var selectTag = d3.select("select");

      console.log("tag-selected?");
      console.log(selectTag);
      var url = "https://cnjanssen.github.io/plotly-homework/samples.json";
      //use the D3 way of nesting and binding
      d3.json(url).then(function (data) {
        names = data.names;
        var entry = selectTag
          .selectAll("option")
          .data(names)
          .enter()
          .append("option")
          //for each entry in names, append the text with an arrow function
          .text(d => d, names)
          //for each entry in names, append the value with an arrow function
          .attr("value", d => d);
      });
    }
 // Call updatePlotly() when a change takes place to the DOM
 d3.selectAll("#selDataset").on("optionChanged", buildPlot());

  // This function is called when a dropdown menu item is selected


  function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var selection = d3.select("selDataset").node().value;
    console.log(selection);

    // clear the input value
    d3.select("#selection").node().value = "";

    // Build the plot with the new data
    buildPlot(selection);
  }

