#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const yargs = require('yargs/yargs');

function round2Decimals(num) {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2);
}
async function getTicker(ticker) {
  try {
    const res = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${ticker}`);
    const result = res.data.quoteResponse.result;
    const { shortName, regularMarketPrice, symbol, regularMarketChangePercent, currency } = result[0];

    const isPositiveChange = regularMarketChangePercent >= 0;
    const changePercentString = `(${round2Decimals(regularMarketChangePercent)}%)`;
    const coloredChangePercentString = isPositiveChange
      ? chalk.green(changePercentString)
      : chalk.red(changePercentString);

    return `${shortName} (${symbol})\n${currency} ${round2Decimals(regularMarketPrice)} ${coloredChangePercentString}`;
  } catch {}
}

var argv = yargs(process.argv.slice(2)).argv;
if (argv._.length === 0) console.log('enter a ticker symbol i.e. AAPL');
const tickers = argv._;

async function run() {
  const promises = tickers.map((ticker) => getTicker(ticker));
  const prices = await Promise.all(promises);
  prices.forEach((price, index) => {
    console.log('---------------------------');
    console.log(price ? price : `Ticker ${tickers[index]} not found`);
    console.log('---------------------------');
  });
}
run();
