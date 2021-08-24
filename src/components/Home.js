import React, { useEffect, useState } from "react";
import axios from "axios";
import Deals from "./deals";
import Investments from "./Investments.js";

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
          firstToken:'USDC',
          secondToken: 'WETH',
          initialStake: '$75k',
          yield: '25%'
        },
        {
          firstToken:'USDC',
          secondToken: 'WETH',
          initialStake: '$75k',
          yield: '25%'
        },{
          firstToken:'USDC',
          secondToken: 'WETH',
          initialStake: '$75k',
          yield: '25%'
        },{
          firstToken:'USDC',
          secondToken: 'WETH',
          initialStake: '$75k',
          yield: '25%'
        },{
          firstToken:'USDC',
          secondToken: 'WETH',
          initialStake: '$75k',
          yield: '25%'
        }
      ]
      setInvestments(invest);
  }, []);

  const filteredInvestments = investments.filter((investments) => investments.firstToken)
  const filteredDeals = deals.filter((deals) => deals.token0);

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
            <img src="img/normal_u110.png" alt="" />
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
              return(
                <Investments 
                  firstToken={investments.firstToken}
                  secondToken={investments.secondToken}
                  initialStake={investments.initialStake}
                  yieldInvestment={investments.yield}
                />
              );
            })

            }
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
