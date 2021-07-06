// @TODO: YOUR CODE HERE!

// SVG definitions and borders
let svgWidth = 980;
let svgHeight = 660;
let margin = {top: 40, right: 60, bottom: 240, left: 110};

// calculate chart height and width
let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
let chart = d3.select('#scatter').append('div').classed('chart', true);

//append an svg element to the chart 
let svg = chart.append('svg').attr('width', svgWidth).attr('height', svgHeight);

//append an svg group
let svgGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
let selectedXAxis = 'poverty';
let selectedYAxis = 'healthcare';

//functions for updating x and y-scale variables upon click of label
function xScale(censusData, selectedXAxis) {
    let xLinearScale = d3.scaleLinear()
        .domain(
            [d3.min(censusData, d => d[selectedXAxis]) * 0.8,
            d3.max(censusData, d => d[selectedXAxis]) * 1.2]
            )
        .range([0, width]);
    return xLinearScale;
};

function yScale(censusData, selectedYAxis) {
    let yLinearScale = d3.scaleLinear()
        .domain(
            [d3.min(censusData, d => d[selectedYAxis]) * 0.8,
            d3.max(censusData, d => d[selectedYAxis]) * 1.2]
            )
        .range([height, 0]);
    return yLinearScale;
};

// functions for updating x and y-axis upon click
function renderXAxis(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(2000).call(bottomAxis);
    return xAxis;
};

function renderYAxis(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
    yAxis.transition().duration(2000).call(leftAxis);
    return yAxis;
};

// function for updating circle transitions 
function renderCircles(circlesGroup, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    circlesGroup.transition().duration(2000)
        .attr('cx', data => newXScale(data[selectedXAxis]))
        .attr('cy', data => newYScale(data[selectedYAxis]))
    return circlesGroup;
};

//function for updating state labels
function renderText(textGroup, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    textGroup.transition().duration(2000)
        .attr('x', d => newXScale(d[selectedXAxis]))
        .attr('y', d => newYScale(d[selectedYAxis]));
    return textGroup
};

// tooltip function to stylize x-axis values
function styleX(value, selectedXAxis) {
    if (selectedXAxis === 'poverty') {
        return `${value}%`;
    } else if (selectedXAxis === 'income') {
        return `${value}`;
    } else {
        return `${value}`;
    }
};

//funtion for updating circles group
function updateToolTip(selectedXAxis, selectedYAxis, circlesGroup) {
    // X label
    if (selectedXAxis === 'poverty') {
        var xLabel = 'Poverty:';
    } else if (selectedXAxis === 'income') {
        var xLabel = 'Median Income:';
    } else {
        var xLabel = 'Age:';
    };
    // Y label
    if (selectedYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    } else if (selectedYAxis === 'obesity') {
        var yLabel = 'Obesity:';
    } else {
        var yLabel = 'Smokers:';
    };

    // tooltip
    var toolTip = d3.tip()
        .attr('class', 'd3-tip').offset([-8, 0]).html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[selectedXAxis], selectedXAxis)}<br>${yLabel} ${d[selectedYAxis]}%`);
        });
    circlesGroup.call(toolTip);

    //add
    circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
    return circlesGroup;
};
// data retrieval
d3.csv('./assets/data/data.csv').then(function(censusData) {
    //console.log(censusData);
    // data parsing
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    //create linear scales
    var xLinearScale = xScale(censusData, selectedXAxis);
    var yLinearScale = yScale(censusData, selectedYAxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = svgGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    //append Y
    var yAxis = svgGroup.append('g')
        .classed('y-axis', true)
        //.attr
        .call(leftAxis);

    //append Circles

    var circlesGroup = svgGroup.selectAll('circle')
        .data(censusData)
        .enter()
        .append('circle')
        .classed('stateCircle', true)
        .attr('cx', d => xLinearScale(d[selectedXAxis]))
        .attr('cy', d => yLinearScale(d[selectedYAxis]))
        .attr('r', 14)
        .attr('opacity', '.5');

    //append Initial Text
    var textGroup = svgGroup.selectAll('.stateText')
        .data(censusData)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[selectedXAxis]))
        .attr('y', d => yLinearScale(d[selectedYAxis]))
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
    var circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');

            if (value != selectedXAxis) {

                //replace chosen x with a value
                selectedXAxis = value;

                //update x for new data
                xLinearScale = xScale(censusData, selectedXAxis);

                //update x 
                xAxis = renderXAxis(xLinearScale, xAxis);

                //upate circles with a new x value
                circlesGroup = renderCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);

                //update text 
                textGroup = renderText(textGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);

                //update tooltip
                circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup);

                //change of classes changes text
                if (selectedXAxis === 'poverty') {
                    povertyLabel.classed('active', true).classed('inactive', false);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', false).classed('inactive', true);
                } else if (selectedXAxis === 'age') {
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
    //y axis lables event listener
    yLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');

            if (value != selectedYAxis) {
                selectedYAxis = value

                //update Y scale
                yLinearScale = yScale(censusData, selectedYAxis);

                //update Y axis 
                yAxis = renderYAxis(yLinearScale, yAxis);

                //update CIRCLES with new y
                circlesGroup = renderCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);

                //update TEXT with new Y values
                textGroup = renderText(textGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);

                //update tooltips
                circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup);

                //Change of the classes changes text
                if (selectedYAxis === 'obesity') {
                    obesityLabel.classed('active', true).classed('inactive', false);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    healthcareLabel.classed('active', false).classed('inactive', true);
                } else if (selectedYAxis === 'smokes') {
                    obesityLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', true).classed('inactive', false);
                    healthcareLabel.classed('active', false).classed('inactive', true);
                } else {
                    obesityLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    healthcareLabel.classed('active', true).classed('inactive', false);
                }
            }
        });
});