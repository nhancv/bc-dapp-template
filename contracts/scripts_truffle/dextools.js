const {time} = require('@openzeppelin/test-helpers');
const BigNumber = require('bignumber.js');
const {toWei, fromWei} = require('./utils');

const IPancakeRouter02 = artifacts.require('IPancakeRouter02.sol');
const IPancakeFactory = artifacts.require('IPancakeFactory.sol');
const IPancakePair = artifacts.require('IPancakePair.sol');
const IWETH = artifacts.require('IWETH.sol');

const FACTORY_ADDRESS = '0x5Fe5cC0122403f06abE2A75DBba1860Edb762985';
const ROUTER_ADDRESS = '0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0';
const WBNB = '0x0dE8FCAE8421fc79B29adE9ffF97854a424Cad09';

const dexInit = async () => {
  const router = await IPancakeRouter02.at(ROUTER_ADDRESS);
  const factory = await IPancakeFactory.at(FACTORY_ADDRESS);
  return {router, factory, WBNB};
}

const getLP = async (factoryInstance, tokenAddress) => {
  const pairAddress = await factoryInstance.getPair(WBNB, tokenAddress);
  const pair = await IPancakePair.at(pairAddress);
  return {pairAddress, pair};
}

const addLiquidity = async (routerInstance, tokenInstance, tokenName, tokenAmount, bnbAmount, user, userName) => {
  console.log(`[ADD_LP] ${userName} is adding liquidity of ${tokenAmount} ${tokenName} and ${bnbAmount} BNB`);

  const tokenAmountInWei = toWei(tokenAmount.toString());
  const bnbAmountInWei = toWei(bnbAmount.toString());
  const timestamp = (await time.latest()) + 10000;
  await tokenInstance.approve(routerInstance.address.toString(), tokenAmountInWei, {from: user});
  return await routerInstance.addLiquidityETH(tokenInstance.address, tokenAmountInWei, 0, 0, user, timestamp, {
    from: user,
    value: bnbAmountInWei
  });
}

const removeLiquidity = async (routerInstance, lpInstance, tokenAddress, user, userName) => {
  console.log('=== Remove Liquidity ===');

  const lpBalanceInWei = await lpInstance.balanceOf(user);
  if (Number(fromWei(lpBalanceInWei)) === 0) {
    console.log(`${userName} empty LP`);
    return undefined;
  } else {
    console.log(`[RM_LP] ${userName} is removing liquidity of ${lpBalanceInWei} LP`);
    const timestamp = (await time.latest()) + 10000;
    await lpInstance.approve(routerInstance.address, lpBalanceInWei, {from: user});
    return await routerInstance.removeLiquidityETH(tokenAddress, lpBalanceInWei, 0, 0, user, timestamp, {
      from: user
    });
  }
}

const buy = async (routerInstance, wbnbAddress, tokenAddress, bnbAmount, user, userName) => {
  console.log(`[BUY] ${userName} is buying worth of ${bnbAmount} BNB`);

  const bnbAmountInWei = toWei(bnbAmount.toString());
  const path = [wbnbAddress, tokenAddress];

  console.log('Estimated output:', fromWei((await routerInstance.getAmountsOut(bnbAmountInWei, path))[1].toString()));

  const timestamp = (await time.latest()) + 10000;
  return await routerInstance.swapExactETHForTokensSupportingFeeOnTransferTokens(
    '0',
    path,
    user,
    timestamp,
    {from: user, value: bnbAmountInWei}
  );
}

const buyExactTokens = async (routerInstance, wbnbAddress, tokenAddress, tokenAmount, user, userName) => {
  console.log(`[BUY_EXACT_TOKENS] ${userName} is buying worth of ${tokenAmount} Tokens`);

  const tokenAmountInWei = toWei(tokenAmount.toString());
  const path = [wbnbAddress, tokenAddress];

  const bnbBalance = await userBNBBalance(user);
  let bnbInputEstimated = -1;
  try {
    bnbInputEstimated = (await routerInstance.getAmountsIn(tokenAmountInWei, path))[0].toString();
    console.log('Estimated input:', fromWei(bnbInputEstimated));
  } catch (e) {
    console.log('Not enough LP');
  }
  if (bnbInputEstimated !== -1 && new BigNumber(bnbBalance).gte(bnbInputEstimated)) {
    const timestamp = (await time.latest()) + 10000;
    return await routerInstance.swapETHForExactTokens(
      tokenAmountInWei,
      path,
      user,
      timestamp,
      {from: user, value: bnbInputEstimated}
    );
  }
  return undefined;
}

const sell = async (routerInstance, tokenInstance, wbnbAddress, tokenAmount, user, userName) => {
  console.log(`[SELL] ${userName} is selling ${tokenAmount} tokens`);

  const tokenAmountInWei = toWei(tokenAmount.toString());
  const path = [tokenInstance.address, wbnbAddress];

  console.log('BNB snapshot:', web3.utils.fromWei((await web3.eth.getBalance(user))));
  let bnbOutEstimated = -1;
  try {
    bnbOutEstimated = (await routerInstance.getAmountsOut(tokenAmountInWei, path))[1].toString();
    console.log('Estimated output:', fromWei(bnbOutEstimated));
  } catch (e) {
    console.log('Not enough LP');
  }
  if (bnbOutEstimated !== -1) {
    const timestamp = (await time.latest()) + 10000;
    await tokenInstance.approve(routerInstance.address, tokenAmountInWei, {from: user});
    return await routerInstance.swapExactTokensForETHSupportingFeeOnTransferTokens(
      tokenAmountInWei,
      0,
      path,
      user,
      timestamp,
      {from: user}
    );
  }
  return undefined
}

const transferToken = async (tokenInstance, from, to, tokens, fromName, toName) => {
  console.log(`[TRANSFER_TOKEN] From ${fromName} to ${toName} for ${tokens} tokens`);
  return await tokenInstance.transfer(to, toWei(tokens), {from: from});
}

const transferBNB = async (tokenInstance, from, to, bnbAmount, fromName, toName) => {
  console.log(`[TRANSFER_BNB] From ${fromName} to ${toName} for ${bnb} BNB `);
  return await web3.eth.sendTransaction({to: from, from: to, value: toWei(bnbAmount)});
}

const userTokenBalance = async (tokenInstance, user) => {
  return await tokenInstance.balanceOf(user);
}

const userBNBBalance = async (user) => {
  return await web3.eth.getBalance(user);
}

const getBNBForTokens = async (routerInstance, tokenInstance, wbnbAddress, tokenAmount) => {
  try {
    const tokenAmountInWei = toWei(tokenAmount.toString());
    const path = [tokenInstance.address, wbnbAddress];
    return fromWei((await routerInstance.getAmountsOut(tokenAmountInWei, path))[1].toString());
  } catch (e) {
    return -1;
  }
}

module.exports = {
  dexInit,
  getLP,
  addLiquidity,
  removeLiquidity,
  buy,
  buyExactTokens,
  sell,
  transferToken,
  transferBNB,
  userTokenBalance,
  userBNBBalance,
  getBNBForTokens,
}
