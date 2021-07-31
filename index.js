var selectedPageNr = 1;
var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
             2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
var selectedYear = years[0];

// Scatterplot parameters
var scatterPlotDataset;

const rightPanelRect = document.getElementById("rightpanel").getBoundingClientRect();

const svgMinWidth = 880;
const svgMaxWidth = 1320;
const scatterPlotSvgWidth = Math.min( Math.max(rightPanelRect.width -10, svgMinWidth), svgMaxWidth );

const svgMinHeight = 550;
const svgMaxHeight = 8600;
const scatterPlotSvgHeight = Math.min( Math.max(window.innerHeight - rightPanelRect.y - 10, svgMinHeight), svgMaxHeight );

d3.select("#scatterplotsvg").style("width", scatterPlotSvgWidth  + "px")
d3.select("#scatterplotsvg").style("height", scatterPlotSvgHeight  + "px")

const scatterPlotLeftMargin = 70;
const scatterPlotRightMargin = 165;
const scatterPlotTopMargin = 75;
const scatterPlotBottomMargin = 75;
const scatterPlotHeight = scatterPlotSvgHeight - scatterPlotTopMargin - scatterPlotBottomMargin;
const scatterPlotWidth = scatterPlotSvgWidth - scatterPlotLeftMargin - scatterPlotRightMargin;
var scatterPlotYScale;
var scatterPlotXScale;

// Prepare Scatterplot tooltip
var scatterPlotTooltip = d3.select("#scatterplottooltip")
scatterPlotTooltip.append("label").attr("id", "scatterPlotTooltiplbl1")
                  .style("display", "inline-block")
scatterPlotTooltip.append("label").attr("id", "scatterPlotTooltiplbl2")
                  .style("display", "inline-block")

var barChartTooltip = d3.select("#barcharttooltip")

// Prepare barchart tooltip
barChartTooltip.append("label")
              .attr("id", "labelBarChartToolTip")

var tablerow = barChartTooltip.append("table").append("thead").append("tr");
tablerow.append("th").html("Country");
tablerow.append("th").html("Mortality");
barChartTooltip.select("table").append("tbody");

// Barchart parameters
var barChartDataset;
var allCauseOfDeaths;
var topTenCountriesDataset;

const barChartSvgWidth=  rightPanelRect.width -10; //Math.min( rightPanelRect.width, 1200)
const barChartSvgHeight= window.innerHeight - rightPanelRect.y - 40;

d3.select("#barchartsvg").style("width", barChartSvgWidth + "px")
d3.select("#barchartsvg").style("height", barChartSvgHeight + "px")

const barChartLeftMargin = 300;
const barChartRightMargin = 130;
const barChartTopMargin = 75;
const barChartBottomMargin = 75;
const barChartHeight = barChartSvgHeight - barChartTopMargin - barChartBottomMargin;
const barChartWidth = barChartSvgWidth - barChartLeftMargin - barChartRightMargin;

var barChartYScale;
var varChartXScale;

// Logic around pressing page nr
document.querySelectorAll(".pageselectorbutton").forEach(
  element => element.addEventListener("click", function() {
    const currentPageNr = selectedPageNr;
    switch (this.id){
      case "buttonprev": if (selectedPageNr > 1) { selectedPageNr = selectedPageNr - 1}; break;
      case "buttonpage1": selectedPageNr = 1; break;
      case "buttonpage2": selectedPageNr = 2; break;
      case "buttonpage3": selectedPageNr = 3; break;
      case "buttonnext": if (selectedPageNr < 3) { selectedPageNr = selectedPageNr + 1}; break;
    }

    document.getElementById("buttonpage" + currentPageNr).classList.remove("pageselectorbuttonpressed");
    document.getElementById("buttonpage" + selectedPageNr).classList.add("pageselectorbuttonpressed");

    if ( currentPageNr != selectedPageNr){
      initializePage(); // Initialize parameters based on page selection
    }
  })
);

// logic around year year selection
// Generate year range slider
yearSelector = document.getElementById("yearselector");
yearSelector.min = years[0];
yearSelector.max = years[years.length-1];
yearSelector.value = years[0];

yearList = document.getElementById("yearlist");
years.forEach(function(year) {
  const option = document.createElement("option")
  option.innerHTML = year;
  yearList.appendChild(option);
})

document.getElementById("selectedyear").value = years[0];

// Update year slider component to point to the selected year
function updateYearSelectorComponent(value) {
  document.getElementById("selectedyear").value = value;
  document.getElementById("yearselector").value = value;
}

// This function will be called when the user slide year
function selectYear(value){
  updateYearSelectorComponent(value);
  selectedYear = +value;

  switch (selectedPageNr) {
    case 1: createScatterPlot(selectedYear);
    case 2: createScatterPlot(selectedYear);
    case 3: createBarChart(selectedYear);
  }

}


// Simulate button
document.getElementById("simulatebutton").addEventListener("click", function(){
  switch (selectedPageNr){
    case 2:
      simulateProgressScatterPlot(years[0]);
      break;
    case 3:
      simulateProgressBarChart(years[0]);
      break;
  }
})

