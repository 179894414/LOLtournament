
    var name_color={"Bilibili Gaming": "pink", "Invictus Gaming": "green","EDward Gaming": "black","Royal Never Give Up": "blue","Oh My God": "brown",};

	 //Display specifications
	 const margin = {top:50, right:50, bottom:50, left:50};
	 const width = window.innerWidth - margin.left - margin.right;
	 const height = window.innerHeight - margin.top - margin.bottom;


	 //Total checkbox
	 d3.selectAll(".selector")
		       .on("click", function (d) {
			   this.checked ? showPath(this.id) : hidePath(this.id);
		       });

	 //Show functions
	 function showPath (source) {
		console.log("show")
	     d3.selectAll("path").filter(function(){
  return d3.select(this).attr('id')==source;
}).transition().attr('stroke-width', 1).duration(1000);
	 }
	 
	 //Hide functions
	 function hidePath (source) {
		console.log("hide")
	     d3.selectAll("path").filter(function(){
  return d3.select(this).attr('id')==source;
}).transition().attr('stroke-width', 0).duration(1000);
	 }

	 async function data(pathToCsv) {
        var dataset = await d3.csv(pathToCsv, function (d) {
            return {
				team:d.Team,
				wr: parseFloat(d.winrate),
		    	season: parseFloat(d.Season)
            }
        })
        return dataset
    };

	data("https://raw.githubusercontent.com/yutaoyt7/LPL-_team_winrate/main/LPL_stats_teams.csv").then(function(data) {
		var x = d3.scaleLinear()
		       .domain(d3.extent(data, d => d.season))
		       .range([0, width]);
	     
	     //Set y scale
	     var y = d3.scaleLinear()
		       .domain(d3.extent(data, d => d.wr))
		       .range([0,height]);

	     //line function
	     var wr_line = d3.line()
		    .defined(d => d)
    		.x(d => x(d.season))
    		.y(d => y(d.wr));

		//Create container
		var container = d3.select("div#graph")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("class", "container")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	     //Title
	     container.append("text")
		      .attr("x", width * .5)
		      .attr("y", margin.top * .1)
		      .text("LPL Team Win Rates")
		      .attr("text-anchor", "middle")
		      .style("font-family", "sans-serif")
		      .style("font-size", margin.top * .4);

		//X axis
	     container.append("g")
		      .attr("class", "axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

	     //Y axis
	     container.append("g")
		      .attr("class", "axis")
		      .call(d3.axisLeft(y));


		//Y label
	     container.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("x", -height / 2)
		      .attr("y", -margin.right * .7)
		      .style("text-anchor", "middle")
		      .text("Win Rate")
		      .attr("font-family", "sans-serif")
		      .attr("font-size", margin.right / 4);
	     
		 //Draw time series
	     var path =(name)=> container.append("g")
				 .selectAll(name)
				 .data(data)
				 .enter()
				 .append("path")
				 .attr("class", "total")
				 .attr("id", name)
				 .attr("fill", "none")
				 .attr("stroke", name_color[name])
				 .attr("mix-blend-mode", "multiply")
				 .attr("stroke-width", 1)
				 .attr("stroke-linejoin", "round")
				 .attr("d", wr_line(data.filter(function(row) {
      				return row['team'] == name;
  				})));
		
		path("Bilibili Gaming");
		path("EDward Gaming");
		path("Invictus Gaming");
		path("Royal Never Give Up");
		path("Oh My God");

	});
	 