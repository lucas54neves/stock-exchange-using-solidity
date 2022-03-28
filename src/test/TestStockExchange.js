const StockExchange = artifacts.require("./StockExchange.sol");

contract("StockExchange", accounts => {
  const creatorAddress = accounts[0];
  
  before(async () => {
    this.stockExchange = await StockExchange.deployed();
  });
  
  it("should deploy successfully", async () => {
    assert.notEqual(creatorAddress, 0x0);
    assert.notEqual(creatorAddress, "");
    assert.notEqual(creatorAddress, null);
    assert.notEqual(creatorAddress, undefined);
  });
  
  it ("should compare assets", async () => {
    const equalsAssets = await this.stockExchange.compareAssets("ITAUSA", "ITAUSA");
    const notEqualsAssets = await this.stockExchange.compareAssets("ITAUSA", "PETRO");

    assert.equal(equalsAssets, true);
    assert.notEqual(notEqualsAssets, true);
  })
 
  it("should create a transaction", async () => {
    const transaction = await this.stockExchange.createTransaction(
      accounts[1],
      accounts[2],
      "ABC123",
      50,
      3
    );

    assert.equal(transaction.seller, accounts[1]);
    assert.equal(transaction.buyer, accounts[2]);
    assert.equal(transaction.assetCode, "ABC123");
    assert.equal(transaction.pricePerShare, 50);
    assert.equal(transaction.numberOfShares, 3);
  })

  it("should create a order", async () => {
    const order = await this.stockExchange.createOrder(
      54,
      accounts[2],
      "ITAUSA",
      58,
      3,
      true
    );

    assert.equal(order.index, 54);
    assert.equal(order.userAddress, accounts[2]);
    assert.equal(order.assetCode, "ITAUSA");
    assert.equal(order.targetPricePerShare, 58);
    assert.equal(order.numberOfShares, 3);
    assert.equal(order.acceptsFragmenting, true);
  })
  
  it("should add sale order", async() => {
    const order = await this.stockExchange.createOrder(
      54,
      accounts[2],
      "ITAUSA",
      58,
      3,
      true
    );
    
    await this.stockExchange.addSaleOrder(order);

    const orders = await this.stockExchange.getSalesOrdersArray();

    const numberOfOrders = await this.stockExchange.numberOfOrders(orders);
    
    assert.equal(numberOfOrders, 1);
    assert.equal(orders[0].index, 54);
    assert.equal(orders[0].userAddress, accounts[2]);
    assert.equal(orders[0].assetCode, "ITAUSA");
    assert.equal(orders[0].targetPricePerShare, 58);
    assert.equal(orders[0].numberOfShares, 3);
    assert.equal(orders[0].acceptsFragmenting, true);
  })

  // addPurchaseOrder
  // addTransaction
  // insertOrder
  // numberOfOrders
  // addOrder
  // checkTransactionConflict
});