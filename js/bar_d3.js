/*

My Custom JS
============

Author:  Dehua  
Updated: July 2014

*/
$(function () {

    var width = 900,
        height = 1200;

    var color = d3.scale.category20();

    //d3.json("data/sdata.json", function (rawdata) {
    $.getJSON("https://apps.mathbiol.org/sdata?callback=?",
        function(rawdata){    
        //1, filter the raw data
        var data = d3.nest()
            .key(function (d) {
                return d.sport;
            })
            .sortKeys(d3.ascending) //sort the key
            .rollup(function (d) {
                return {
                    bronzemedals: d3.sum(d, function (g) {
                        return g.bronzemedals;
                    })
                };
            })
            .entries(rawdata);
        //uncommnet below line to check the filtered data in console    
        //console.log(data);

        // 2, set the svg with width and height; 
        var mysvg = d3.select("#svg").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "mysvg")
            .append("g")
            .attr("transform", "translate(" + 300 + "," + 40 + ")");

        var max_n = 0;
        for (var d in data) {
            max_n = Math.max(data[d].values.bronzemedals, max_n);
        }
        //console.log("max_n is : " + max_n);
        var dx = width / max_n - 5;
        var dy = height / data.length - 8;

        //title
        // var title = mysvg.append("text")
        // .attr("x", (width / 3))             
        // .attr("y", -40)
        // .attr("text-anchor", "middle")  
        // .style("font-size", "18px") 
        // //.style("text-decoration", "underline")  
        // .text("Type of sports by the number of bronze medals");

        // bars
        var bars = mysvg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return 0;
            })
            .attr("y", function (d, i) {
                return dy * i;
            })
            .attr("width", function (d, i) {
                return dx * d.values.bronzemedals
            })
            .attr("height", dy)
            .attr("fill", function (d, i) {
                return color(i);
            });

        // labels
        var text = mysvg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", -200) // move to the left of the bar
            .attr("y", function (d, i) {
                return dy * i + 15;
            })
            .text(function (d) {
                return d.key + " ( " + d.values.bronzemedals + " )";
            })
            .attr("fill", "black")
            .attr("font-size", "15px")
            .style("font-weight", "bold");
    });
});