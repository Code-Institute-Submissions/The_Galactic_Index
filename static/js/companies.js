function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

queue()
    .defer(d3.json, "/Galactic_index/Companies")
    .await(makeCompanyGraphs);

function makeCompanyGraphs(error, companies) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    current_company = 0 // will tell refresh functions which planet is being viewed.

    if ( $('#isMobile').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 300
            var graphHeight = 325
            var marginsLR = 35
            }
    if ( $('#isTablet').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 400
            var graphHeight = 325
            var marginsLR = 40
            }
    if ( $('#isLarge').css('display') !== 'none' ){
        // element is hidden
            var graphWidth = 450
            var graphHeight = 400
            var marginsLR = 40
            }

// I didnt write the REGEX (which i don't understand well!) at the end, it was was an
//  answer on stack overflow, i used it because .toLocaleString() didn't work well, its adds commas
    moneyString = String(companies[current_company].Money).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    profitString = String(companies[current_company].profit).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    companyAgeString = String(companies[current_company].CompanyAge).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//  Display certain information as text, using a simple jquery function for this.
    $("#compNameHolder").text(companies[current_company].CompanyName);
    $("#shipsHolder").text(companies[current_company].NumberOfSpaceships);
    $("#spaceportsHolder").text(companies[current_company].NumberOfSpaceports);

    $("#moneyHolder").text(moneyString);
    $("#profitHolder").text(profitString);
    $("#ageHolder").text(companyAgeString);
    $("#stockHolder").text(String(companies[current_company].StockPrices));

        // DC relevant data
    gasLevels = companies[current_company].MineralsGas;
    liquidLevels = companies[current_company].MineralsLiquid;
    solidLevels = companies[current_company].MineralsSolid;
    console.log(gasLevels);
    console.log(liquidLevels);
    console.log(solidLevels);
    gassesNdx = crossfilter(gasLevels);
    liquidsNdx = crossfilter(liquidLevels);
    solidsNdx = crossfilter(solidLevels);
    //        GASSES
    var myGasses = gassesNdx.dimension(function (d) {return d['name'];});
    var myGassesGroup = myGasses.group().reduceSum(function (d) {return d['Amount'];});
    var myGassesTransitBuy = myGasses.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
    var myGassesTransitSell = myGasses.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

    var myLiquids = liquidsNdx.dimension(function (d) {return d['name'];});
    var myLiquidsGroup = myLiquids.group().reduceSum(function (d) {return d['Amount'];});
    var myLiquidsTransitBuy = myLiquids.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
    var myLiquidsTransitSell = myLiquids.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

    var mySolids = solidsNdx.dimension(function (d) {return d['name'];});
    var mySolidsGroup = mySolids.group().reduceSum(function (d) {return d['Amount'];});
    var mySolidsTransitBuy = mySolids.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
    var mySolidsTransitSell = mySolids.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

    var averagePricePaidGas = myGasses.group().reduceSum(function (d) {return d['AveragePricePaid'];});
    var averagePricePaidLiquid = myLiquids.group().reduceSum(function (d) {return d['AveragePricePaid'];});
    var averagePricePaidSolid = mySolids.group().reduceSum(function (d) {return d['AveragePricePaid'];});

    var gasChart = dc.barChart("#gasBarChart");
    var liquidChart = dc.barChart("#liquidBarChart");
    var solidChart = dc.barChart("#solidBarChart");

    var gasPriceChart = dc.barChart("#gasPriceBarChart");
    var liquidPriceChart = dc.barChart("#liquidPriceBarChart");
    var solidPriceChart = dc.barChart("#solidPriceBarChart");

    var myAmountColors = ['#9930db','#91d526', '#56cce1']
    var myPriceColors = ['#dc5353','#e7e563']

    gasChart
        .ordinalColors(myAmountColors)
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
        .stack(myGassesTransitBuy)
        .stack(myGassesTransitSell);

    liquidChart
        .ordinalColors(myAmountColors)
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
        .stack(myLiquidsTransitBuy)
        .stack(myLiquidsTransitSell);

    solidChart
        .ordinalColors(myAmountColors)
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
        .dimension(mySolids)
        .group(mySolidsGroup)
        .stack(mySolidsTransitBuy)
        .stack(mySolidsTransitSell);

    gasPriceChart
        .ordinalColors(myPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Gaseous Elements'])
        .yAxisLabel(['Average Price Paid'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myGasses)
        .group(averagePricePaidGas);

    liquidPriceChart
        .ordinalColors(myPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Gaseous Elements'])
        .yAxisLabel(['Average Price Paid'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(myLiquids)
        .group(averagePricePaidLiquid);

    solidPriceChart
        .ordinalColors(myPriceColors)
        .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
        .width(graphWidth)
        .height(graphHeight)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(false)
        .xAxisLabel(['Gaseous Elements'])
        .yAxisLabel(['Average Price Paid'], 18)
        .barPadding(0.1)
        .outerPadding(0.05)
        .dimension(mySolids)
        .group(averagePricePaidSolid);

        dc.renderAll();

        $(document).ready(function(){
        $("#companyChange").click(function() {
            current_company += 1;
            if (current_company > 19) {
                current_company = 0
            }
        // I didnt write the REGEX (which i don't understand well!) at the end, it was was an
        //  answer on stack overflow, i used it because .toLocaleString() didn't work well, its adds commas
            moneyString = String(companies[current_company].Money).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            profitString = String(companies[current_company].profit).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            companyAgeString = String(companies[current_company].CompanyAge).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //  Display certain information as text, using a simple jquery function for this.
            $("#compNameHolder").text(companies[current_company].CompanyName);
            $("#shipsHolder").text(companies[current_company].NumberOfSpaceships);
            $("#spaceportsHolder").text(companies[current_company].NumberOfSpaceports);

            $("#moneyHolder").text(moneyString);
            $("#profitHolder").text(profitString);
            $("#ageHolder").text(companyAgeString);
            $("#stockHolder").text(String(companies[current_company].StockPrices));

                // DC relevant data
            gasLevels = companies[current_company].MineralsGas;
            liquidLevels = companies[current_company].MineralsLiquid;
            solidLevels = companies[current_company].MineralsSolid;
            console.log(gasLevels);
            console.log(liquidLevels);
            console.log(solidLevels);
            gassesNdx = crossfilter(gasLevels);
            liquidsNdx = crossfilter(liquidLevels);
            solidsNdx = crossfilter(solidLevels);
            //        GASSES
            var myGasses = gassesNdx.dimension(function (d) {return d['name'];});
            var myGassesGroup = myGasses.group().reduceSum(function (d) {return d['Amount'];});
            var myGassesTransitBuy = myGasses.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
            var myGassesTransitSell = myGasses.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

            var myLiquids = liquidsNdx.dimension(function (d) {return d['name'];});
            var myLiquidsGroup = myLiquids.group().reduceSum(function (d) {return d['Amount'];});
            var myLiquidsTransitBuy = myLiquids.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
            var myLiquidsTransitSell = myLiquids.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

            var mySolids = solidsNdx.dimension(function (d) {return d['name'];});
            var mySolidsGroup = mySolids.group().reduceSum(function (d) {return d['Amount'];});
            var mySolidsTransitBuy = mySolids.group().reduceSum(function (d) {return d['MineralsInTransitBought'];});
            var mySolidsTransitSell = mySolids.group().reduceSum(function (d) {return d['MineralsInTransitSold'];});

            var averagePricePaidGas = myGasses.group().reduceSum(function (d) {return d['AveragePricePaid'];});
            var averagePricePaidLiquid = myLiquids.group().reduceSum(function (d) {return d['AveragePricePaid'];});
            var averagePricePaidSolid = mySolids.group().reduceSum(function (d) {return d['AveragePricePaid'];});

            gasChart
                .ordinalColors(myAmountColors)
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
                .stack(myGassesTransitBuy)
                .stack(myGassesTransitSell);

            liquidChart
                .ordinalColors(myAmountColors)
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
                .stack(myLiquidsTransitBuy)
                .stack(myLiquidsTransitSell);

            solidChart
                .ordinalColors(myAmountColors)
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
                .dimension(mySolids)
                .group(mySolidsGroup)
                .stack(mySolidsTransitBuy)
                .stack(mySolidsTransitSell);

            gasPriceChart
                .ordinalColors(myPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Gaseous Elements'])
                .yAxisLabel(['Average Price Paid'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myGasses)
                .group(averagePricePaidGas);

            liquidPriceChart
                .ordinalColors(myPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Liquid Elements'])
                .yAxisLabel(['Average Price Paid'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(myLiquids)
                .group(averagePricePaidLiquid);

            solidPriceChart
                .ordinalColors(myPriceColors)
                .margins({top: 30, right: marginsLR, bottom: 100, left: marginsLR})
                .width(graphWidth)
                .height(graphHeight)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .brushOn(false)
                .xAxisLabel(['Solid Elements'])
                .yAxisLabel(['Average Price Paid'], 18)
                .barPadding(0.1)
                .outerPadding(0.05)
                .dimension(mySolids)
                .group(averagePricePaidSolid);

                gasChart.render();
                liquidChart.render();
                solidChart.render();
                gasPriceChart.render();
                liquidPriceChart.render();
                solidPriceChart.render();
            });
        });
}