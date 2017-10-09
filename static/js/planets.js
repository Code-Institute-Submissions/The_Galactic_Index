function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

queue()
    .defer(d3.json, "/Galactic_index/Planets")
    .await(makePlanetGraphs);




function makePlanetGraphs(error, planets) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    var myColors = [
    '#1fbbd7','#db3030','#e8e62c','#de2eaa','#1fd977','#e79b24','#9930db','#91d526', '#56cce1','#dc5353','#e7e563','#e355b9',
    '#5be19a','#ffc05d','#b567e7','#aeea57', '#88d9e8','#de7070','#edec97','#ea7eca','#7feab1','#ffcd7f','#bf86e3','#caf192',]
    var minAmountColors = ['#1fbbd7','#db3030']
    var minPriceColors = ['#e8e62c','#de2eaa','#1fd977','#e79b24','#9930db','#91d526']
    current_planet = 0 // will tell refresh functions which planet is being viewed.

    if ( $('#isMobile').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 300
            var graphHeight = 325
            var marginsLR = 40
            }
    if ( $('#isTablet').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 400
            var graphHeight = 325
            var marginsLR = 45
            }
    if ( $('#isLarge').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 450
            var graphHeight = 400
            var marginsLR = 50
            }

// I wrote this except the REGEX (which i don't understand well!) at the end, it was was an
//  answer on stack overflow, i used it because .toLocaleString() didn't work well, its adds commas
    populationString = String(planets[current_planet].Population).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//  Display certain information as text, using a simple jquery function for this.
    $("#nameHolder").text(planets[current_planet].PlanetName);
    $("#habitabilityHolder").text(planets[current_planet].Habitability);
    $("#climateHolder").text(planets[current_planet].Climate);
    $("#populationHolder").text(populationString);
    $("#economicHolder").text(planets[current_planet].EconomicStatus);

// Below is now the code for DC charts
    gasLevels = planets[current_planet].MineralsGas;
    liquidLevels = planets[current_planet].MineralsLiquid;
    solidLevels = planets[current_planet].MineralsSolid;
    console.log(gasLevels);
    console.log(liquidLevels);
    console.log(solidLevels);
    console.log(current_planet);
    gassesNdx = crossfilter(gasLevels);
    liquidsNdx = crossfilter(liquidLevels);
    solidsNdx = crossfilter(solidLevels);

//        GASSES
    var myGasses = gassesNdx.dimension(function (d) {return d['name'];});
    var myGassesGroup = myGasses.group().reduceSum(function (d) {return d['amount'];});
    var myGassesNeededGroup = myGasses.group().reduceSum(function (d) {return d['need'];});

    var myGassesPricesBuy = myGasses.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
    var myGassesPricesSell = myGasses.group().reduceSum(function (d) {return d['ChartSellPrice'];});
    var myGassesHighPricesBuy = myGasses.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
    var myGassesLowPricesBuy = myGasses.group().reduceSum(function (d) {return d['LowBuyPrice'];});
    var myGassesHighPricesSell = myGasses.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
    var myGassesLowPricesSell = myGasses.group().reduceSum(function (d) {return d['LowSellPrice'];});

//        LIQUIDS
    var myLiquids = liquidsNdx.dimension(function (d) {return d['name'];});
    var myLiquidsGroup = myLiquids.group().reduceSum(function (d) {return d['amount'];});
    var myLiquidsNeededGroup = myLiquids.group().reduceSum(function (d) {return d['need'];});

    var myLiquidsPricesBuy = myLiquids.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
    var myLiquidsPricesSell = myLiquids.group().reduceSum(function (d) {return d['ChartSellPrice'];});
    var myLiquidsHighPricesBuy = myLiquids.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
    var myLiquidsLowPricesBuy = myLiquids.group().reduceSum(function (d) {return d['LowBuyPrice'];});
    var myLiquidsHighPricesSell = myLiquids.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
    var myLiquidsLowPricesSell = myLiquids.group().reduceSum(function (d) {return d['LowSellPrice'];});