// Initialize parameters each time the user moves from one page to the another
function initializePage() {
  selectedYear = years[0];
  updateYearSelectorComponent(selectedYear);

  switch (selectedPageNr) {
    case 1:
      document.getElementById("scatterplotdiv").classList.remove("hidden");
      document.getElementById("barchartdiv").classList.add("hidden");
      document.getElementById("yearselectordiv").classList.add("hidden");

      document.getElementById("page1story").classList.remove("hidden");
      document.getElementById("page2story").classList.add("hidden");
      document.getElementById("page3story").classList.add("hidden");

      d3.select("#mortalitygdptrendannotation").selectAll("*").remove();
      d3.select("#mortalitygdptrendannotationnote").html("");
      d3.select("#usaannotation").selectAll("*").remove();
      d3.select("#usaannotationnote").html("");

      createScatterPlot(selectedYear);
      break;

    case 2:
      document.getElementById("scatterplotdiv").classList.remove("hidden");
      document.getElementById("barchartdiv").classList.add("hidden");
      document.getElementById("yearselectordiv").classList.remove("hidden");

      document.getElementById("page1story").classList.add("hidden");
      document.getElementById("page2story").classList.remove("hidden");
      document.getElementById("page3story").classList.add("hidden");

      d3.select("#subsaharanannotation").selectAll("*").remove();
      d3.select("#subsaharanannotationnote").html("");
      d3.select("#mortalitygdpannotation").selectAll("*").remove();
      d3.select("#mortalitygdpannotationnote").html("");

      simulateProgressScatterPlot(years[0]);
      break;
    case 3:
      document.getElementById("scatterplotdiv").classList.add("hidden");
      document.getElementById("barchartdiv").classList.remove("hidden");
      document.getElementById("yearselectordiv").classList.remove("hidden");

      document.getElementById("page1story").classList.add("hidden");
      document.getElementById("page2story").classList.add("hidden");
      document.getElementById("page3story").classList.remove("hidden");

      simulateProgressBarChart(years[0]);
      break;
  }
}


// Load data (scatterplot)
d3.csv("childmortality_percountry.csv", function(d){
  return {
    CountryCode: d.CountryCode,
    CountryName: d.CountryName,
    Year: +d.Year,
    Value: +d.Value,
    GDPPerCapita: +d.GDPPerCapita,
    Population: +d.Population,
    Region: d.Region,
    IncomeGroup: d.IncomeGroup
  }
}).then(function(d) {
  scatterPlotDataset = d;
  initializePage();
})

// Load data (bar chart)
d3.csv("causeofdeath_total.csv", function(d){
  return {
    CauseOfDeath: d.CauseOfDeath,
    Year: +d.Year,
    Value: +d.Value
  }
}).then(function(d) {
  barChartDataset = d;
  allCauseOfDeaths = Array.from( new Set(barChartDataset.map(function (d) { return d.CauseOfDeath; }) ) );
  createBarChart(selectedYear);
});

//Load data for barchart tooltip
d3.csv("toptencountries_causeofdeath.csv", function(d){
  return {
    CauseOfDeath: d.CauseOfDeath,
    Year: +d.Year,
    Value: +d.Value,
    CountryCode: d.CountryCode,
    CountryName: d.CountryName,
    Region: d.Region,
    Population: d.Population,
    GDPPerCapita: d.GDPPerCapita,
    Rank: +d.Rank,
    IncomeGroup: d.IncomeGroup
  }
}).then(function(d) {
  topTenCountriesDataset = d;
});


// Generate css class for different regions
function getRegionClass(region){
  switch (region){
    case "South Asia": return "southasia";
    case "East Asia & Pacific": return "eastasiapacific";
    case "Europe & Central Asia": return "europecentralasia";
    case "Latin America & Caribbean": return "latinamericacaribbean";
    case "Middle East & North Africa": return "middleeastnorthafrica";
    case "North America": return "northamerica";
    case "Sub-Saharan Africa": return "subsaharanafrica";
  }
}

