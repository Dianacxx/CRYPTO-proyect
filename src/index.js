const { ethers } = require('ethers');
const { Pool, TickListDataProvider, Tick, Trade, Route, priceToClosestTick, tickToPrice, Position } = require('@uniswap/v3-sdk');
const { Token, CurrencyAmount, Percent, Price } = require('@uniswap/sdk-core');
const GetPoolData = require('./getPoolData');

// Artifacts
const UniswapV3Pool = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const UniswapV3Router = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json');
const UniswapV3PositionManager = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json');

// Addresses
const poolAddress = '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8';
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
const positionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

var tvl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

window.onload = function() {
    // Variables
    let web3;

    // Elements
    const connectButton = document.getElementById('connect');
    const content = document.getElementById('content');
    const account = document.getElementById('account');
    const poolButton = document.getElementById('pool');
    const poolData = document.getElementById('root');
    const poolList = document.getElementById('list');
    const swapButton = document.getElementById('swap');

    // Functions
    const connect = async() => {
        try {
            // find provider
            if(window.ethereum) {
                // send connection request to wallet
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider.listAccounts().then(addresses => {
                    account.innerText = addresses[0];
                });
                //await provider.request({ method: 'eth_requestAccounts' });
                
                // use web3 to fetch array of accounts
                //web3 = new Web3(provider);

                //web3.eth.getAccounts().then(addresses => {
                //    account.innerText = addresses[0];
                //});
                
                // display account information and hidde connectButton
                content.style.display = '';
                connectButton.style.display = 'none';
                return provider;
            } else {
                // handler in case a web3 provider is not found
                alert('You require a web3 provider');
            }
        } catch(error) {
            // handler in case user rejects the connection request
            alert('You have rejected the request');
        }
    }

    const showPoolData = () => {
        let poolDataHTML = '';
        root.innerHTML = '';
        GetPoolData.getTVL(poolAddress).then(value => {
            Object.values(value).map(({id, poolDayData}) => {
                poolDataHTML = `<span>${id}</span>`;
                poolDayData.map(item => {
                    let date = new Date(item['date'] * 1000);
                    poolDataHTML = poolDataHTML + `<li>${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()} ${tvl.format(item['tvlUSD']/ 1000000) + 'm'}</li>`;
                })
                poolData.innerHTML = `<h1>${poolList.options[poolList.selectedIndex].innerHTML} TVL by day</h1>` + poolDataHTML;
            });
        });
    }

    const swapToken = async() => {
        // Define provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Token Addresses
        const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
        const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

        // Create representations of the tokens
        const token0 = new Token(1, usdcAddress, 6, 'USDC', 'USD Coin');
        const token1 = new Token(1, wethAddress, 18, 'WETH', 'Wrapped Ether');

        // Contracts
        const poolContract  = new ethers.Contract(poolAddress, UniswapV3Pool.abi, provider);
        const routerContract = new ethers.Contract(routerAddress, UniswapV3Router.abi, signer);
        const uniswapRouter = routerContract.connect(signer);

        const positionManagerContract = new ethers.Contract(positionManagerAddress, UniswapV3PositionManager.abi, provider);
        const uniswapPositionManager = positionManagerContract.connect(signer);
        
        const poolFee = await poolContract.fee();
        const slot0 = await poolContract.slot0();
        const poolLiquidity = await poolContract.liquidity();
        const tickSpacing = await poolContract.tickSpacing();

        console.log(poolFee, slot0[1], poolLiquidity, tickSpacing);

        // Get ticks
        const nearestTick = Math.floor(slot0[1] / tickSpacing) * tickSpacing;

        const tickLowerIndex = nearestTick - (tickSpacing);
        const tickUpperIndex = nearestTick + (tickSpacing);

        const tickLowerData = await poolContract.ticks(tickLowerIndex);
        const tickUpperData = await poolContract.ticks(tickUpperIndex);

        const tickLower = new Tick({
            index: tickLowerIndex,
            liquidityGross: tickLowerData.liquidityGross,
            liquidityNet: 0
        });
    
        const tickUpper = new Tick({
            index: tickUpperIndex,
            liquidityGross: tickUpperData.liquidityGross,
            liquidityNet: 0
        });

        const tickList = new TickListDataProvider([tickLower, tickUpper], tickSpacing);

        console.log(tickList);

        const pool = new Pool(
            token0,
            token1,
            poolFee,
            slot0[0], // Pool Price
            poolLiquidity,
            slot0[1], // Pool Tick
            tickList
        );

        // Swap

        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const amountIn = CurrencyAmount.fromRawAmount(token0, 5000000000);

        const route = new Route([pool], token0, token1);
        console.log(`The midprice of 1 USDC in ETH is ${route.midPrice.toSignificant(6)}`);
        console.log(`The midprice of 1 ETH in USDC is ${route.midPrice.invert().toSignificant(6)}`);

        const trade = await Trade.exactIn(route, amountIn)
        console.log(`The execution price for trading 1 USDC to ETH is ${trade.executionPrice.toSignificant(6)}`);

        const slippageTolerance = new Percent('50', '10000'); // 50 bips, 1 bip = 1 / 10000 or 0.01 %
        
        const amountOutMinimum = trade.minimumAmountOut(slippageTolerance);
        console.log(`The minimum amount in ETH you could get by trading 5000 USDC is ${amountOutMinimum.toSignificant(6)}`);

        const swapParams = {
        path: Buffer.from([usdcAddress, wethAddress]),
        recipient: account.innerText,
        deadline: deadline,
        amountIn: ethers.utils.parseUnits(amountIn.toExact(), 6),
        amountOutMinimum: ethers.utils.parseUnits(amountOutMinimum.toExact(), 18)
        }

        const swapTx = await uniswapRouter.exactInput(
            swapParams,
            {value: ethers.utils.parseEther('0.5'), gasLimit: 2000000}
        );

        console.log(swapTx.hash);
    }

    // Listeners
    connectButton.addEventListener('click', connect);
    poolButton.addEventListener('click', showPoolData);
    swapButton.addEventListener('click', swapToken);
};