import React, { useEffect, useState } from "react";
import axios from "axios";
import Deals from "./deals";
import Investments from "./Investments.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Home() {
  const [deals, setDeals] = useState([]);
  const [investments, setInvestments] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/topDealsAPI")
      .then((res) => {
        setDeals(res.data);
      })
      .catch((error) => console.log(error));

    const invest = [
      {
        firstToken: "USDC",
        secondToken: "WETH",
        initialStake: "$75k",
        yield: "25%",
      },
      {
        firstToken: "USDC",
        secondToken: "WETH",
        initialStake: "$75k",
        yield: "25%",
      },
      {
        firstToken: "USDC",
        secondToken: "WETH",
        initialStake: "$75k",
        yield: "25%",
      },
      {
        firstToken: "USDC",
        secondToken: "WETH",
        initialStake: "$75k",
        yield: "25%",
      },
      {
        firstToken: "USDC",
        secondToken: "WETH",
        initialStake: "$75k",
        yield: "25%",
      },
    ];
    setInvestments(invest);
  }, []);

  const filteredInvestments = investments.filter(
    (investments) => investments.firstToken
  );
  const filteredDeals = deals.filter((deals) => deals.token0);
  const data = [
    {
      day: 1,
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      day: 2,
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      day: 3,
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      
      day: 4,
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      day: 5,
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      day: 6,
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      day: 7,
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div class="body-container">
      {/*<!-- SLIDER-->*/}

      {/*<!-- SLIDER ENDS -->*/}

      {/*<!-- MY ACCOUNT -->*/}
      <div class="my-account-container">
        <div class="title-my-account">
          <h1>My Account</h1>
        </div>
        <div class="filter-my-account">
          <select name="home_filter" id="home_filter">
            <option value="">All times</option>
            <option value="" selected="selected">
              7 Days
            </option>
            <option value="">This Month</option>
            <option value="">This Year</option>
          </select>
        </div>
        <div class="growth-info">
          <h1>$1.3T</h1>
          <p>Total Crypto Market Cap</p>
          <h1>+17%</h1>
          <p>Portfolio Growth</p>
          <h1>+$18K</h1>
          <p>Portfolio Value</p>
        </div>
        <div class="graphs-growth">
          <div class="graph-1">
            <h3>Portfolio Growth</h3>
            <AreaChart
              width={750}
              height={250}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                </defs>
              <XAxis dataKey="day" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </div>
        </div>
      </div>
      {/*<!-- MY ACCOUNT ENDS -->*/}

      <div class="investment-topDeals-container">
        {/*<!-- MY INVESTMENTS START -->*/}
        <div class="my-investments-container">
          <div class="title-my-investments">
            <h1>My Investments</h1>
          </div>
          <div class="text-investments">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>
          <div class="investments">
            {filteredInvestments.map((investments) => {
              return (
                <Investments
                  firstToken={investments.firstToken}
                  secondToken={investments.secondToken}
                  initialStake={investments.initialStake}
                  yieldInvestment={investments.yield}
                />
              );
            })}
          </div>
        </div>
        {/*<!-- MY INVESTMENTS ENDS -->*/}

        {/*<!-- TOP DEALS -->*/}
        <div class="top-deals-container">
          <div class="title-top-deals">
            <h1>Top Deals</h1>
          </div>
          <div class="text-top-deals">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>

          <div class="top-deals">
            {filteredDeals.map((deals) => {
              return (
                <Deals
                  firstTokenSymbol={deals.token0.symbol}
                  firstTokenId={deals.token0.id}
                  secondTokenSymbol={deals.token1.symbol}
                  TVL={deals.liquidity}
                  yieldTotal={deals.yieldPer}
                  yieldGraph={parseFloat(deals.yield).toPrecision(2)}
                />
              );
            })}
          </div>
        </div>
        {/*<!-- TOP DEALS  ENDS-->*/}
      </div>
    </div>
  );
}

export default Home;
