// @TODO: YOUR CODE HERE!
// SVG definitions and margins
let svgWidth = 900;
let svgHeight = 600;
let margin = {
    top: 30,
    right: 50,
    bottom: 200,
    left: 100
};

// chart height & width calculations:
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.right - margin.left;

// scatter element appended to div:
let chart = d3.select('#scatter').append('div').classed('chart', true);

// append svg to chart:
let svg = chart.append('svg').attr('width', svgWidth).attr('height', svgHeight);

// append svg group:
let svgGroup = svg.append('g').attr('transform',`translate(${margin.left}, ${margin.top})`);

// set axis:
let xAxis = 'poverty';
let yAxis = 'healthcare';

// variable x-scale 'upon click' function:
function xScale(censusData, xAxis) {
    let xScaleLinear = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[xAxis]) * 0.8,
        d3.max(censusData, d => d[xAxis]) * 1.2]).range([0, width]);
    return xScaleLinear;
};

// variable y-scale 'upon click' function:
function yScale(censusData, yAxis) {
    let yScaleLinear = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[yAxis]) * 0.8,
        d3.max(censusData, d => d[yAxis]) * 1.2]).range([height, 0]);
    return yScaleLinear;
};

// this function renders the x axis upon click:
function renderXAxis(newXScale, newXAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
    newXAxis.transition().duration(2000).call(bottomAxis);
    return newXAxis;
};

