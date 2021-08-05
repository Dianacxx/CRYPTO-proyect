import React from "react";
import '../App.css';

const Deals = ({ 
    firstTokenSymbol,
    secondTokenSymbol,
    TVL,
    yieldTotal


}) => {
  return (
    <div className="coin-container">
        <div className="coin">
          <div class="rectangle rectangle-top">
              <table class="table top">
                <tbody>
                  <tr>
                    <th>Pair</th>
                    <th>Total Liquidity</th>
                    <th>Yield (90 Days)</th>
                  </tr>
                  <tr>
                    <td>{firstTokenSymbol}<br/> {secondTokenSymbol}</td>
                    <td>${TVL}</td>
                    <td>{yieldTotal}</td>
                    <td>
                      <a href="#openModal6" class="myButton">
                        {" "}
                        Invest{" "}
                      </a>
                      <div id="openModal6" class="modalDialog invest-modal">
                        <div class="modal-content">
                          <a href="#close" title="Close" class="close">
                            {" "}
                            X{" "}
                          </a>
                          {/*
                    <!-- <h1>HELLO</h1> -->
                    */}

                          <div class="close-button-container">
                            <a
                              href="#close-button"
                              title="Close-button"
                              class="close-button"
                            >
                              Confirm
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
           </div>
      </div>
  );
};

export default Deals;