// Create a scatter plot for a given year
function createScatterPlot(year) {

  svg = d3.select("#scatterplotsvg")
  svg.selectAll("*").remove();

  scatterPlotXScale = d3.scaleLog()
  .domain([100, 300000])
  .range([0, scatterPlotWidth])

  scatterPlotYScale = d3.scaleLog()
  .domain([0.8, 5000000])
  .range([scatterPlotHeight, 0]);

  const xaxis = d3.axisBottom(scatterPlotXScale)
  .tickValues([100, 500, 1000, 5000, 10000, 50000, 100000, 300000])
  .tickFormat(x => d3.format("$,")(x));

  const yaxis = d3.axisLeft(scatterPlotYScale)
  .tickValues([1, 10, 100, 1000, 10000, 100000, 1000000])
  .tickFormat(x => d3.format(",")(x))

  const canvas = svg.append("g")
  .attr("id", "scatterplotcanvas")
  .attr("transform", "translate(" + scatterPlotLeftMargin + "," + scatterPlotTopMargin + ")" )

  svg.append("g")
  .attr("id", "scatterplotyaxis")
  .attr("class", "yaxis")
  .attr("transform", "translate(" + scatterPlotLeftMargin + "," + scatterPlotTopMargin + ")" )
  .call(yaxis)

  svg.append("g")
  .attr("class", "xaxis")
  .attr("transform", "translate(" + scatterPlotLeftMargin + "," + (scatterPlotTopMargin + scatterPlotHeight) + ")" )
  .call(xaxis)

  // Bar chart main title ("Cause of Mortality")
  svg.append("text")
  .attr("id", "scatterplottitle")
  .attr("x", scatterPlotLeftMargin)
  .attr("y", scatterPlotTopMargin / 2)
  .text("Child mortality per country (Year " + year +")" )
  .style("text-anchor", "start");

  // X axis label
  svg.append("text")
  .attr("id", "scatterplotxaxislabel")
  .attr("transform", "translate(" + (scatterPlotLeftMargin + (scatterPlotWidth/2)) + " ," +
                       (scatterPlotTopMargin + scatterPlotHeight + 40) + ")")
  .style("text-anchor", "middle")
  .text("GDP per Capita (constant 2010 US$)");

  svg.append("text")
  .attr("class", "tooltipreminder")
  .attr("transform", "translate(" + (scatterPlotLeftMargin + (scatterPlotWidth/2)) + " ," +
                       (scatterPlotTopMargin + scatterPlotHeight + 60) + ")")
  .style("text-anchor", "middle")
  .text("(hover on data points to see country-specific detailed information)");

  // Y axis label
  svg.append("text")
  .attr("id","scatterplotyaxislabel")
  .attr("transform", "translate(" + (scatterPlotLeftMargin/2 - 15) + " ,"
                    + (scatterPlotTopMargin + scatterPlotHeight /2  ) + ")"
                    + "rotate(-90)"
      )
  .attr("text-anchor", "middle")
  .text("Child Mortality");

  // Create legend
  svg.append("rect")
      .attr("x", scatterPlotLeftMargin + scatterPlotWidth - 190 + 100)
      .attr("y", scatterPlotTopMargin - 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", 190)
      .attr("height",150)
      .style("stroke", "black")
      .style("fill", "none")


  regions = ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean", "Middle East & North Africa", "North America", "South Asia", "Sub-Saharan Africa"];
  colors = ["blue", "orange", "red", "lightblue", "green", "yellow", "purple"];

  const linespace = 20;
  var xpos, ypos;
  for ( var i = 0; i < regions.length; i++ ){
    xpos = scatterPlotLeftMargin + scatterPlotWidth - 70;
    ypos = scatterPlotTopMargin - 5 +  i*linespace;
    svg.append("circle").attr("cx", xpos).attr("cy",ypos).attr("r", 6).attr("class", getRegionClass(regions[i])).style("stroke", "black");
    svg.append("text").attr("x", xpos + 15).attr("y", ypos).text(regions[i]).attr("class", "regiontextlegend").attr("dy", "0.25rem").style("text-anchor","start");
  }


  const data = scatterPlotDataset.filter(country => country.Year==year);

  if ( year == 2000 && selectedPageNr == 1 )
  {
    createAnnotationSubSaharan(data);
    createAnnotationMortalityGDP();
  }

  if ( selectedPageNr == 2 )
  {
    createAnnotationMortalityGDPTrend();
    createAnnotationUSA(year);
  }

  canvas.selectAll(".scatterplotdatapoint")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", function(d) { return getRegionClass(d.Region) + " scatterplotdatapoint"; })
  .attr("cx", function(d, i) { return (d.GDPPerCapita > 0) ? scatterPlotXScale(d.GDPPerCapita) : 0; } )
  .attr("cy", function(d, i) { return (d.Value > 0) ? scatterPlotYScale(d.Value) : scatterPlotYScale(scatterPlotHeight); } )
  .attr("r", 6 )
  .style("visibility", function(d){ return (d.Value == 0 || d.GDPPerCapita == 0) ? "hidden" : "visible"
  })
  .on("mouseover", function(d, i){
    const text1 = "Country <br> Region <br> GDP per capita <br> Mortality <br> Population <br>"
    const text2 = ": <strong>" + d.CountryName + "</strong><br>"
                + ": <strong>" + d.Region + "</strong><br>"
                + ": <strong>" + d3.format("$,.0f")(d.GDPPerCapita) + "</strong><br>"
                + ": <strong>" + d3.format(",.0f")(d.Value) + "</strong><br>"
                + ": <strong>" + d3.format(",.0f")(d.Population) + "</strong><br>";
    d3.select("#scatterPlotTooltiplbl1").html(text1);
    d3.select("#scatterPlotTooltiplbl2").html(text2);
    scatterPlotTooltip.style("opacity", 1)
                      .style("left", (d3.event.pageX)+"px")
                      .style("top", (d3.event.pageY)+"px")

  })
  .on("mouseout", function() {
     scatterPlotTooltip.style("opacity", 0);
     scatterPlotTooltip.select("#scatterPlotTooltiplbl1").html("");
     scatterPlotTooltip.select("#scatterPlotTooltiplbl2").html("");
     scatterPlotTooltip.style("left",0);
     scatterPlotTooltip.style("top",0);
  })
}

function simulateProgressScatterPlot(year) {

  selectedYear = year;
  if ( selectedYear == years[0]){
    // Draw for 1st year
    createScatterPlot(selectedYear);
    updateYearSelectorComponent(selectedYear);

    // Proceed to second year
    selectedYear = selectedYear + 1;

  }

  updateYearSelectorComponent(selectedYear);
  createAnnotationUSA(selectedYear);

  var newdata = scatterPlotDataset.filter(d => d.Year==selectedYear);

  var data = []
  prevdata = d3.select("#scatterplotsvg").select("#scatterplotcanvas").selectAll(".scatterplotdatapoint").data();
  prevdata.forEach(function (prev) {
    arr = newdata.filter(e => e.CountryCode == prev.CountryCode);
    data.push(arr[0])
  })

  var count = data.length;
  d3.select("#scatterplotsvg").select("#scatterplotcanvas").selectAll(".scatterplotdatapoint")
  .data(data)
  .transition()
  .duration(500)
  .attr("cx", function(d, i) { return (d.GDPPerCapita > 0) ? scatterPlotXScale(d.GDPPerCapita) : 0; } )
  .attr("cy", function(d, i) { return (d.Value > 0) ? scatterPlotYScale(d.Value) : scatterPlotYScale(scatterPlotHeight); } )
  .attr("r", 6 )
  .style("visibility", function(d){ return (d.Value == 0 || d.GDPPerCapita == 0) ? "hidden" : "visible"
  })
  .on("end", function() {
    count = count - 1;
    if ( selectedPageNr != 2 ) { initializePage }
    else if ( count == 0 && selectedYear < 2017 ) { simulateProgressScatterPlot(selectedYear + 1) };
  })

  // Update  chart main title ("Cause of Mortality")
  svg.select("#scatterplottitle")
  .attr("x", scatterPlotLeftMargin)
  .attr("y", scatterPlotTopMargin / 2)
  .text("Child mortality per country (Year " + selectedYear +")" )
  .style("text-anchor", "start");
}


// Making sure that the data always has the complete set of Cause of Death
function  constructBarChartData(data) {
  result = []
  year = data[0].Year;
  allCauseOfDeaths.forEach( function(causeOfDeath) {
    const arr = data.filter(d => d.CauseOfDeath == causeOfDeath);
    if ( arr.length > 0 ){
      result.push(arr[0])
    }
    else {
      result.push( {CauseOfDeath: causeOfDeath, Year: year, Value: 0});
    }
  })
  return result;
}

// return top ten countries with most cause of Death
function getTopTenCountries (year, causeOfDeath ) {
  var result = topTenCountriesDataset.filter(
    e => e.CauseOfDeath == causeOfDeath
        && e.Year == year
        && e.Value > 0
  )

  result.sort(function(a, b){
    return a.Value > b.Value ? -1 : 1;
  })
  return result;
}


// Create a bar chart for a given year
function createBarChart(year) {

  var data = barChartDataset.filter(d => d.Year==year);
  data = constructBarChartData(data);

  // Sort data descending on CauseOfDeath value
  data.sort(function(a, b){return a.Value > b.Value ? -1 : 1; });
  domainCauseOfDeath = data.map((e)=> e.CauseOfDeath)

  svg = d3.select("#barchartsvg");
  svg.selectAll("*").remove();

  barChartXScale = d3.scaleLinear()
  .domain([0,
           d3.max(barChartDataset, function(d){ return d.Value})])
  .range([0, barChartWidth])

  barChartYScale = d3.scaleBand()
              .domain(domainCauseOfDeath)
              .range([0, barChartHeight]);

  var xaxis = d3.axisBottom(barChartXScale).tickFormat(x => d3.format(",")(x));
  var yaxis = d3.axisLeft(barChartYScale);

  var canvas = svg.append("g")
  .attr("id", "barchartcanvas")
  .attr("transform", "translate(" + barChartLeftMargin + "," + barChartTopMargin + ")" )

  svg.append("g")
  .attr("class", "yaxis")
  .attr("id", "barchartyaxis")
  .attr("transform", "translate(" + barChartLeftMargin + "," + barChartTopMargin + ")" )
  .call(yaxis);

  svg.append("g")
  .attr("class", "xaxis")
  .attr("id", "barchartxaxis")
  .attr("transform", "translate(" + barChartLeftMargin + "," + (barChartTopMargin+barChartHeight) + ")" )
  .call(xaxis);

  // Drawing bar chart
  canvas.selectAll(".barchartdatapoint")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "barchartdatapoint" )
  .attr("x", 0 )
  .attr("y", function(d, i) { return barChartYScale(d.CauseOfDeath) + 2; })
  .attr("width", function(d, i){ return barChartXScale(d.Value); } )
  .attr("height", barChartYScale.bandwidth() - 4)
  .style("stroke", "black")
  .on("mouseover", function(d) {
    var topTenCountries = getTopTenCountries(d.Year, d.CauseOfDeath);

    var text = 'Cause: '  + d.CauseOfDeath
             + "<br>" + "Mortality: "  +  d3.format(",.0f")(d.Value)
             + "<br>" + "Top 10 contributing countries: ";

    barChartTooltip.select("#labelBarChartToolTip").html(text)

    var tableBody = barChartTooltip.select("table").select("tbody");
    tableBody.selectAll("*").remove();
    tableRows =tableBody.selectAll("tr")
              .data(topTenCountries)
              .enter()
              .append("tr")
              .each(function (d) {
                d3.select(this).append("td").html(d.CountryName);
                d3.select(this).append("td").html(d3.format(",.0f")(d.Value));
              })

    barChartTooltip.style("opacity", 1)
                        .style("left", (d3.event.pageX + 10)+"px")
                        .style("top", (d3.event.pageY - 100)+"px")
                        .style("z-index", 5)

    })
  .on("mouseout", function() {
       barChartTooltip.style("opacity", 0);
       barChartTooltip.style("z-index", 0);
    })

  // Bar chart main title ("Cause of Mortality")
  svg.append("text")
  .attr("id", "barcharttitle")
  .attr("x", barChartLeftMargin)
  .attr("y", barChartTopMargin / 2)
  .text("Cause of child mortality (Year " + year + ")" )
  .style("text-anchor", "start");

  // X axis title ("Mortality")
  svg.append("text")
  .attr("id", "barchartxaxislabel")
  .attr("transform", "translate(" + (barChartLeftMargin + (barChartWidth/2)) + " ," +
                       (barChartTopMargin + barChartHeight + 40) + ")")
  .style("text-anchor", "middle")
  .text("Mortality");

  svg.append("text")
  .attr("class", "tooltipreminder")
  .attr("transform", "translate(" + (barChartLeftMargin + (barChartWidth/2)) + " ," +
                       (barChartTopMargin + barChartHeight + 60) + ")")
  .style("text-anchor", "middle")
  .text("(hover on the bar to see detailed information)");


  // Label values for each bar
  canvas.selectAll(".barchartlabelvalue")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "barchartlabelvalue")
  .attr('x', function(d) { return barChartXScale(d.Value) + 5; } )
  .attr('y', function(d) {return barChartYScale(d.CauseOfDeath) + barChartYScale.bandwidth() / 2; })
  .style("text-anchor", "start")
  .text(function(d) { return d3.format(",.0f")(d.Value);});


  //Add total mortality in the bottom right;
  var totalmortality = 0;
  data.forEach(e => totalmortality += e.Value);

  var text = svg.append("text")
            .attr("id", "barcharttotalmortality")
            .attr("transform", "translate(" + (barChartLeftMargin + barChartWidth - 20) + " ," +
                                 (barChartTopMargin + barChartHeight -75) + ")")

  text.append("tspan")
      .text ("Total Mortality:")
      .style("text-anchor", "end")

  text.append("tspan")
      .attr("id", "totalmortalitytext")
      .attr("y", 40)
      .attr("x", 0)
      .text (d3.format(",.0f")(totalmortality))
      .style("text-anchor", "end")

  if ( year == 2017 ) {
    createAnnotationPrematurity();
    createAnnotationDiarrhoealMalaria();
    createAnnotationTotalMortality();
  }
  else{
    d3.select("#prematurityannotation").selectAll("*").remove();
    d3.select("#prematurityannotationnote").html("");
    d3.select("#diarrhoealmalariaannotation").selectAll("*").remove();
    d3.select("#diarrhoealmalariaannotationnote").html("");
    d3.select("#totalmortalityannotation").selectAll("*").remove();
    d3.select("#totalmortalityannotationnote").html("");

  }
}


