/*

My Custom JS
============

Author:  Dehua  
Updated: July 2014



*/
$(function () {

    var width = 960,
        height = 100;
    var r  =100;    

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
            .filter(function(d) { 
              console.log(d);
              return d['Goldmedals'] > 10 ; })
            .attr("style", "font-family: Courier")
            .html(function (d) {
                return d.value;
            });

        return table;
    }

    d3.json("data/sdata.json", function (rawdata) {
        var data = d3.nest()
            .key(function (d) {
                return d.sport;
            })
            .sortKeys(d3.descending)
            .rollup(function (d) {
                return {
                    // check if there is a athlete between the age of 22 and 29(inclusive) that has a medal
                    // 0 for no; >0 for yes
                    eligible: d3.sum(d, function (g) {
                        var totals = g.bronzemedals + g.silvermedals + g.goldmedals;
                        if (g.age > 22 && g.age <= 29) {
                            return totals;
                        } else {
                            return 0;
                        }
                    }),
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
            .entries(rawdata);

        console.log(data);

        var mytable = d3.select("#svg").append("table")
            .attr("style", "margin-left: 250px; margin-top:100px;");
        // render the table
        var sportsTable = tabulate(data, ["Sport Name", "Goldmedals", "Silvermedals", "Bronzemedals", "Totalmedals"], mytable);


    });
});