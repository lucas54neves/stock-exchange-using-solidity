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

contract("Test Cases", (accounts) => {
    this.asset = "ABC123";
    this.purchasedOrders = [];
    this.saleOrders = [];
    this.transactions = [];

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

    context("Case 1", () => {
        describe("buyer creates a purchase order", () => {
            it("should create a purchase order", async () => {
                const buyerData = {
                    buyerAddress: accounts[0],
                    value: 78,
                    numberOfShares: 100,
                    isSale: false,
                    acceptsFragmenting: true,
                };

                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    buyerData.isSale,
                    buyerData.buyerAddress,
                    this.asset,
                    buyerData.value,
                    buyerData.numberOfShares,
                    buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    buyerData.buyerAddress
                );
                assert.equal(this.purchasedOrders[0].value, buyerData.value);
                assert.equal(this.purchasedOrders[0].isSale, buyerData.isSale);
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });

        describe("seller creates a sale order", () => {
            it("should create a sale order", async () => {
                const sellerData = {
                    sellerAddress: accounts[1],
                    value: 78,
                    numberOfShares: 100,
                    isSale: true,
                    acceptsFragmenting: true,
                };

                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    sellerData.isSale,
                    sellerData.sellerAddress,
                    this.asset,
                    sellerData.value,
                    sellerData.numberOfShares,
                    sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);
                assert.equal(
                    this.saleOrders[0].userAddress,
                    sellerData.sellerAddress
                );
                assert.equal(this.saleOrders[0].value, sellerData.value);
                assert.equal(this.saleOrders[0].isSale, sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });

        describe("transaction creation", () => {
            it("should create transaction", async () => {
                const transactionData = {
                    index: 1,
                    buyer: accounts[0],
                    seller: accounts[1],
                    asset: "ABC123",
                    value: 78,
                    numberOfShares: 100,
                    purchaseOrderIndex: this.purchasedOrders[0].index,
                    saleOrderIndex: this.saleOrders[0].index,
                };

                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();

                assert.equal(this.transactions.length, 1);

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 0);

                assert.equal(this.transactions[0].index, transactionData.index);
                assert.equal(this.transactions[0].buyer, transactionData.buyer);
                assert.equal(
                    this.transactions[0].seller,
                    transactionData.seller
                );
                assert.equal(this.transactions[0].asset, transactionData.asset);
                assert.equal(this.transactions[0].value, transactionData.value);
                assert.equal(
                    this.transactions[0].numberOfShares,
                    transactionData.numberOfShares
                );
                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    transactionData.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    transactionData.saleOrderIndex
                );
            });
        });
    });
});
