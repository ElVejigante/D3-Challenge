// @TODO: YOUR CODE HERE!
// SVG definitions and margins
let svgWidth = 960;
let svgHeight = 620;
let margin = {
    top: 20,
    right: 40,
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

// this function renders the y axis upon click:
function renderYAxis(newYScale, newYAxis) {
    let leftAxis = d3.axisLeft(newYScale);
    newYAxis.transition().duration(2000).call(leftAxis);
    return newYAxis;
};

// function for circle transitions
function renderCircles(circlesGroup, newXScale, xAxis, newYScale, yAxis) {
    circlesGroup.transition()
        .duration(2000)
        .attr('cx', data => newXScale(data[xAxis]))
        .attr('cy', data => newYScale(data[yAxis]))
    return circlesGroup;
};

// function for updating labels
function renderText(textGroup, newXScale, xAxis, newYScale, yAxis) {
    textGroup.transition()
        .duration(2000)
        .attr('x', d => newXScale(d[xAxis]))
        .attr('y', d => newYScale(d[yAxis]));
    return textGroup
};

// function to stylize axis values
function styleX(value, xAxis) {
    if(xAxis === 'poverty') {
        return `${value}%`;
    } else if (xAxis === 'income') {
        return `${value}`;
    } else {
        return `${value}`;
    }
};

// function for updating circles group

function updateToolTip(xAxis, yAxis, circlesGroup) {
    //xAxis, poverty
    if (xAxis === 'poverty') {
        let xLabel = 'Poverty:';
    } else if (xAxis === 'income') {
        let xLabel = 'Median Income:';
    } else {
        let xLabel = 'Age:';
    }
    //yAxis, Health Care
    if (yAxis === 'healthcare') {
        let yLabel = 'No Health Care:';
    } else if (yAxis === 'obesity') {
        let yLabel = 'Obesity:';
    } else {
        let yLabel = 'Smokers:';
    }
    // tooltip
    let toolTip = d3.tip().attr('class', 'd3-tip').offset([-8,0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[xAxis], xAxis)}<br>${yLabel} ${d[xAxis]}%`);
        });
    
    circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
    return circlesGroup;
};

// Data Retrieval:
d3.csv('./assets/data/data.csv').then(function(censusData) {
    console.log(censusData);
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // linear scales
    var xLinearScale = xScale(censusData, xAxis);
    var yLinearScale = yScale(censusData, yAxis);

    // x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x
    var xAppend = svgGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // append y
    var yAppend = svgGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);

    // append circles
    var circlesGroup = svgGroup.selectAll('circle')
        .data(censusData)
        .enter()
        .append('circle')
        .classed('stateCircle', true)
        .attr('cx', d => xLinearScale(d[xAxis]))
        .attr('cy', d => yLinearScale(d[yAxis]))
        .attr('r', 14)
        .attr('opacity', '.5');

    //append Initial Text
    var textGroup = svgGroup.selectAll('.stateText')
        .data(censusData)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[xAxis]))
        .attr('y', d => yLinearScale(d[yAxis]))
        .attr('dy', 3)
        .attr('font-size', '10px')
        .text(function(d) { return d.abbr });

    //create a group for the x axis labels
    var xLabelsGroup = svgGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var povertyLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('active', true)
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .text('In Poverty (%)');

    var ageLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'income')
        .text('Household Income (Median)')
    
    //create a group for Y labels
    var yLabelsGroup = svgGroup.append('g')
        .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('active', true)
        .attr('x', 0)
        .attr('y', 0 - 20)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'healthcare')
        .text('Without Healthcare (%)');

    var smokesLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 40)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'smokes')
        .text('Smoker (%)');

    var obesityLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 60)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'obesity')
        .text('Obese (%)');
    
    //update the toolTip
    var circlesGroup = updateToolTip(xAxis, yAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');

            if (value != xAxis) {

                //replace chosen x with a value
                xAxis = value;

                //update x for new data
                xLinearScale = xScale(censusData, xAxis);

                //update x 
                newXAxis = renderXAxis(xLinearScale, newXAxis);

                //upate circles with a new x value
                circlesGroup = renderCircles(circlesGroup, xLinearScale, xAxis, yLinearScale, yAxis);

                //update text 
                textGroup = renderText(textGroup, xLinearScale, xAxis, yLinearScale, yAxis);

                //update tooltip
                circlesGroup = updateToolTip(xAxis, yAxis, circlesGroup);

                //change of classes changes text
                if (xAxis === 'poverty') {
                    povertyLabel.classed('active', true).classed('inactive', false);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', false).classed('inactive', true);
                } else if (xAxis === 'age') {
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', true).classed('inactive', false);
                    incomeLabel.classed('active', false).classed('inactive', true);
                } else {
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', true).classed('inactive', false);
                }
            }
        });
        
})