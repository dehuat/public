/*

My Custom JS
============

Author:  Dehua  
Updated: July 2014



*/
$(function () {

    

    var width = 960,
        height = 200;

    /**
     * create a html table with given data
     */
    function tabulate(data, columns, table) {

        thead = table.append("thead"),
            tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function (column) {
                return column;
            });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function (row) {
                var myvalues = new Array();
                myvalues[columns[0]] = row.key;
                myvalues[columns[1]] = row.values.goldmedals;
                myvalues[columns[2]] = row.values.silvermedals;
                myvalues[columns[3]] = row.values.bronzemedals;
                myvalues[columns[4]] = row.values.bronzemedals + row.values.silvermedals + row.values.goldmedals;
                return columns.map(function (column) {
                    return {
                        column: column,
                        value: myvalues[column]
                    };
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Courier")
            .html(function (d) {
                return d.value;
            });

        return table;
    }

    /**
     * return the data with a athlete between the age of 22 and 29(inclusive) that has a medal
     */
    function datafilter(mydata) {
        var result = mydata.filter(function (g) {
            //get the number of total medals 
            var totals = g.bronzemedals + g.silvermedals + g.goldmedals;
            return (g.age >= 22 && g.age <= 29 && totals > 0);
        });
        return result;
    }

    //d3.json("data/sdata.json", function (rawdata) {
    $.getJSON("https://apps.mathbiol.org/sdata?callback=?",
        function(rawdata){      
        // filter the raw data
        var data = datafilter(rawdata);
        // get the result
        data = d3.nest()
            .key(function (d) {
                return d.sport;
            })
            .sortKeys(d3.descending)
            .rollup(function (d) {
                return {
                    goldmedals: d3.sum(d, function (g) {
                        return g.goldmedals;
                    }),
                    silvermedals: d3.sum(d, function (g) {
                        return g.silvermedals;
                    }),
                    bronzemedals: d3.sum(d, function (g) {
                        return g.bronzemedals;
                    })
                };
            })
            .entries(data);

        // crete the table
        var mytable = d3.select("#svg").append("table")
            .attr("id","sportsTable")
            .attr("style", "margin-left: 250px; margin-botton:40px;");
        // render the table
        var sportsTable = tabulate(data, ["Sport Name", "Goldmedals", "Silvermedals", "Bronzemedals", "Totalmedals"], mytable);

    });

    

    
});