const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Exchange', () => {
  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory('Exchange');

    this.exchange = await Exchange.deploy();

    this.accounts = await ethers.getSigners();
  });

  it('should compare assets', async () => {
    const sameAssets = await this.exchange.compareAssets('PETRO', 'PETRO');

    expect(sameAssets).to.equal(true);

    const differentAssets = await this.exchange.compareAssets('PETRO', 'VALE');

    expect(differentAssets).to.equal(false);
  });

  it('should create a order', async () => {
    const orderData = {
      isSale: false,
      userAddress: this.accounts[1].address,
      asset: 'VALE',
      value: 1235,
      numberOfShares: 4,
      acceptsFragmenting: true,
      isPassive: true,
    };

    const order = await this.exchange.createOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      orderData.value,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    expect(orderData.isSale).to.equal(order.isSale);
    expect(orderData.userAddress).to.equal(order.userAddress);
    expect(orderData.asset).to.equal(order.asset);
    expect(orderData.value).to.equal(order.value);
    expect(orderData.numberOfShares).to.equal(order.numberOfShares);
    expect(orderData.acceptsFragmenting).to.equal(order.acceptsFragmenting);
    expect(orderData.isPassive).to.equal(order.isPassive);
  });

  it('should create a transaction', async () => {
    const transactionData = {
      seller: this.accounts[2].address,
      buyer: this.accounts[1].address,
      asset: 'ITAUSA',
      value: 22,
      numberOfShares: 1,
      saleOrderIndex: 4,
      purchaseOrderIndex: 3,
    };

    const transaction = await this.exchange.createTransaction(
      transactionData.seller,
      transactionData.buyer,
      transactionData.asset,
      transactionData.value,
      transactionData.numberOfShares,
      transactionData.saleOrderIndex,
      transactionData.purchaseOrderIndex
    );

    expect(transactionData.seller).to.equal(transaction.seller);
    expect(transactionData.buyer).to.equal(transaction.buyer);
    expect(transactionData.asset).to.equal(transaction.asset);
    expect(transactionData.value).to.equal(transaction.value);
    expect(transactionData.numberOfShares).to.equal(transaction.numberOfShares);
    expect(transactionData.saleOrderIndex).to.equal(transaction.saleOrderIndex);
    expect(transactionData.purchaseOrderIndex).to.equal(
      transaction.purchaseOrderIndex
    );
  });

  it('should add orders', async () => {
    const orderData = {
      isSale: false,
      userAddress: this.accounts[1].address,
      asset: 'VALE',
      value: 1235,
      numberOfShares: 4,
      acceptsFragmenting: true,
      isPassive: true,
    };

    const order = await this.exchange.createOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      orderData.value,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    let orders;

    for (let i = 0; i <= 10; i++) {
      orders = await this.exchange.returnOrders();

      expect(orders.length).to.equal(i);

      await this.exchange.addOrder(order);
    }

    expect(orders.length).to.equal(10);
  });

  it('should add transaction', async () => {
    const transactionData = {
      seller: this.accounts[2].address,
      buyer: this.accounts[1].address,
      asset: 'ITAUSA',
      value: 22,
      numberOfShares: 1,
      saleOrderIndex: 4,
      purchaseOrderIndex: 3,
    };

    const transaction = await this.exchange.createTransaction(
      transactionData.seller,
      transactionData.buyer,
      transactionData.asset,
      transactionData.value,
      transactionData.numberOfShares,
      transactionData.saleOrderIndex,
      transactionData.purchaseOrderIndex
    );

    let transactions;

    for (let i = 0; i <= 10; i++) {
      transactions = await this.exchange.returnTransactions();

      expect(transactions.length).to.equal(i);

      await this.exchange.addTransaction(transaction);
    }

    expect(transactions.length).to.equal(10);
  });

  it('should check transaction conflict', async () => {
    // sellerAcceptsToFragment,
    // buyerAcceptsToFragment,
    // sellerHasTheMostQuantity,
    // numberOfSharesIsDifferent
    expect(
      await this.exchange.checkTransactionConflict(false, true, true, true)
    ).to.equal(true);
    expect(
      await this.exchange.checkTransactionConflict(false, false, true, true)
    ).to.equal(true);
    expect(
      await this.exchange.checkTransactionConflict(false, false, false, true)
    ).to.equal(true);
    expect(
      await this.exchange.checkTransactionConflict(true, false, false, true)
    ).to.equal(true);
    expect(
      await this.exchange.checkTransactionConflict(true, true, true, true)
    ).to.equal(false);
    expect(
      await this.exchange.checkTransactionConflict(true, true, false, true)
    ).to.equal(false);
    expect(
      await this.exchange.checkTransactionConflict(false, true, false, true)
    ).to.equal(false);
    expect(
      await this.exchange.checkTransactionConflict(true, false, true, true)
    ).to.equal(false);
  });

  it('should return sale orders', async () => {
    const orderData = {
      isSale: true,
      userAddress: this.accounts[1].address,
      asset: 'VALE',
      numberOfShares: 4,
      acceptsFragmenting: true,
      isPassive: true,
    };

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      56,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      58,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      52,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      47,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      69,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      53,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      51,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    const orders = await this.exchange.returnSaleOrders(orderData.asset);

    expect(orders.length).to.equal(7);
    expect(orders[0].value).to.equal(47);
    expect(orders[1].value).to.equal(51);
    expect(orders[2].value).to.equal(52);
    expect(orders[3].value).to.equal(53);
    expect(orders[4].value).to.equal(56);
    expect(orders[5].value).to.equal(58);
    expect(orders[6].value).to.equal(69);
  });

  it('should return purchased orders', async () => {
    const orderData = {
      isSale: false,
      userAddress: this.accounts[1].address,
      asset: 'VALE',
      numberOfShares: 4,
      acceptsFragmenting: true,
      isPassive: true,
    };

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      56,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      58,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      52,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      47,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      69,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      53,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    await this.exchange.realizeOperationOfCreationOfOrder(
      orderData.isSale,
      orderData.userAddress,
      orderData.asset,
      51,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    const orders = await this.exchange.returnPurchasedOrders(orderData.asset);

    expect(orders.length).to.equal(7);
    expect(orders[0].value).to.equal(69);
    expect(orders[1].value).to.equal(58);
    expect(orders[2].value).to.equal(56);
    expect(orders[3].value).to.equal(53);
    expect(orders[4].value).to.equal(52);
    expect(orders[5].value).to.equal(51);
    expect(orders[6].value).to.equal(47);
  });

  it('should realize a operation', async () => {
    const orderData = {
      userAddress: this.accounts[1].address,
      asset: 'VALE',
      numberOfShares: 4,
      acceptsFragmenting: true,
      isPassive: true,
    };

    await this.exchange.realizeOperationOfCreationOfOrder(
      true,
      orderData.userAddress,
      orderData.asset,
      56,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    let saleOrders = await this.exchange.returnSaleOrders(orderData.asset);

    expect(saleOrders.length).to.equal(1);

    await this.exchange.realizeOperationOfCreationOfOrder(
      false,
      orderData.userAddress,
      orderData.asset,
      56,
      orderData.numberOfShares,
      orderData.acceptsFragmenting,
      orderData.isPassive
    );

    let purchasedOrders = await this.exchange.returnPurchasedOrders(
      orderData.asset
    );

    expect(purchasedOrders.length).to.equal(1);

    await this.exchange.realizeOperationOfCreationOfTransaction(
      orderData.asset,
      saleOrders[0]
    );

    const transactions = await this.exchange.returnTransactions();

    expect(transactions.length).to.equal(1);

    saleOrders = await this.exchange.returnSaleOrders(orderData.asset);

    expect(saleOrders.length).to.equal(0);

    purchasedOrders = await this.exchange.returnPurchasedOrders(
      orderData.asset
    );

    expect(purchasedOrders.length).to.equal(0);
  });
});
