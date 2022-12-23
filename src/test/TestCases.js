const { getExchange, viewListOfOrdersByAssetCode } = require('./utils');
const { expect } = require('chai');
const { testsData } = require('./data');

for (const data of testsData) {
  describe(data.testName, () => {
    before(async () => {
      this.asset = 'ABC123';

      const { exchange, accounts } = await getExchange(this.asset);

      this.exchange = exchange;
      this.accounts = accounts;

      this.orders = await this.exchange.returnOrders();
      this.purchasedOrders = await this.exchange.returnPurchasedOrders(
        this.asset
      );
      this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

      this.transactions = [];

      this.initialNumberOfOrders = this.orders.length;
      this.initialNumberOfPurchasedOrders = this.purchasedOrders.length;
      this.initialNumberOfSaleOrders = this.saleOrders.length;
    });

    beforeEach(() => {
      console.log();
      console.log('Before test');
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();
    });

    afterEach(() => {
      console.log();
      console.log('After test');
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();
    });

    it('should be orders default', async () => {
      expect(this.initialNumberOfOrders).to.not.equal(0);
      expect(this.initialNumberOfPurchasedOrders).to.not.equal(0);
      expect(this.initialNumberOfSaleOrders).to.not.equal(0);
    });

    it('should be enable to create a purchased order', async () => {
      for (let i = 0; i < data.buyers.length; i++) {
        expect(this.purchasedOrders.length).to.equal(
          this.initialNumberOfPurchasedOrders + i
        );

        const order = {
          index: this.purchasedOrders.length + 1,
          isSale: data.buyers[i].isSale,
          userAddress: this.accounts[i + 1].address,
          asset: data.asset,
          value: data.buyers[i].value,
          numberOfShares: data.buyers[i].numberOfShares,
          acceptsFragmenting: data.buyers[i].acceptsFragmenting,
        };

        await this.exchange.realizeOperationOfCreationOfOrder(
          order.isSale,
          order.userAddress,
          order.asset,
          order.value,
          order.numberOfShares,
          order.acceptsFragmenting
        );

        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
          this.asset
        );

        const newOrder = {
          index: this.purchasedOrders[order.index - 1].index,
          isSale: this.purchasedOrders[order.index - 1].isSale,
          userAddress: this.purchasedOrders[order.index - 1].userAddress,
          asset: this.purchasedOrders[order.index - 1].asset,
          value: this.purchasedOrders[order.index - 1].value,
          numberOfShares: this.purchasedOrders[order.index - 1].numberOfShares,
          acceptsFragmenting:
            this.purchasedOrders[order.index - 1].acceptsFragmenting,
        };

        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
          order.asset
        );

        expect(this.purchasedOrders.length).to.equal(order.index);

        expect(order.isSale).to.equal(newOrder.isSale);
        expect(order.userAddress).to.equal(newOrder.userAddress);
        expect(order.value).to.equal(newOrder.value);
        expect(order.asset).to.equal(newOrder.asset);
        expect(order.numberOfShares).to.equal(newOrder.numberOfShares);
        expect(order.acceptsFragmenting).to.equal(newOrder.acceptsFragmenting);
      }
    });

    it('should be enable to create a sale order', async () => {
      for (let i = 0; i < data.sellers.length; i++) {
        expect(this.saleOrders.length).to.equal(
          this.initialNumberOfSaleOrders + i
        );

        const order = {
          index: this.saleOrders.length + 1,
          isSale: data.sellers[i].isSale,
          userAddress: this.accounts[i + 1].address,
          asset: data.asset,
          value: data.sellers[i].value,
          numberOfShares: data.sellers[i].numberOfShares,
          acceptsFragmenting: data.sellers[i].acceptsFragmenting,
        };

        await this.exchange.realizeOperationOfCreationOfOrder(
          order.isSale,
          order.userAddress,
          order.asset,
          order.value,
          order.numberOfShares,
          order.acceptsFragmenting
        );

        this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

        const newOrder = {
          index: this.saleOrders[i].index,
          isSale: this.saleOrders[i].isSale,
          userAddress: this.saleOrders[i].userAddress,
          asset: this.saleOrders[i].asset,
          value: this.saleOrders[i].value,
          numberOfShares: this.saleOrders[i].numberOfShares,
          acceptsFragmenting: this.saleOrders[i].acceptsFragmenting,
        };

        this.saleOrders = await this.exchange.returnSaleOrders(order.asset);

        expect(this.saleOrders.length).to.equal(order.index);

        expect(order.isSale).to.equal(newOrder.isSale);
        expect(order.value).to.equal(newOrder.value);
        expect(order.asset).to.equal(newOrder.asset);
        expect(order.numberOfShares).to.equal(newOrder.numberOfShares);
        expect(order.acceptsFragmenting).to.equal(newOrder.acceptsFragmenting);

        expect(order.userAddress).to.equal(newOrder.userAddress);
      }
    });

    it(
      data.shouldCreateTransaction
        ? 'should create transaction'
        : 'should not create transaction',
      async () => {
        expect(this.purchasedOrders.length).to.equal(
          this.initialNumberOfPurchasedOrders + data.buyers.length
        );
        expect(this.saleOrders.length).to.equal(
          this.initialNumberOfSaleOrders + data.sellers.length
        );
        expect(this.transactions.length).to.equal(0);

        await this.exchange.realizeOperationOfCreationOfTransaction();

        this.transactions = await this.exchange.returnTransactions();
        this.saleOrders = await this.exchange.returnSaleOrders(data.asset);
        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
          data.asset
        );

        expect(this.transactions.length > 0).to.equal(
          data.shouldCreateTransaction
        );

        this.numberOfPurchasedOrders =
          await this.exchange.returnNumberOfPurchasedOrdersByAssets(data.asset);
        this.numberOfSaleOrders =
          await this.exchange.returnNumberOfSaleOrdersByAssets(data.asset);

        expect(this.transactions.length).to.equal(
          data.finalOrders.transactions.length
        );

        for (let i = 0; i < data.finalOrders.transactions.length; i++) {
          expect(this.transactions[i].value).to.equal(
            data.finalOrders.transactions[i].value
          );
          expect(this.transactions[i].numberOfShares).to.equal(
            data.finalOrders.transactions[i].numberOfShares
          );
        }

        expect(this.purchasedOrders.length).to.equal(
          this.initialNumberOfPurchasedOrders +
            data.finalOrders.purchasedOrders.length
        );

        expect(this.saleOrders.length).to.equal(
          this.initialNumberOfSaleOrders + data.finalOrders.saleOrders.length
        );
      }
    );
  });
}
