function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

queue()
    .defer(d3.json, "/Galactic_index/Planets")
    .defer(d3.json, "/Galactic_index/Companies")
    .await(makePlanetGraphs, makeCompanyGraphs);


function makePlanetGraphs(error, planets) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    if ( $('#isMobile').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 350
        var graphHeight = 350
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100

        }
    if ( $('#isTablet').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 750
        var graphHeight = 450
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100

        }
    if ( $('#isLarge').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 1000
        var graphHeight = 500
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100
        }

    //Create a Crossfilter instance
    var planetsNdx = crossfilter(planets);
    // Create Planet graph dimensions
    var myPlanets = planetsNdx.dimension(function (d) {return d['PlanetName'];});
    var myPlanetsGroup = myPlanets.group();
    var population = myPlanets.group().reduceSum(function (d) {return d['Population'];});


    // habitability pie chart
    var habitability = planetsNdx.dimension(function (d) {return d['Habitability'];});
    var habitabilityGroup = habitability.group();
    // habitability climate chart
    var climate = planetsNdx.dimension(function (d) {return d['Climate'];});
    var climateTotal = climate.group();

    // assign charts to html objects
    var populationPie = dc.pieChart("#populationPie");
    var climatePie = dc.pieChart("#climatePie");
    var populationBarChart = dc.barChart("#populationBarChart");

    var myColors = [
    '#1fbbd7','#db3030','#e8e62c','#de2eaa','#1fd977','#e79b24','#9930db','#91d526', '#56cce1','#dc5353','#e7e563','#e355b9',
    '#5be19a','#ffc05d','#b567e7','#aeea57', '#88d9e8','#de7070','#edec97','#ea7eca','#7feab1','#ffcd7f','#bf86e3','#caf192',]

    populationBarChart
          .ordinalColors(['#1fbbd7'])
          .margins({top: 0, right: 20, bottom: 150, left: marginLR})
          .width(graphWidth)
          .height(graphHeight+200)
          .x(d3.scale.ordinal())
          .xUnits(dc.units.ordinal)
          .elasticY(true)
          .brushOn(false)
          .xAxisLabel(['Planet Names'])
          .yAxisLabel(['Population'], 18)
          .barPadding(0.1)
          .outerPadding(0.05)
          .dimension(myPlanets)
          .group(population);

    populationPie
        .ordinalColors(myColors)
        .width(pieWidth)
        .height(pieWidth)
        .slicesCap(10)
        .innerRadius(donutHole)
        .minAngleForLabel([0.2])
        .dimension(habitability)
        .group(habitabilityGroup);

    climatePie
        .ordinalColors(myColors)
        .width(pieWidth)
        .height(pieWidth)
        .slicesCap(10)
        .innerRadius(donutHole)
        .minAngleForLabel([0.2])
        .dimension(climate)
        .group(climateTotal);

    dc.renderAll();

}

queue()
    .defer(d3.json, "/Galactic_index/Companies")
    .await(makeCompanyGraphs);

function makeCompanyGraphs(error, companies) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    if ( $('#isMobile').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 350
        var graphHeight = 350
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100
        }
    if ( $('#isTablet').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 750
        var graphHeight = 450
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100
        }
    if ( $('#isLarge').css('display') !== 'none' ){
    // element is hidden
        var graphWidth = 1000
        var graphHeight = 500
        var pieWidth = 200
        var donutHole = 20
        var marginLR = 100
        }

    var companyNdx = crossfilter(companies);

    // COMPANIES BELOW
    // Create Company graph dimensions
    var myCompanies = companyNdx.dimension(function (d) {return d['CompanyName'];});
    var myCompaniesGroup = myCompanies.group();

    var stockPrices = companyNdx.dimension(function (d) {return d['StockPrices'];});
