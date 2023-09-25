// Function to initialize the page
function init() {
  // Fetch data from the URL
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      // Populate the dropdown with IDs
      const dropdown = d3.select("#selDataset");
      data.names.forEach(id => {
          dropdown.append("option").text(id).property("value", id);
      });

      // Initial visualization with the first ID
      updateVisualizations(data.names[0], data);
  });
}

// Function to update visualizations
function updateVisualizations(selectedID, data) {
  // Filter data based on the selected ID
  const sampleData = data.samples.find(sample => sample.id === selectedID);

  // Create the bar chart
  createBarChart(sampleData);

  // Create the bubble chart
  createBubbleChart(sampleData);

  // Display metadata
  displayMetadata(selectedID, data);
}

// Function to create the bar chart
function createBarChart(sampleData) {
  // Sort and slice the data to get the top 10
  const top10 = sampleData.sample_values.slice(0, 10).reverse();
  const labels = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  const hoverText = sampleData.otu_labels.slice(0, 10).reverse();

  // Create the bar chart
  const trace = {
      x: top10,
      y: labels,
      text: hoverText,
      type: "bar",
      orientation: "h"
  };

  const data = [trace];

  const layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" }
  };

  Plotly.newPlot("bar", data, layout);
}

// Function to create the bubble chart
function createBubbleChart(sampleData) {
  // Create the bubble chart
  const trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: "Viridis"
      }
  };

  const data = [trace];

  const layout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
  };

  Plotly.newPlot("bubble", data, layout);
}

// Function to display metadata
function displayMetadata(selectedID, data) {
  // Find the metadata for the selected ID
  const metadata = data.metadata.find(item => item.id.toString() === selectedID);

  // Select the metadata div and clear its content
  const metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html("");

  // Iterate through metadata and display each key-value pair
  Object.entries(metadata).forEach(([key, value]) => {
      metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

// Function to handle dropdown change
function optionChanged(selectedID) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      updateVisualizations(selectedID, data);
  });
}

// Initialize the page
init();

// Event listener for dropdown change
d3.select("#selDataset").on("change", function () {
  const selectedID = d3.select(this).property("value");
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      updateVisualizations(selectedID, data);
  });
});