//        SOLIDS
    var mySolid = solidsNdx.dimension(function (d) {return d['name'];});
    var mySolidGroup = mySolid.group().reduceSum(function (d) {return d['amount'];});
    var mySolidNeededGroup = mySolid.group().reduceSum(function (d) {return d['need'];});

    var mySolidPricesBuy = mySolid.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
    var mySolidPricesSell = mySolid.group().reduceSum(function (d) {return d['ChartSellPrice'];});
    var mySolidHighPricesBuy = mySolid.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
    var mySolidLowPricesBuy = mySolid.group().reduceSum(function (d) {return d['LowBuyPrice'];});
    var mySolidHighPricesSell = mySolid.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
    var mySolidLowPricesSell = mySolid.group().reduceSum(function (d) {return d['LowSellPrice'];});

    // assign charts to html objects
    var gasChart = dc.barChart("#gasBarChart");
    var gasPriceBuyChart = dc.barChart("#gasPriceBuyChart");
    var liquidChart = dc.barChart("#liquidBarChart");
    var liquidPriceBuyChart = dc.barChart("#liquidPriceBuyChart");
    var solidChart = dc.barChart("#solidBarChart");
    var solidPriceBuyChart = dc.barChart("#solidPriceBuyChart");


    gasChart
        .ordinalColors(myColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Gaseous Elements'])
        .yAxisLabel(['Element Levels'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myGasses)
        .group(myGassesGroup)
        .stack(myGassesNeededGroup);


    gasPriceBuyChart
        .ordinalColors(minPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Gaseous Elements'])
        .yAxisLabel(['Element Levels'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myGasses)
        .group(myGassesLowPricesBuy)
        .stack(myGassesPricesBuy)
        .stack(myGassesHighPricesBuy)
        .stack(myGassesLowPricesSell)
        .stack(myGassesPricesSell)
        .stack(myGassesHighPricesSell);


    liquidChart
        .ordinalColors(myColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Liquid Elements'])
        .yAxisLabel(['Element Levels'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myLiquids)
        .group(myLiquidsGroup)
        .stack(myLiquidsNeededGroup);


    liquidPriceBuyChart
        .ordinalColors(minPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Liquid Elements'])
        .yAxisLabel(['Element Price'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myLiquids)
        .group(myLiquidsLowPricesBuy)
        .stack(myLiquidsPricesBuy)
        .stack(myLiquidsHighPricesBuy)
        .stack(myLiquidsLowPricesSell)
        .stack(myLiquidsPricesSell)
        .stack(myLiquidsHighPricesSell);

    solidChart
        .ordinalColors(myColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Solid Elements'])
        .yAxisLabel(['Element Levels'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(mySolid)
        .group(mySolidGroup)
        .stack(mySolidNeededGroup);


    solidPriceBuyChart
        .ordinalColors(minPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Solid Elements'])
        .yAxisLabel(['Element Price'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(mySolid)
        .group(mySolidLowPricesBuy)
        .stack(mySolidPricesBuy)
        .stack(mySolidHighPricesBuy)
        .stack(mySolidLowPricesSell)
        .stack(mySolidPricesSell)
        .stack(mySolidHighPricesSell);

    dc.renderAll();

    $(document).ready(function(){
        $("#planetChange").click(function() {
            current_planet += 1;
            if (current_planet > 19) {
                current_planet = 0
            }
            // I made wrote this except the REGEX (which i don't understand well!) at the end was an
            //  answer on stack overflow, i used it because .toLocaleString() didn't work well, its adds commas
            populationString = String(planets[current_planet].Population).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // text data
            $("#nameHolder").text(planets[current_planet].PlanetName);
            $("#habitabilityHolder").text(planets[current_planet].Habitability);
            $("#climateHolder").text(planets[current_planet].Climate);
            $("#populationHolder").text(populationString);
            $("#economicHolder").text(planets[current_planet].EconomicStatus);

            // DC relevant data
            gasLevels = planets[current_planet].MineralsGas;
            liquidLevels = planets[current_planet].MineralsLiquid;
            solidLevels = planets[current_planet].MineralsSolid;
            console.log(gasLevels);
            console.log(liquidLevels);
            console.log(solidLevels);
            gassesNdx = crossfilter(gasLevels);
            liquidsNdx = crossfilter(liquidLevels);
            solidsNdx = crossfilter(solidLevels);
            //        GASSES
            var myGasses = gassesNdx.dimension(function (d) {return d['name'];});
            var myGassesGroup = myGasses.group().reduceSum(function (d) {return d['amount'];});
            var myGassesNeededGroup = myGasses.group().reduceSum(function (d) {return d['need'];});

            var myGassesPricesBuy = myGasses.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
            var myGassesPricesSell = myGasses.group().reduceSum(function (d) {return d['ChartSellPrice'];});
            var myGassesHighPricesBuy = myGasses.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
            var myGassesLowPricesBuy = myGasses.group().reduceSum(function (d) {return d['LowBuyPrice'];});
            var myGassesHighPricesSell = myGasses.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
            var myGassesLowPricesSell = myGasses.group().reduceSum(function (d) {return d['LowSellPrice'];});

            //        LIQUIDS
            var myLiquids = liquidsNdx.dimension(function (d) {return d['name'];});
            var myLiquidsGroup = myLiquids.group().reduceSum(function (d) {return d['amount'];});
            var myLiquidsNeededGroup = myLiquids.group().reduceSum(function (d) {return d['need'];});

            var myLiquidsPricesBuy = myLiquids.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
            var myLiquidsPricesSell = myLiquids.group().reduceSum(function (d) {return d['ChartSellPrice'];});
            var myLiquidsHighPricesBuy = myLiquids.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
            var myLiquidsLowPricesBuy = myLiquids.group().reduceSum(function (d) {return d['LowBuyPrice'];});
            var myLiquidsHighPricesSell = myLiquids.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
            var myLiquidsLowPricesSell = myLiquids.group().reduceSum(function (d) {return d['LowSellPrice'];});

            //        SOLIDS
            var mySolid = solidsNdx.dimension(function (d) {return d['name'];});
            var mySolidGroup = mySolid.group().reduceSum(function (d) {return d['amount'];});
            var mySolidNeededGroup = mySolid.group().reduceSum(function (d) {return d['need'];});

            var mySolidPricesBuy = mySolid.group().reduceSum(function (d) {return d['ChartBuyPrice'];});
            var mySolidPricesSell = mySolid.group().reduceSum(function (d) {return d['ChartSellPrice'];});
            var mySolidHighPricesBuy = mySolid.group().reduceSum(function (d) {return d['ChartMaxBuyPrice'];});
            var mySolidLowPricesBuy = mySolid.group().reduceSum(function (d) {return d['LowBuyPrice'];});
            var mySolidHighPricesSell = mySolid.group().reduceSum(function (d) {return d['ChartMaxSellPrice'];});
            var mySolidLowPricesSell = mySolid.group().reduceSum(function (d) {return d['LowSellPrice'];});

            gasChart
                .ordinalColors(myColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Gaseous Elements'])
                .yAxisLabel(['Element Levels'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myGasses)
                .group(myGassesGroup)
                .stack(myGassesNeededGroup);


            gasPriceBuyChart
                .ordinalColors(minPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Gaseous Elements'])
                .yAxisLabel(['Element Price'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myGasses)
                .group(myGassesLowPricesBuy)
                .stack(myGassesPricesBuy)
                .stack(myGassesHighPricesBuy)
                .stack(myGassesLowPricesSell)
                .stack(myGassesPricesSell)
                .stack(myGassesHighPricesSell);

            liquidChart
                .ordinalColors(myColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Liquid Elements'])
                .yAxisLabel(['Element Levels'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myLiquids)
                .group(myLiquidsGroup)
                .stack(myLiquidsNeededGroup);


            liquidPriceBuyChart
                .ordinalColors(minPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Liquid Elements'])
                .yAxisLabel(['Element Price'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myLiquids)
                .group(myLiquidsLowPricesBuy)
                .stack(myLiquidsPricesBuy)
                .stack(myLiquidsHighPricesBuy)
                .stack(myLiquidsLowPricesSell)
                .stack(myLiquidsPricesSell)
                .stack(myLiquidsHighPricesSell);

            solidChart
                .ordinalColors(myColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Solid Elements'])
                .yAxisLabel(['Element Levels'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(mySolid)
                .group(mySolidGroup)
                .stack(mySolidNeededGroup);


            solidPriceBuyChart
                .ordinalColors(minPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Solid Elements'])
                .yAxisLabel(['Element Price'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(mySolid)
                .group(mySolidLowPricesBuy)
                .stack(mySolidPricesBuy)
                .stack(mySolidHighPricesBuy)
                .stack(mySolidLowPricesSell)
                .stack(mySolidPricesSell)
                .stack(mySolidHighPricesSell);

                gasPriceBuyChart.render();
                gasChart.render();
                liquidPriceBuyChart.render();
                liquidChart.render();
                solidPriceBuyChart.render();
                solidChart.render();
            });
        });
}




