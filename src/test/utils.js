const { ethers } = require('hardhat');

const Chance = require('chance');
const chance = new Chance();

const getExchange = async (asset) => {
  const Exchange = await ethers.getContractFactory('Exchange');
  const exchange = await Exchange.deploy();

  const accounts = await ethers.getSigners();

  const numberOfNewOrders = chance.integer({ min: 10, max: 15 });

  for (let i = 1; i <= numberOfNewOrders; i++) {
    const accountId = chance.integer({ min: 1, max: accounts.length - 1 });

    const order = {
      isSale: i % 2 === 0,
      userAddress: accounts[accountId].address,
      asset,
      value: chance.integer({ min: 1000, max: 1_000_000 }),
      numberOfShares: chance.integer({ min: 1, max: 1000 }),
      acceptsFragmenting: chance.bool(),
      isPassive: false,
    };

    await exchange.connect(accounts[accountId]).depositMoney({
      value: ethers.utils.formatUnits(String(order.value), 'wei'),
    });

    await exchange.realizeOperationOfCreationOfOrder(
      order.isSale,
      order.userAddress,
      order.asset,
      order.value,
      order.numberOfShares,
      order.acceptsFragmenting,
      order.isPassive
    );
  }

  return {
    exchange,
    accounts,
  };
};

function viewListOfOrdersByAssetCode(asset, purchasedOrders, saleOrders) {
  const maximumLength = Math.max(purchasedOrders.length, saleOrders.length);

  const orders = [];

  for (let i = 0; i < maximumLength; i++) {
    orders.push([purchasedOrders[i], saleOrders[i]]);
  }

  console.log(`Asset: ${asset}`);
  console.log('Qtd\tCompra\tVenda\tQtd');

  for (const order of orders) {
    console.log(
      `${order[0] ? order[0].numberOfShares : ''}\t${
        order[0] ? order[0].value : ''
      }\t${order[1] ? order[1].value : ''}\t${
        order[1] ? order[1].numberOfShares : ''
      }`
    );
  }
}

function convertToNumber(value) {
  return +value;
}

module.exports = { getExchange, viewListOfOrdersByAssetCode, convertToNumber };