function simulateProgressBarChart(year) {

  selectedYear = year;
  if ( selectedYear == years[0]){
    updateYearSelectorComponent(selectedYear);
    createBarChart(selectedYear);

    selectedYear = selectedYear + 1;
  }

  updateYearSelectorComponent(selectedYear)

  d3.select("#prematurityannotation").selectAll("*").remove();
  d3.select("#prematurityannotationnote").html("");
  d3.select("#diarrhoealmalariaannotation").selectAll("*").remove();
  d3.select("#diarrhoealmalariaannotationnote").html("");
  d3.select("#totalmortalityannotation").selectAll("*").remove();
  d3.select("#totalmortalityannotationnote").html("");

  var newdata = barChartDataset.filter(d => d.Year==selectedYear);
  newdata = constructBarChartData(newdata);

  var data = []
  prevdata = d3.select("#barchartsvg").select("#barchartcanvas").selectAll(".barchartdatapoint").data();
  prevdata.forEach(function (prev) {
    arr = newdata.filter(e => e.CauseOfDeath == prev.CauseOfDeath);
    data.push(arr[0])
  })

  newdata.sort(function(a, b){ return a.Value > b.Value ? -1 : 1; });
  var domainCauseOfDeath = newdata.map(function (d) { return d.CauseOfDeath; });

  barChartYScale = d3.scaleBand()
  .domain(domainCauseOfDeath)
  .range([0, barChartHeight]);

  var yaxis = d3.axisLeft(barChartYScale)
  d3.select("#barchartsvg").select(".yaxis")
  .call(yaxis);

  // Update Bar chart main title ("Cause of Mortality")
  d3.select("#barcharttitle").text("Cause of child mortality (Year " + year + ")" );

  var count = data.length;
  d3.select("#barchartsvg").select("#barchartcanvas").selectAll(".barchartdatapoint")
  .data(data)
  .transition()
  .duration(500)
  .attr("x", 0 )
  .attr("y", function(d, i) { return barChartYScale(d.CauseOfDeath) + 2; })
  .attr("width", function(d, i){ return barChartXScale(d.Value); } )
  .attr("height", barChartYScale.bandwidth() - 4)
  .on("end", function() {
    count = count - 1;
    if ( selectedPageNr != 3 ) { initializePage }
    else if ( count == 0 ) {
      if ( selectedYear < 2017 ) {
        simulateProgressBarChart(selectedYear + 1);
      } else {
        createAnnotationPrematurity();
        createAnnotationDiarrhoealMalaria();
        createAnnotationTotalMortality();
      }
    }
  })

  // Label values for each bar
  d3.select("#barchartsvg").select("#barchartcanvas").selectAll(".barchartlabelvalue")
  .data(data)
  .transition()
  .duration(500)
  .attr('x', function(d) { return barChartXScale(d.Value) + 5; } )
  .attr('y', function(d) {return barChartYScale(d.CauseOfDeath) + barChartYScale.bandwidth() / 2 + 5; })
  .style("text-anchor", "start")
  .text(function(d) { return d3.format(",.0f")(d.Value);});

  // Update total mortality value
  var totalmortality = 0;
  data.forEach(e => totalmortality += e.Value);
  d3.select("#totalmortalitytext").text (d3.format(",.0f")(totalmortality))

}

