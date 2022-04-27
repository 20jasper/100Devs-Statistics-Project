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
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  // bar styling and size

  const svgWidth = windowWidth < 1200 ? windowWidth * 0.8 : 1200;
  const svgHeight = windowWidth < 1200 ? svgWidth : 960;
  const barPadding = 5;
  const barWidth = (svgWidth - margin.left - margin.right) / dataset.length;
  console.log(dataset.length);

  // set svg width & height on DOM
  const svg = d3
    .select('svg')
    // .attr('viewbox', `0 0 ${svgWidth} ${svgHeight}`);
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  //Formatting dates and get date extents
  const dates = [];
  for (let obj of dataset) {
    dates.push(obj.date);
  }
  const dateExtents = d3.extent(dates);

  // Getting value extents
  const avgCCVValues = [];
  for (let obj of dataset) {
    avgCCVValues.push(obj.value);
  }
  const valueExtents = [d3.max(avgCCVValues), 0];

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

  // Set x-axis
  const x_axis = d3.axisBottom(xScale);
  if (windowWidth < 100) {
    x_axis.ticks(3);
  } else {
    x_axis.ticks(6);
  }

  const xAxisTranslate = svgHeight - margin.bottom;
  svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + xAxisTranslate + ')')
    .call(x_axis)
    .selectAll('.tick text')
    .attr('font-size', '16')
    .attr('font-family', 'Source Sans Pro')
    .attr('font-weight', '600');

  // Set y-axis
  const y_axis = d3.axisLeft().scale(yScale);
  svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
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
buildGraph();
