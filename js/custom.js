/*

My Custom JS
============

Author:  Dehua	
Updated: July 2014

*/

$(function() {
	
	var width = 960,
    height = 8000,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//*****************
// pie example code: 

var arc = d3.svg.arc()
    .outerRadius(radius - 100)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

   
d3.json("data/mydata", function(mydata) {
  console.log(mydata);

  var data=d3.nest()
    .key(function(d) {return d.sport;})
    .sortKeys(d3.ascending)
    .rollup(function(d){ return {
        bronzemedals:d3.sum(d,function(g) {
          return g.bronzemedals;
        })
      };

    })
    .entries(mydata);
  
  console.log(data);

  var mysvg = d3.select("#svg").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","mysvg")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + 100 + ")");


  mysvg.selectAll("rect")
    .data(data)
    .enter()
      .append("rect")
      .attr("width", function(d){ return d.values.bronzemedals * 100; })
      .attr("height", 48)
      .attr("y", function(d, i){ return i*50 ; })
      .attr("fill","blue");

  mysvg.selectAll("text")
    
    .data(data)
    .enter()
      .append("text")
      .attr("fill","white")
      .attr("y", function(d, i){ return i*50 + 24 ; })
      .text(function(d){ return d.key;});



	// var g = mysvg.selectAll(".arc")
 //    .data(pie(mydata))
 //    .enter()
 //    .append("g")
 //    .attr("class","arc");

 //   g.append("path")
 //      .attr("d", arc)
 //      .style("fill", function(d) { return color(d.data.age); });

 //   g.append("text")
 //      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
 //      .attr("dy", ".35em")
 //      .style("text-anchor", "middle")
 //      .text(function(d) { return d.data.age; });   

 //  console.log(d3.selectAll("g"))


});


	
});