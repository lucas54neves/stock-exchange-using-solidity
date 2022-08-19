const { ethers } = require('hardhat');
const { expect } = require('chai');
const { testsData } = require('./data');

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

const separator =
  '====================================================================================================';

for (const data of testsData) {
  describe(`${separator}\n\n${data.testName}: ${
    data.description ? data.description : ''
  }`, () => {
    before(async () => {
      const Exchange = await ethers.getContractFactory('Exchange');
      this.exchange = await Exchange.deploy();
      this.accounts = await ethers.getSigners();

      this.asset = 'ABC123';
      this.purchasedOrders = [];
      this.saleOrders = [];
      this.transactions = [];
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

    describe('\nPurchase order creation', () => {
      it('should create purchase orders', async () => {
        for (let i = 0; i < data.buyers.length; i++) {
          expect(this.purchasedOrders.length).to.equal(i);

          await this.exchange.realizeOperationOfCreationOfOrder(
            data.buyers[i].isSale,
            this.accounts[i + 1].address,
            data.asset,
            data.buyers[i].value,
            data.buyers[i].numberOfShares,
            data.buyers[i].acceptsFragmenting,
            data.buyers[i].isPassive
          );

          this.purchasedOrders = await this.exchange.returnPurchasedOrders(
            data.asset
          );

          expect(this.purchasedOrders.length).to.equal(i + 1);

          expect(this.purchasedOrders[0].userAddress).to.equal(
            this.accounts[i + 1].address
          );
          expect(this.purchasedOrders[0].value).to.equal(data.buyers[i].value);
          expect(this.purchasedOrders[0].isSale).to.equal(
            data.buyers[i].isSale
          );
          expect(this.purchasedOrders[0].numberOfShares).to.equal(
            data.buyers[i].numberOfShares
          );
          expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
            data.buyers[i].acceptsFragmenting
          );
          expect(this.purchasedOrders[0].isPassive).to.equal(
            data.buyers[i].isPassive
          );
          expect(this.purchasedOrders[0].asset).to.equal(data.asset);
        }
      });
    });

    describe('\nSale order creation', () => {
      it('should create sale orders', async () => {
        for (let i = 0; i < data.sellers.length; i++) {
          expect(this.saleOrders.length).to.equal(i);

          await this.exchange.realizeOperationOfCreationOfOrder(
            data.sellers[i].isSale,
            this.accounts[i + 1].address,
            data.asset,
            data.sellers[i].value,
            data.sellers[i].numberOfShares,
            data.sellers[i].acceptsFragmenting,
            data.sellers[i].isPassive
          );

          this.saleOrders = await this.exchange.returnSaleOrders(data.asset);

          expect(this.saleOrders.length).to.equal(i + 1);

          expect(this.saleOrders[i].userAddress).to.equal(
            this.accounts[i + 1].address
          );
          expect(this.saleOrders[i].value).to.equal(data.sellers[i].value);
          expect(this.saleOrders[i].isSale).to.equal(data.sellers[i].isSale);
          expect(this.saleOrders[i].numberOfShares).to.equal(
            data.sellers[i].numberOfShares
          );
          expect(this.saleOrders[i].acceptsFragmenting).to.equal(
            data.sellers[i].acceptsFragmenting
          );
          expect(this.saleOrders[i].isPassive).to.equal(
            data.sellers[i].isPassive
          );
          expect(this.saleOrders[i].asset).to.equal(data.asset);
        }
      });
    });

    describe('\nTransaction creation', () => {
      it(
        data.shouldCreateTransaction
          ? 'should create transaction'
          : 'should not create transaction',
        async () => {
          expect(this.purchasedOrders.length).to.equal(data.buyers.length);
          expect(this.saleOrders.length).to.equal(data.sellers.length);
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
            await this.exchange.returnNumberOfPurchasedOrdersByAssets(
              data.asset
            );
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
            data.finalOrders.purchasedOrders.length
          );
          for (let i = 0; i < data.finalOrders.purchasedOrders.length; i++) {
            expect(this.purchasedOrders[i].value).to.equal(
              data.finalOrders.purchasedOrders[i].value
            );
            expect(this.purchasedOrders[i].numberOfShares).to.equal(
              data.finalOrders.purchasedOrders[i].numberOfShares
            );
            expect(this.purchasedOrders[i].isSale).to.equal(
              data.finalOrders.purchasedOrders[i].isSale
            );
            expect(this.purchasedOrders[i].acceptsFragmenting).to.equal(
              data.finalOrders.purchasedOrders[i].acceptsFragmenting
            );
            expect(this.purchasedOrders[i].isPassive).to.equal(
              data.finalOrders.purchasedOrders[i].isPassive
            );
          }
          expect(this.numberOfPurchasedOrders).to.equal(
            data.finalOrders.purchasedOrders.length
          );

          expect(this.saleOrders.length).to.equal(
            data.finalOrders.saleOrders.length
          );
          for (let i = 0; i < data.finalOrders.saleOrders.length; i++) {
            expect(this.saleOrders[i].value).to.equal(
              data.finalOrders.saleOrders[i].value
            );
            expect(this.saleOrders[i].numberOfShares).to.equal(
              data.finalOrders.saleOrders[i].numberOfShares
            );
            expect(this.saleOrders[i].isSale).to.equal(
              data.finalOrders.saleOrders[i].isSale
            );
            expect(this.saleOrders[i].acceptsFragmenting).to.equal(
              data.finalOrders.saleOrders[i].acceptsFragmenting
            );
            expect(this.saleOrders[i].isPassive).to.equal(
              data.finalOrders.saleOrders[i].isPassive
            );
          }
          expect(this.numberOfSaleOrders).to.equal(
            data.finalOrders.saleOrders.length
          );
        }
      );
    });
  });
}
