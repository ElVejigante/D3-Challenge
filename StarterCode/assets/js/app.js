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

//append svg group:
let svgGroup = svg.append('g').attr('transform',`translate(${margin.left}, ${margin.top})`);