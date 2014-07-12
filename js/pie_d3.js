/*

My Custom JS
============

Author:  Dehua  
Updated: July 2014

*/
$(function () {
    var w = 900, //width
        h = 900, //height
        r = 300; //radius
    var color = d3.scale.category20();

    //d3.json("data/sdata.json", function (rawdata) {
    $.getJSON("https://apps.mathbiol.org/sdata?callback=?",
        function(rawdata){      
        var data = d3.nest()
            .key(function (d) {
                return d.country;
            })
            .sortKeys(d3.ascending)
            .rollup(function (d) {
                return {
                    totalmedals: d3.sum(d, function (g) {
                        return (g.bronzemedals + g.silvermedals + g.goldmedals);
                    })
                };

            })
            .entries(rawdata);

        console.log(data);

        var mysvg = d3.select("#svg")
            .append("svg:svg") //create the SVG element inside the <body>
            .data([data]) //associate our data with the document
            .attr("width", w) //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
            .attr("id", "mysvg") //set the id 
            .append("svg:g") //make a group to hold our pie chart
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")") //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc() //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie() //this will create arc data for us given a list of values
            .value(function (d) {
                return d.values.totalmedals;
            }); //we must tell it out to access the value of each element in our data array

        var arcs = mysvg.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("class", "slice"); //allow us to style things in the slices (like text)

        arcs.append("svg:path")
            //.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
            .style("fill", function (d, i) {
                return color(i);
            })

        arcs.append("svg:text") //add a label to each slice
            .attr("transform", function (d) { //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 1.3*r;
                d.outerRadius = 3*r;
                return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle") //center the text on it's origin
            .text(function (d, i) {
                return data[i].key + "(" + data[i].values.totalmedals + ")";
            }); //get the label from our original data array


    });

});