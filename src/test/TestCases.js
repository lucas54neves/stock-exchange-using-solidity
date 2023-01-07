const {
  getExchange,
  viewListOfOrdersByAssetCode,
  convertToNumber,
} = require('./utils');
const { expect } = require('chai');
const { testsData } = require('./data');
const { ethers, waffle } = require('hardhat');
const provider = waffle.provider;

async function getBalancesFromAddress(accounts) {
  console.log();

  for (const account of accounts) {
    const balance0ETH = await provider.getBalance(account.address);

    console.log(account.address, '\t', +balance0ETH);
  }

  console.log();
}

function getAddress(accounts, address) {
  for (const account of accounts) {
    if (account.address === address) {
      return account;
    }
  }

  return null;
}

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

    beforeEach(async () => {
      console.log();
      console.log('Before test');
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();

      // await getBalancesFromAddress(this.accounts);

      // const addressesFromBalances =
      //   await this.exchange.returnAddressesFromBalances();

      // for (const _address of addressesFromBalances) {
      //   const _addressAsAddress = getAddress(this.accounts, _address);

      //   const balance0ETH = await this.exchange
      //     .connect(_addressAsAddress)
      //     .getBalance();

      //   console.log(_address, '\t', +balance0ETH);
      // }
    });

    afterEach(async () => {
      console.log();
      console.log('After test');
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();

      // await getBalancesFromAddress(this.accounts);

      // const addressesFromBalances =
      //   await this.exchange.returnAddressesFromBalances();

      // console.log();
      // for (const _address of addressesFromBalances) {
      //   const _addressAsAddress = getAddress(this.accounts, _address);

      //   const balance0ETH = await this.exchange
      //     .connect(_addressAsAddress)
      //     .getBalance();

      //   console.log(_address, '\t', +balance0ETH);
      // }
      // console.log();
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
          asset: this.asset,
          value: data.buyers[i].value,
          numberOfShares: data.buyers[i].numberOfShares,
          acceptsFragmenting: data.buyers[i].acceptsFragmenting,
          isPassive: data.buyers[i].isPassive,
        };

        const balanceBefore = await this.exchange.getSmartContractBalance();

        await this.exchange.connect(this.accounts[i + 1]).depositMoney({
          value: ethers.utils.formatUnits(
            String(
              order.isPassive
                ? Math.ceil(order.value * 1.01)
                : Math.ceil(order.value * 1.02)
            ),
            'wei'
          ),
        });

        const balanceAfter = await this.exchange.getSmartContractBalance();

        expect(convertToNumber(balanceAfter)).to.equal(
          convertToNumber(balanceBefore) +
            (order.isPassive
              ? Math.ceil(order.value * 1.01)
              : Math.ceil(order.value * 1.02))
        );

        await this.exchange.realizeOperationOfCreationOfOrder(
          order.isSale,
          order.userAddress,
          order.asset,
          order.value,
          order.numberOfShares,
          order.acceptsFragmenting,
          order.isPassive
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
          isPassive: this.purchasedOrders[order.index - 1].isPassive,
        };

        expect(this.purchasedOrders.length).to.equal(order.index);

        expect(order.isSale).to.equal(newOrder.isSale);
        expect(order.userAddress).to.equal(newOrder.userAddress);
        expect(order.value).to.equal(newOrder.value);
        expect(order.asset).to.equal(newOrder.asset);
        expect(order.numberOfShares).to.equal(newOrder.numberOfShares);
        expect(order.acceptsFragmenting).to.equal(newOrder.acceptsFragmenting);
        expect(order.isPassive).to.equal(newOrder.isPassive);
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
          userAddress: this.accounts[2].address,
          asset: this.asset,
          value: data.sellers[i].value,
          numberOfShares: data.sellers[i].numberOfShares,
          acceptsFragmenting: data.sellers[i].acceptsFragmenting,
          isPassive: data.sellers[i].isPassive,
        };

        this.saleOrderIndex = this.saleOrders.length;

        const balanceBefore = await this.exchange.getSmartContractBalance();

        await this.exchange.connect(this.accounts[2]).depositMoney({
          value: ethers.utils.formatUnits(
            String(
              order.isPassive
                ? Math.ceil(order.value * 1.01)
                : Math.ceil(order.value * 1.02)
            ),
            'wei'
          ),
        });

        const balanceAfter = await this.exchange.getSmartContractBalance();

        expect(convertToNumber(balanceAfter)).to.equal(
          convertToNumber(balanceBefore) +
            (order.isPassive
              ? Math.ceil(order.value * 1.01)
              : Math.ceil(order.value * 1.02))
        );

        await this.exchange.realizeOperationOfCreationOfOrder(
          order.isSale,
          order.userAddress,
          order.asset,
          order.value,
          order.numberOfShares,
          order.acceptsFragmenting,
          order.isPassive
        );

        this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

        this.saleOrder = this.saleOrders[i];

        const newOrder = {
          index: this.saleOrders[i].index,
          isSale: this.saleOrders[i].isSale,
          userAddress: this.saleOrders[i].userAddress,
          asset: this.saleOrders[i].asset,
          value: this.saleOrders[i].value,
          numberOfShares: this.saleOrders[i].numberOfShares,
          acceptsFragmenting: this.saleOrders[i].acceptsFragmenting,
          isPassive: this.saleOrders[i].isPassive,
        };

        this.saleOrders = await this.exchange.returnSaleOrders(order.asset);

        expect(this.saleOrders.length).to.equal(order.index);

        expect(order.isSale).to.equal(newOrder.isSale);
        expect(order.value).to.equal(newOrder.value);
        expect(order.asset).to.equal(newOrder.asset);
        expect(order.numberOfShares).to.equal(newOrder.numberOfShares);
        expect(order.acceptsFragmenting).to.equal(newOrder.acceptsFragmenting);
        expect(order.userAddress).to.equal(newOrder.userAddress);
        expect(order.isPassive).to.equal(newOrder.isPassive);
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

        // await this.exchange.realizeOperationOfCreationOfTransactionInAllAsset(
        //   this.asset
        // );

        for (const saleOrder of this.saleOrders) {
          await this.exchange.realizeOperationOfCreationOfTransaction(
            this.asset,
            saleOrder
          );
        }

        this.transactions = await this.exchange.returnTransactions();

        expect(this.transactions.length > 0).to.equal(
          data.shouldCreateTransaction,
          'should create transaction'
        );

        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
          this.asset
        );
        this.saleOrders = await this.exchange
          .connect(this.accounts[0])
          .returnSaleOrders('ABC123');
        expect(this.transactions.length).to.equal(
          data.finalOrders.transactions.length
        );

        this.numberOfPurchasedOrders =
          await this.exchange.returnNumberOfPurchasedOrdersByAssets(this.asset);
        this.numberOfSaleOrders =
          await this.exchange.returnNumberOfSaleOrdersByAssets(this.asset);

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