//    var stockPricesGroup = stockPrices.group()
    var stockPricesGroup = stockPrices.group().reduceSum(function (d) {return d['StockPrices'];});

    // spaceport size pie chart
    var numberOfSpaceports = companyNdx.dimension(function (d) {return d['NumberOfSpaceports'];});
    var spaceportTotal = numberOfSpaceports.group();

    // spaceships number pie chart
    var numberOfSpaceships = companyNdx.dimension(function (d) {return d['NumberOfSpaceships'];});
    var spaceshipsTotal = numberOfSpaceships.group();

    // Companies Bubble chart
    var companyMoney = myCompanies.group().reduceSum(function (d) {return d['Money'];});
    var companyAge = companyNdx.dimension(function (d) {return d['CompanyAge'];});
    var minDate = companyAge.bottom(1)[0]['CompanyAge'];
    var maxDate = companyAge.top(1)[0]['CompanyAge'];
    // This is a custom variable grouper, i think it works by storing two dimensional values
    // and gives charts the ability to access both, for bubble charts for example.
    var companyBubbleGroup = myCompanies.group().reduce(
        function (p, v) {
            p.money += +v["Money"];
            p.age += +v["CompanyAge"];
            return p;
        },
        function (p, v) {
            p.money -= +v["Money"];
            p.age -= +v["CompanyAge"];
            return p;
        },
        function () {
            return {money: 0, age: 0}
        }
    );

    // company chart
    var companyRowChart = dc.rowChart("#companyRowChart");
    var companySpaceportPie = dc.pieChart("#numberOfSpaceports")
    var companySpaceshipPie = dc.pieChart("#numberOfSpaceships")
    var companyBubbleChart = dc.bubbleChart('#companyBubbleChart');
    var companySelect = dc.selectMenu('#companySelector')

    var myColors = [
    '#1fbbd7','#db3030','#e8e62c','#de2eaa','#1fd977','#e79b24','#9930db','#91d526', '#56cce1','#dc5353','#e7e563','#e355b9',
    '#5be19a','#ffc05d','#b567e7','#aeea57', '#88d9e8','#de7070','#edec97','#ea7eca','#7feab1','#ffcd7f','#bf86e3','#caf192',]

    //define chart functions

    companySelect
        .dimension(myCompanies)
        .group(myCompaniesGroup)

    companyRowChart
        .ordinalColors(myColors)
        .width((graphWidth/2)-200)
        .height(graphHeight+58)
        .dimension(stockPrices)
        .group(stockPricesGroup)
        .elasticX(true)
        .x(d3.scale.ordinal())
        .xAxis().ticks(3);

    companySpaceportPie
       .ordinalColors(myColors)
       .width(pieWidth)
       .height(pieWidth)
       .slicesCap(10)
       .innerRadius(donutHole)
       .minAngleForLabel([0.2])
       .dimension(numberOfSpaceports)
       .group(spaceportTotal);

    companySpaceshipPie
        .ordinalColors(myColors)
       .width(pieWidth)
       .height(pieWidth)
       .slicesCap(10)
       .innerRadius(donutHole)
       .minAngleForLabel([0.2])
       .dimension(numberOfSpaceships)
       .group(spaceshipsTotal);

    companyBubbleChart
       .ordinalColors(myColors)
       .margins({top: 20, right: 20, bottom: 150, left: marginLR})
       .width(graphWidth-200)
       .height(graphHeight+200)
       .elasticY(true)
       .brushOn(false)
       .title(function(d) { return d.key + ': ' + d.value.age + ' Cycles' + ' | Credits ' + d.value.money; })
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel('Company Names')
       .yAxisLabel('Money', 18)
       .renderHorizontalGridLines(true)
       .renderVerticalGridLines(true)
//       .yAxisPadding(1)
//       .xAxisPadding(1000000)
       .dimension(myCompanies)
       .group(companyBubbleGroup)
       .maxBubbleRelativeSize(0.08)
//       .mouseZoomable(true)
       .valueAccessor(function (p) {
            return p.value.money;
       })
       .radiusValueAccessor(function(p) {
            return p.value.age;
       })
       .r(d3.scale.linear().domain([minDate, maxDate]));

    dc.renderAll();
}



