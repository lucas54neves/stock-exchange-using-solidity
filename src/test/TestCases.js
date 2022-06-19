const Exchange = artifacts.require("./Exchange.sol");

function viewListOfOrdersByAssetCode(asset, purchasedOrders, saleOrders) {
    const maximumLength = Math.max(purchasedOrders.length, saleOrders.length);

    const orders = [];

    for (let i = 0; i < maximumLength; i++) {
        orders.push([purchasedOrders[i], saleOrders[i]]);
    }

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

contract("Case 1", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 100,
            isSale: true,
            acceptsFragmenting: true,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 0);

                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.sellerData.numberOfShares
                );

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 2", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 100,
            isSale: true,
            acceptsFragmenting: true,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 0);

                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.sellerData.numberOfShares
                );

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 3", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 100,
            isSale: true,
            acceptsFragmenting: false,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 0);

                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.sellerData.numberOfShares
                );

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 4", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 100,
            isSale: true,
            acceptsFragmenting: false,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 0);

                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.transactions[0].numberOfShares,
                    this.sellerData.numberOfShares
                );

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 5", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 150,
            isSale: true,
            acceptsFragmenting: true,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 1);
            });
        });

        describe("sale order creation", () => {
            it("should create a sale order with shares rest", async () => {
                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(this.transactions[0].numberOfShares, 100);
                assert.equal(this.saleOrders[0].numberOfShares, 50);

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 6", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 150,
            isSale: true,
            acceptsFragmenting: true,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 1);
                assert.equal(this.purchasedOrders.length, 0);
                assert.equal(this.saleOrders.length, 1);
            });
        });

        describe("sale order creation", () => {
            it("should create a sale order with shares rest", async () => {
                assert.equal(
                    this.transactions[0].buyer,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.transactions[0].seller,
                    this.sellerData.userAddress
                );
                assert.equal(this.transactions[0].asset, this.asset);

                assert.equal(this.transactions[0].value, this.buyerData.value);
                assert.equal(this.transactions[0].value, this.sellerData.value);

                assert.equal(this.transactions[0].numberOfShares, 100);
                assert.equal(this.saleOrders[0].numberOfShares, 50);

                assert.equal(
                    this.transactions[0].purchaseOrderIndex,
                    this.purchaseOrderIndex
                );
                assert.equal(
                    this.transactions[0].saleOrderIndex,
                    this.saleOrderIndex
                );
            });
        });
    });
});

contract("Case 7", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 150,
            isSale: true,
            acceptsFragmenting: false,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should not create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 0);
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
            });
        });
    });
});

contract("Case 8", (accounts) => {
    before(async () => {
        this.exchange = await Exchange.new();
        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: accounts[0],
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: accounts[1],
            value: 78,
            numberOfShares: 150,
            isSale: true,
            acceptsFragmenting: false,
        };
        this.purchaseOrderIndex = 1;
        this.saleOrderIndex = 2;
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

    context("buyer creates a purchase order", () => {
        describe("purchase order creation", () => {
            it("should create a purchase order", async () => {
                assert.equal(this.purchasedOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyerData.isSale,
                    this.buyerData.userAddress,
                    this.asset,
                    this.buyerData.value,
                    this.buyerData.numberOfShares,
                    this.buyerData.acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.purchasedOrders.length, 1);

                assert.equal(
                    this.purchasedOrders[0].userAddress,
                    this.buyerData.userAddress
                );
                assert.equal(
                    this.purchasedOrders[0].value,
                    this.buyerData.value
                );
                assert.equal(
                    this.purchasedOrders[0].isSale,
                    this.buyerData.isSale
                );
                assert.equal(
                    this.purchasedOrders[0].numberOfShares,
                    this.buyerData.numberOfShares
                );
                assert.equal(
                    this.purchasedOrders[0].acceptsFragmenting,
                    this.buyerData.acceptsFragmenting
                );
                assert.equal(this.purchasedOrders[0].asset, this.asset);
            });
        });
    });

    context("seller creates a sale order", () => {
        describe("sale order creation", () => {
            it("should create a sale order", async () => {
                assert.equal(this.saleOrders.length, 0);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellerData.isSale,
                    this.sellerData.userAddress,
                    this.asset,
                    this.sellerData.value,
                    this.sellerData.numberOfShares,
                    this.sellerData.acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                assert.equal(this.saleOrders.length, 1);

                assert.equal(
                    this.saleOrders[0].userAddress,
                    this.sellerData.userAddress
                );
                assert.equal(this.saleOrders[0].value, this.sellerData.value);
                assert.equal(this.saleOrders[0].isSale, this.sellerData.isSale);
                assert.equal(
                    this.saleOrders[0].numberOfShares,
                    this.sellerData.numberOfShares
                );
                assert.equal(
                    this.saleOrders[0].acceptsFragmenting,
                    this.sellerData.acceptsFragmenting
                );
                assert.equal(this.saleOrders[0].asset, this.asset);
            });
        });
    });

    context("transaction creation", () => {
        describe("transaction creation", () => {
            it("should not create transaction", async () => {
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
                assert.equal(this.transactions.length, 0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();
                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );
                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                assert.equal(this.transactions.length, 0);
                assert.equal(this.purchasedOrders.length, 1);
                assert.equal(this.saleOrders.length, 1);
            });
        });
    });
});
