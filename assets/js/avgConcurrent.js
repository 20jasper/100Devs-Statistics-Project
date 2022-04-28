async function getFetch() {
  const url = '../scraping/100devs-streams-Aug-6-2020-thru-Apr-5-2022.json';
  const response = await fetch(url);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  let ccvArray = [];
  // Go thru all data object properties
  for (let key in data) {
    const tempDate = new Date(key);
    const keyYear = tempDate.getFullYear();
    // check if property is from 2022
    if (keyYear === 2022) {
      // if true push new object to array with prop of date and prop of avgCCV
      ccvArray.push({ date: new Date(key), value: data[key]['AVG CCV'] });
    }
  }
  console.log(ccvArray);
  return ccvArray;
}

async function buildGraph() {
  const windowWidth = window.innerWidth || document.body.clientWidth;
  console.log(windowWidth);
  const dataArray = await getFetch();
  const dataset = dataArray.reverse();

  // set graph margins
  margin = {
    top: 25,
    right: 0,
    bottom: 50,
    left: 50,
  };

  // bar styling and size
  const svgWidth = windowWidth < 1200 ? windowWidth * 0.8 : 1200;
  const svgHeight = windowWidth < 1200 ? svgWidth : 960;
  let barPadding = 5;
  const barWidth = (svgWidth - margin.left - margin.right) / dataset.length;
  if (windowWidth < 1000) {
    barPadding = 2;
  }

  // set svg width & height on DOM
  const svg = d3
    .select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  //Get date extents
  const dateExtents = getDateExtents(dataset);

  // Getting value extents
  const valueExtents = setValueExtents(dataset);

  // set xScale
  const xScale = d3
    .scaleTime()
    .domain(dateExtents)
    .range([0, svgWidth - margin.right - margin.left]);

  // set yScale
  const yScale = d3
    .scaleLinear()
    .domain(valueExtents)
    .range([0, svgHeight - margin.top - margin.bottom]);

  // x-axis generator
  const x_axis = d3.axisBottom(xScale);

  // Change number of x-axis ticks depending on screen width
  if (windowWidth < 1000) {
    x_axis.ticks(3);
  } else {
    x_axis.ticks(6);
  }

  // position x axis depending on bottom margin
  const xAxisTranslate = svgHeight - margin.bottom;

  // create x axis in svg
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${xAxisTranslate})`)
    .call(x_axis)
    .selectAll('.tick text')
    .attr('font-size', '16')
    .attr('font-family', 'Source Sans Pro')
    .attr('font-weight', '600');

  // y-axis generator
  const y_axis = d3.axisLeft().scale(yScale);

  // Change number of 7-axis ticks depending on screen width
  if (windowWidth < 1000) {
    y_axis.ticks(4);
  } else {
    y_axis.ticks(8);
  }

  // create y axis in svg
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(y_axis)
    .selectAll('.tick text')
    .attr('font-size', '16')
    .attr('font-family', 'Source Sans Pro')
    .attr('font-weight', '600');

  // add data to svg
  const barChart = svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('height', function (d) {
      return svgHeight - yScale(d.value) - margin.bottom - margin.top;
    })
    .attr('y', function (d) {
      return yScale(d.value) + margin.top;
    })
    .attr('width', barWidth - barPadding)
    .attr('transform', function (d, i) {
      const translate = [barWidth * i + margin.left, 0];
      return 'translate(' + translate + ')';
    })
    .attr('fill', 'steelblue');
}

// run the graph building function
buildGraph();

// Get min and max dates from dataset
function getDateExtents(array) {
  const dates = [];
  for (let obj of array) {
    dates.push(obj.date);
  }
  return d3.extent(dates);
}

// Set data value min and max
function setValueExtents(array) {
  const avgCCVValues = [];
  for (let obj of array) {
    avgCCVValues.push(obj.value);
  }
  return [d3.max(avgCCVValues), 0];
}
