const express = require("express");
const router = express.Router();
const GetPoolData = require("./getPoolData");
router.get("/", function (req, res, next) {

  var yield = new Intl.NumberFormat("en-UD", {
    style: "percent",
    minimumFractionDigits: 2,
  });

  let acumTVL = new Number();
  let monthlyAcumTVL = new Number();
  let acumFeesUSD = new Number();
  let monthlyAcumFees = new Number();
  let firstTokenSymbol = new String();
  let secondTokenSymbol = new String();

  var TVL = new Number();
  var feesArray = new Array();
  var tvlArray = new Array();
  var lastMonthFees = new Array();
  var lastMonthTVL = new Array();

  GetPoolData.getTVL().then((value) => {
    let obj = Object.values(value).map(
      ({ id, token0, token1, totalValueLockedETH, poolDayData }) => {
       
        firstTokenSymbol = token0.symbol;
        secondTokenSymbol = token1.symbol;
        TVL = totalValueLockedETH;

        for (let i = 0; i < poolDayData.length; i++) {
          feesArray.push(poolDayData[i].feesUSD / 1000000);
          tvlArray.push(poolDayData[i].tvlUSD / 1000000);
        }
        for (let i = 0; i < poolDayData.length; i++) {
          feesArray.push(poolDayData[i].feesUSD / 1000000);
          tvlArray.push(poolDayData[i].tvlUSD / 1000000);
        }
        for (let i = 60; i < poolDayData.length; i++) {
          lastMonthFees.push(poolDayData[i].feesUSD / 1000000);
          lastMonthTVL.push(poolDayData[i].tvlUSD / 1000000);
        }

        acumTVL = tvlArray.reduce(function (a, b) {
          return a + b;
        }, 0);

        acumFeesUSD = feesArray.reduce(function (a, b) {
          return a + b;
        }, 0);

        monthlyAcumFees = lastMonthFees.reduce(function (a, b) {
          return a + b;
        }, 0);

        monthlyAcumTVL = lastMonthTVL.reduce(function (a, b) {
          return a + b;
        }, 0);

        let yieldTotal = yield.format(acumFeesUSD / acumTVL);
        let yieldMonth = yield.format(monthlyAcumFees / monthlyAcumTVL);

        let formatTvl = (n) => {
          if (n < 1e3) return n;
          if (n >= 1e3 && n < 1e6) return  +(n / 1e3).toFixed(0) + "K";
          if (n >= 1e6 && n < 1e9) return  +(n / 1e6).toFixed(1) + "M";
          if (n >= 1e9 && n < 1e12) return  +(n / 1e9).toFixed(1) + "B";
          if (n >= 1e12) return  +(n / 1e12).toFixed(1) + "T";
        };

        TVL = formatTvl(TVL);

        return {
          firstTokenSymbol,
          secondTokenSymbol,
          TVL,
          yieldMonth,
          yieldTotal,
        };
      }
    );
    console.log(obj);
    res.send(obj);
  });
});

module.exports = router;
