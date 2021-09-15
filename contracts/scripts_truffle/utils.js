const ethers = require('ethers');
const fromExponential = require('from-exponential');
const {prettyNum, PRECISION_SETTING, ROUNDING_MODE} = require('pretty-num');

// delay
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 1e18 => 1
const fromWei = (amount, decimals = 18) => {
  return ethers.utils.formatUnits(prettyNum(fromExponential(amount || 0), {precision: decimals, roundingMode: ROUNDING_MODE.DOWN}), decimals);
};

// 1 => 1000000000000000000
const toWei = (amount, decimals = 18) => {
  return ethers.utils.parseUnits(prettyNum(fromExponential(amount || 0), {precision: decimals, roundingMode: ROUNDING_MODE.DOWN}), decimals);
};

module.exports = {
  sleep,
  toWei,
  fromWei,
}
