const Exchange = artifacts.require("./Exchange.sol");

function viewListOfOrdersByAssetCode(asset, purchasedOrders, saleOrders) {
    const orders = purchasedOrders.map(function (e, i) {
        return [e, saleOrders[i]];
    });

    console.log(`Asset: ${asset}`);
    console.log("Qtd\tCompra\tVenda\tQtd");

    for (const order of orders) {
        console.log(
            `${order[0] ? order[0].numberOfShares : ""}\t${
                order[0] ? order[0].value : ""
            }\t${order[1] ? order[1].numberOfShares : ""}\t${
                order[1] ? order[1].value : ""
            }`
        );
    }
}

contract("Scenario 1", (accounts) => {
    // 1. Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts
    // to split, seller wants to sell 100 shares of asset ABC123 for 78 wei and
    // accepts to split.
    // - There will be transaction.
    // - The buyer will buy 100 shares. Therefore, the purchase order must be removed. Shares must be traded for 78 wei.
    // - The seller will sell 100 shares. Therefore, the sales order must be removed. Shares must be traded for 78 wei.
    this.buyerData = {
        buyerAddress: accounts[0],
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
    };

    this.sellerData = {
        buyerAddress: accounts[1],
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
    };

    this.asset = "ABC123";
    this.purchasedOrders = [];
    this.saleOrders = [];

    before(async () => {
        this.exchange = await Exchange.new();
    });

    beforeEach(() => {
        console.log("Before test");
        viewListOfOrdersByAssetCode(
            this.asset,
            this.purchasedOrders,
            this.saleOrders
        );
    });

    afterEach(() => {
        console.log("After test");
        viewListOfOrdersByAssetCode(
            this.asset,
            this.purchasedOrders,
            this.saleOrders
        );
    });

    it("buyer creates purchase order", async () => {
        assert.equal(this.purchasedOrders.length, 0);

        await this.exchange.realizeOperationOfCreationOfOrder(
            this.buyerData.isSale,
            this.buyerData.buyerAddress,
            this.asset,
            this.buyerData.value,
            this.buyerData.numberOfShares,
            this.buyerData.acceptsFragmenting
        );

        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
            this.asset
        );

        assert.equal(this.purchasedOrders.length, 1);
    });

    it("seller creates sale order", async () => {
        assert.equal(this.saleOrders.length, 0);

        await this.exchange.realizeOperationOfCreationOfOrder(
            this.sellerData.isSale,
            this.sellerData.buyerAddress,
            this.asset,
            this.sellerData.value,
            this.sellerData.numberOfShares,
            this.sellerData.acceptsFragmenting
        );

        this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

        assert.equal(this.saleOrders.length, 1);
    });

    it("should create transaction", async () => {
        assert.equal(this.purchasedOrders.length, 1);
        assert.equal(this.saleOrders.length, 1);

        await this.exchange.realizeOperationOfCreationOfTransaction();

        const transactions = await this.exchange.returnTransactions();

        assert.equal(transactions.length, 1);

        this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
            this.asset
        );

        assert.equal(this.purchasedOrders.length, 0);
        assert.equal(this.saleOrders.length, 0);
    });
});
