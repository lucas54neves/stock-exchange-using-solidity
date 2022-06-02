const StockExchange = artifacts.require("StockExchange");
const LinkedListOfOrders = artifacts.require("LinkedListOfOrders");

module.exports = function (deployer) {
  deployer.deploy(StockExchange);
  deployer.deploy(LinkedListOfOrders);
};