function getScatterPlotCanvasX() {
  return window.pageXOffset
        + document.getElementById("scatterplotsvg").getBoundingClientRect().x
        + scatterPlotLeftMargin;

}

function getScatterPlotCanvasY() {
  return window.pageYOffset
        + document.getElementById("scatterplotsvg").getBoundingClientRect().y
        + scatterPlotTopMargin;

}

function getBarChartCanvasX() {
  return window.pageXOffset
        + document.getElementById("barchartsvg").getBoundingClientRect().x
        + barChartLeftMargin;

}

function getBarChartCanvasY() {
  return window.pageYOffset
        + document.getElementById("barchartsvg").getBoundingClientRect().y
        + barChartTopMargin;

}

function createAnnotationSubSaharan(data) {

  canvas = d3.select("#scatterplotsvg").select("#scatterplotcanvas");
  var annotation = d3.select("#subsaharanannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                  .attr("id", "subsaharanannotation");
  }
  annotation.selectAll("*").remove();


  // SubSaharanAfrica annotation
  //rect
  const topLeftCountry = data.filter(d => d.CountryName == "Ethiopia")[0];
  const topRightCountry = data.filter(d => d.CountryName == "Pakistan")[0];
  const bottomCountry = data.filter(d => d.CountryName == "Liberia")[0];

  const rectx1= scatterPlotXScale(topLeftCountry.GDPPerCapita) - 6; // 80;
  const recty1= scatterPlotYScale(topRightCountry.Value) - 7//80;
  const rectwidth= scatterPlotXScale(topRightCountry.GDPPerCapita) - rectx1 //190;
  const rectheight= scatterPlotYScale(bottomCountry.Value) + 8 - recty1 //140;
  annotation.append("rect")
            .attr("class", "annotationarea")
            .attr("x", rectx1)
            .attr("y", recty1)
            .attr("width", rectwidth)
            .attr("height", rectheight)
  //line
  const dx1=rectwidth / 2;
  const dy1=rectheight;
  const dx=0;
  const dy=100;

  const x1 = rectx1 + rectwidth / 2;
  const y1 = recty1 + rectheight;
  const x2 = x1;
  const y2 = scatterPlotYScale(1000);

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

  text = "Sub Saharan African countries (purple) have the most child mortality"

  const textdx = -75;
  const textdy = 5;

  const left = getScatterPlotCanvasX() + x2 + textdx;
  const top = getScatterPlotCanvasY() + y2 + textdy;

  var note = d3.select("#subsaharanannotationnote");
  if ( note.size() == 0){
    note = d3.select("#scatterplotdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "subsaharanannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "150px")
      .html(text)

}


function createAnnotationMortalityGDP() {

  const linex1 = scatterPlotXScale(300)
  const liney1 = scatterPlotYScale(1000000)
  const linex2 = scatterPlotXScale(150000)
  const liney2 = scatterPlotYScale(1)


  canvas = d3.select("#scatterplotsvg").select("#scatterplotcanvas");

  var annotation = d3.select("#mortalitygdpannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "mortalitygdpannotation");
  }
  annotation.selectAll("*").remove();

  annotation.append("line")
            .attr("class", "annotationline")
            .attr("x1", linex1)
            .attr("y1", liney1)
            .attr("x2", linex2)
            .attr("y2", liney2)

  // create annotation circle area and scaleLine
  const circlex = scatterPlotXScale(14000);
  const circley = scatterPlotYScale(200);
  const radius = 15;

  annotation.append("circle")
            .attr("class", "annotationarea")
            .attr("cx", circlex)
            .attr("cy", circley)
            .attr("r", radius)

  //lineconnector
  const x1 = circlex;
  const y1 = circley;
  const x2 = x1;
  const y2 = scatterPlotYScale(500000);

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

  text = "A relationship between GDP per capita and child mortality: "
       + "countries with higher GDP per capita tend so have lower child mortality"

  const textdx = -100;
  const textdy = -70;

  const left = getScatterPlotCanvasX() + x2 + textdx;
  const top = getScatterPlotCanvasY() + y2 + textdy;

  var note = d3.select("#mortalitygdpannotationnote");
  if ( note.size() == 0){
    note = d3.select("#scatterplotdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "mortalitygdpannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "200px")
      .html(text)
}


function createAnnotationMortalityGDPTrend() {

  const linex1 = scatterPlotXScale(400)
  const liney1 = scatterPlotYScale(500)
  const linex2 = scatterPlotXScale(1000)
  const liney2 = scatterPlotYScale(70)

  canvas = d3.select("#scatterplotsvg").select("#scatterplotcanvas");

  var annotation = d3.select("#mortalitygdptrendannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "mortalitygdptrendannotation");
  }
  annotation.selectAll("*").remove();

  annotation.append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("refX", 1)
  .attr("refY", 24)
  .attr("markerUnits","userSpaceOnUse")
  .attr("markerWidth", 48)
  .attr("markerHeight",48)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0 0 L 48 24 L 0 48 z")

  annotation.append("polyline")
            .attr("id", "mortalitygdptrendannotationline")
            .attr("points", linex1 +  "," + liney1 + " " + linex2 + "," + liney2 )
            .attr("marker-end", "url(#arrow)")

  text = "Over a period of 2 decades most countries have progressed "
       + "with increasing GDP per capita and decreasing child mortality."

  const textx = getScatterPlotCanvasX() + linex2 - 180;
  const texty = getScatterPlotCanvasY() + liney2;


  var note = d3.select("#mortalitygdptrendannotationnote");
  if ( note.size() == 0){
    note = d3.select("#scatterplotdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "mortalitygdptrendannotationnote")
  }

  note.style("left", textx + "px")
      .style("top", texty + "px")
      .style("width", "160px")
      .html(text)
}


function createAnnotationUSA(year) {
  canvas = d3.select("#scatterplotsvg").select("#scatterplotcanvas");
  const usdatapoint = scatterPlotDataset.filter(e => e.CountryCode == "USA" && e.Year == year)[0];

  var annotation = d3.select("#usaannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "usaannotation");
  }
  annotation.selectAll("*").remove();

  // create annotation circle area and scaleLine
  const circlex = scatterPlotXScale(usdatapoint.GDPPerCapita);
  const circley = scatterPlotYScale(usdatapoint.Value);
  const radius = 15;

  annotation.append("circle")
            .attr("class", "annotationarea")
            .attr("cx", circlex)
            .attr("cy", circley)
            .attr("r", radius)

  //lineconnector
  const x1 = circlex;
  const y1 = circley;
  const x2 = x1 + 50;
  const y2 = y1 + 50;

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

  text = "US has relatively higher mortality among higher "
        +"income countries due to its large population size"

  const textdx = 20;
  const textdy = -20;

  const left = getScatterPlotCanvasX()+ x2 + textdx;
  const top = getScatterPlotCanvasY() + y2 + textdy;

  var note = d3.select("#usaannotationnote");
  if ( note.size() == 0){
    note = d3.select("#scatterplotdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "usaannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "150px")
      .html(text)

}


function createAnnotationPrematurity() {

  canvas = d3.select("#barchartsvg").select("#barchartcanvas");

  var data = canvas.selectAll(".barchartdatapoint").data();
  var datapoint = data.filter(d => d.CauseOfDeath == "Prematurity")[0];

  var annotation = d3.select("#prematurityannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "prematurityannotation");
  }
  annotation.selectAll("*").remove();


  // create annotation circle area and scaleLine
  const circlex = barChartXScale(datapoint.Value);
  const circley = barChartYScale(datapoint.CauseOfDeath) + barChartYScale.bandwidth() / 2;
  const radius = 15;

  annotation.append("circle")
            .attr("class", "annotationarea")
            .attr("cx", circlex)
            .attr("cy", circley)
            .attr("r", radius)

  //lineconnector
  const x1 = circlex;
  const y1 = circley;
  const x2 = barChartXScale(1100000);
  const y2 = y1 + 20;

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

  text = "Since 2011 prematurity has become the most leading cause of child mortality worldwide"

  const textdx = 20;
  const textdy = -20;

  const left = getBarChartCanvasX()+ x2 + textdx;
  const top = getBarChartCanvasY() + y2 + textdy;

  var note = d3.select("#prematurityannotationnote");
  if ( note.size() == 0){
    note = d3.select("#barchartdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "prematurityannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "200px")
      .html(text)

}


function createAnnotationDiarrhoealMalaria() {

  canvas = d3.select("#barchartsvg").select("#barchartcanvas");

  var data = canvas.selectAll(".barchartdatapoint").data();
  var datapoint1 = data.filter(d => d.CauseOfDeath == "Diarrhoeal diseases")[0];
  var datapoint2 = data.filter(d => d.CauseOfDeath == "Malaria")[0];


  var annotation = d3.select("#diarrhoealmalariaannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "diarrhoealmalariaannotation");
  }
  annotation.selectAll("*").remove();


  // create annotation circle area and scaleLine
  // Annotation circle and line for Diarrhoeal diseases"
  const circlex = barChartXScale(datapoint1.Value);
  const circley = barChartYScale(datapoint1.CauseOfDeath) + barChartYScale.bandwidth() / 2;
  const radius = 15;

  annotation.append("circle")
            .attr("class", "annotationarea")
            .attr("cx", circlex)
            .attr("cy", circley)
            .attr("r", radius)

  //lineconnector
  const x1 = circlex;
  const y1 = circley;
  const x2 = barChartXScale(850000);
  const y2 = y1 - 30;

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)


  // Annotation circle and line for Malaria"
  const circlex_2 = barChartXScale(datapoint2.Value);
  const circley_2 = barChartYScale(datapoint2.CauseOfDeath) + barChartYScale.bandwidth() / 2;
  const radius_2 = 15;

  annotation.append("circle")
            .attr("class", "annotationarea")
            .attr("cx", circlex_2)
            .attr("cy", circley_2)
            .attr("r", radius_2)

  //lineconnector
  const x1_2 = circlex_2;
  const y1_2 = circley_2;
  const x2_2 = x2;
  const y2_2 = y2 + 20;

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1_2)
            .attr("y1", y1_2)
            .attr("x2", x2_2)
            .attr("y2", y2_2)


  const text = "Diarrhoeal diseases and malaria have dropped their ranks  "
       + "in the causes of child mortality list"

  const textdx = 20;
  const textdy = -10;

  const left = getBarChartCanvasX()+ x2  + textdx;
  const top = getBarChartCanvasY() + y2 + textdy;


  var note = d3.select("#diarrhoealmalariaannotationnote");
  if ( note.size() == 0){
    note = d3.select("#barchartdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "diarrhoealmalariaannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "200px")
      .html(text)

}


function createAnnotationTotalMortality() {

  canvas = d3.select("#barchartsvg").select("#barchartcanvas");

  var annotation = d3.select("#totalmortalityannotation");
  if ( annotation.size() == 0 ){
    annotation = canvas.append("g")
                .attr("id", "totalmortalityannotation");
  }
  annotation.selectAll("*").remove();



  // create annotation  area
  const rect_x2 = barChartWidth - 10;
  const rect_y2 = barChartHeight - 20;
  const rect_x1 = rect_x2 - 220;
  const rect_y1 = rect_y2 - 90;


  annotation.append("rect")
            .attr("class", "annotationarea")
            .attr("x", rect_x1)
            .attr("y", rect_y1)
            .attr("width", rect_x2-rect_x1)
            .attr("height",rect_y2-rect_y1)

  //lineconnector
  const x1 = ( rect_x1 + rect_x2 ) / 2;
  const y1 = rect_y1;
  const x2 = x1
  const y2 = y1 - 30;

  annotation.append("line")
            .attr("class", "annotationconnector")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

  text = "The total number of child mortality in the past 2 decades has reduced "
       + "by 45.8%";

  const textdx = - (rect_x2 - rect_x1 ) *0.75 / 2;
  const textdy = -60;

  const left = getBarChartCanvasX()+ x2 + textdx;
  const top = getBarChartCanvasY() + y2 + textdy;

  var note = d3.select("#totalmortalityannotationnote");
  if ( note.size() == 0){
    note = d3.select("#barchartdiv")
            .append("div")
            .attr("class", "annotationnote")
            .attr("id", "totalmortalityannotationnote")
  }

  note.style("left", left + "px")
      .style("top", top + "px")
      .style("width", "200px")
      .html(text)

}
