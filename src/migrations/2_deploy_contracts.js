const StockExchange = artifacts.require("StockExchange");

module.exports = function (deployer) {
  deployer.deploy(StockExchange);
};
