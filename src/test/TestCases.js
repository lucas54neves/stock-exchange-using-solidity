const { ethers } = require("hardhat");
const { expect } = require("chai");

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

describe("Case 1", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(
                this.purchasedOrders[0].userAddress,
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(0);

            expect(this.transactions[0].buyer).to.equal(
                this.buyerData.userAddress
            );
            expect(this.transactions[0].seller).to.equal(
                this.sellerData.userAddress
            );
            expect(this.transactions[0].asset).to.equal(this.asset);

            expect(this.transactions[0].value).to.equal(this.buyerData.value);
            expect(this.transactions[0].value).to.equal(this.sellerData.value);

            expect(this.transactions[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.transactions[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );

            expect(this.transactions[0].purchaseOrderIndex).to.equal(
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex).to.equal(
                this.saleOrderIndex
            );
        });
    });
});

describe("Case 2", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(0);

            expect(this.transactions[0].buyer, this.buyerData.userAddress);
            expect(this.transactions[0].seller, this.sellerData.userAddress);
            expect(this.transactions[0].asset, this.asset);

            expect(this.transactions[0].value, this.buyerData.value);
            expect(this.transactions[0].value, this.sellerData.value);

            expect(
                this.transactions[0].numberOfShares,
                this.buyerData.numberOfShares
            );
            expect(
                this.transactions[0].numberOfShares,
                this.sellerData.numberOfShares
            );

            expect(
                this.transactions[0].purchaseOrderIndex,
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex, this.saleOrderIndex);
        });
    });
});

describe("Case 3", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(
                this.purchasedOrders[0].userAddress,
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value, this.buyerData.value);
            expect(this.purchasedOrders[0].isSale, this.buyerData.isSale);
            expect(
                this.purchasedOrders[0].numberOfShares,
                this.buyerData.numberOfShares
            );
            expect(
                this.purchasedOrders[0].acceptsFragmenting,
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset, this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value, this.sellerData.value);
            expect(this.saleOrders[0].isSale, this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset, this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(0);

            expect(this.transactions[0].buyer, this.buyerData.userAddress);
            expect(this.transactions[0].seller, this.sellerData.userAddress);
            expect(this.transactions[0].asset, this.asset);

            expect(this.transactions[0].value, this.buyerData.value);
            expect(this.transactions[0].value, this.sellerData.value);

            expect(
                this.transactions[0].numberOfShares,
                this.buyerData.numberOfShares
            );
            expect(
                this.transactions[0].numberOfShares,
                this.sellerData.numberOfShares
            );

            expect(
                this.transactions[0].purchaseOrderIndex,
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex, this.saleOrderIndex);
        });
    });
});

describe("Case 4", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress, this.sellerData.userAddress);
            expect(this.saleOrders[0].value, this.sellerData.value);
            expect(this.saleOrders[0].isSale, this.sellerData.isSale);
            expect(
                this.saleOrders[0].numberOfShares,
                this.sellerData.numberOfShares
            );
            expect(
                this.saleOrders[0].acceptsFragmenting,
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset, this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(0);

            expect(this.transactions[0].buyer).to.equal(
                this.buyerData.userAddress
            );
            expect(this.transactions[0].seller).to.equal(
                this.sellerData.userAddress
            );
            expect(this.transactions[0].asset).to.equal(this.asset);

            expect(this.transactions[0].value).to.equal(this.buyerData.value);
            expect(this.transactions[0].value).to.equal(this.sellerData.value);

            expect(this.transactions[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.transactions[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );

            expect(this.transactions[0].purchaseOrderIndex).to.equal(
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex).to.equal(
                this.saleOrderIndex
            );
        });
    });
});

describe("Case 5", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(1);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order with shares rest", async () => {
            expect(this.transactions[0].buyer).to.equal(
                this.buyerData.userAddress
            );
            expect(this.transactions[0].seller).to.equal(
                this.sellerData.userAddress
            );
            expect(this.transactions[0].asset).to.equal(this.asset);

            expect(this.transactions[0].value).to.equal(this.buyerData.value);
            expect(this.transactions[0].value).to.equal(this.sellerData.value);

            expect(this.transactions[0].numberOfShares).to.equal(100);
            expect(this.saleOrders[0].numberOfShares).to.equal(50);

            expect(this.transactions[0].purchaseOrderIndex).to.equal(
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex).to.equal(
                this.saleOrderIndex
            );
        });
    });
});

describe("Case 6", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(0);
            expect(this.saleOrders.length).to.equal(1);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order with shares rest", async () => {
            expect(this.transactions[0].buyer).to.equal(
                this.buyerData.userAddress
            );
            expect(this.transactions[0].seller).to.equal(
                this.sellerData.userAddress
            );
            expect(this.transactions[0].asset).to.equal(this.asset);

            expect(this.transactions[0].value).to.equal(this.buyerData.value);
            expect(this.transactions[0].value).to.equal(this.sellerData.value);

            expect(this.transactions[0].numberOfShares).to.equal(100);
            expect(this.saleOrders[0].numberOfShares).to.equal(50);

            expect(this.transactions[0].purchaseOrderIndex).to.equal(
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex).to.equal(
                this.saleOrderIndex
            );
        });
    });
});

describe("Case 7", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should not create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(0);
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
        });
    });
});

describe("Case 8", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should not create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(0);
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
        });
    });
});

describe("Case 9", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 150,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(1);
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(0);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order with shares rest", async () => {
            expect(this.transactions[0].buyer).to.equal(
                this.buyerData.userAddress
            );
            expect(this.transactions[0].seller).to.equal(
                this.sellerData.userAddress
            );
            expect(this.transactions[0].asset).to.equal(this.asset);

            expect(this.transactions[0].value).to.equal(this.buyerData.value);
            expect(this.transactions[0].value).to.equal(this.sellerData.value);

            expect(this.transactions[0].numberOfShares).to.equal(100);
            expect(this.purchasedOrders[0].numberOfShares).to.equal(50);

            expect(this.transactions[0].purchaseOrderIndex).to.equal(
                this.purchaseOrderIndex
            );
            expect(this.transactions[0].saleOrderIndex).to.equal(
                this.saleOrderIndex
            );
        });
    });
});

describe("Case 10", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 150,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should not create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(0);
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
        });
    });
});

describe("Case 11", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 150,
            isSale: false,
            acceptsFragmenting: true,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        describe("transaction creation", () => {
            it("should create transaction", async () => {
                expect(this.purchasedOrders.length).to.equal(1);
                expect(this.saleOrders.length).to.equal(1);
                expect(this.transactions.length).to.equal(0);

                await this.exchange.realizeOperationOfCreationOfTransaction();

                this.transactions = await this.exchange.returnTransactions();

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                expect(this.transactions.length).to.equal(1);
                expect(this.purchasedOrders.length).to.equal(1);
                expect(this.saleOrders.length).to.equal(0);
            });
        });

        describe("sale order creation", () => {
            it("should create a sale order with shares rest", async () => {
                expect(this.transactions[0].buyer).to.equal(
                    this.buyerData.userAddress
                );
                expect(this.transactions[0].seller).to.equal(
                    this.sellerData.userAddress
                );
                expect(this.transactions[0].asset).to.equal(this.asset);

                expect(this.transactions[0].value).to.equal(
                    this.buyerData.value
                );
                expect(this.transactions[0].value).to.equal(
                    this.sellerData.value
                );

                expect(this.transactions[0].numberOfShares).to.equal(100);
                expect(this.purchasedOrders[0].numberOfShares).to.equal(50);

                expect(this.transactions[0].purchaseOrderIndex).to.equal(
                    this.purchaseOrderIndex
                );
                expect(this.transactions[0].saleOrderIndex).to.equal(
                    this.saleOrderIndex
                );
            });
        });
    });
});

describe("Case 12", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyerData = {
            userAddress: this.accounts[1].address,
            value: 78,
            numberOfShares: 150,
            isSale: false,
            acceptsFragmenting: false,
        };
        this.sellerData = {
            userAddress: this.accounts[2].address,
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

    describe("purchase order creation", () => {
        it("should create a purchase order", async () => {
            expect(this.purchasedOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.buyerData.isSale,
                this.buyerData.userAddress,
                this.asset,
                this.buyerData.value,
                this.buyerData.numberOfShares,
                this.buyerData.acceptsFragmenting
            );

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.purchasedOrders.length).to.equal(1);

            expect(this.purchasedOrders[0].userAddress).to.equal(
                this.buyerData.userAddress
            );
            expect(this.purchasedOrders[0].value).to.equal(
                this.buyerData.value
            );
            expect(this.purchasedOrders[0].isSale).to.equal(
                this.buyerData.isSale
            );
            expect(this.purchasedOrders[0].numberOfShares).to.equal(
                this.buyerData.numberOfShares
            );
            expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                this.buyerData.acceptsFragmenting
            );
            expect(this.purchasedOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("sale order creation", () => {
        it("should create a sale order", async () => {
            expect(this.saleOrders.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfOrder(
                this.sellerData.isSale,
                this.sellerData.userAddress,
                this.asset,
                this.sellerData.value,
                this.sellerData.numberOfShares,
                this.sellerData.acceptsFragmenting
            );

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            expect(this.saleOrders.length).to.equal(1);

            expect(this.saleOrders[0].userAddress).to.equal(
                this.sellerData.userAddress
            );
            expect(this.saleOrders[0].value).to.equal(this.sellerData.value);
            expect(this.saleOrders[0].isSale).to.equal(this.sellerData.isSale);
            expect(this.saleOrders[0].numberOfShares).to.equal(
                this.sellerData.numberOfShares
            );
            expect(this.saleOrders[0].acceptsFragmenting).to.equal(
                this.sellerData.acceptsFragmenting
            );
            expect(this.saleOrders[0].asset).to.equal(this.asset);
        });
    });

    describe("transaction creation", () => {
        it("should not create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();
            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );

            expect(this.transactions.length).to.equal(0);
            expect(this.purchasedOrders.length).to.equal(1);
            expect(this.saleOrders.length).to.equal(1);
        });
    });
});

describe("Case 13", (accounts) => {
    before(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");
        this.exchange = await Exchange.deploy();
        this.accounts = await ethers.getSigners();

        this.asset = "ABC123";
        this.purchasedOrders = [];
        this.saleOrders = [];
        this.transactions = [];
        this.buyersData = [
            {
                userAddress: this.accounts[1].address,
                value: 78,
                numberOfShares: 100,
                isSale: false,
                acceptsFragmenting: true,
            },
        ];
        this.sellersData = [
            {
                userAddress: this.accounts[2].address,
                value: 78,
                numberOfShares: 60,
                isSale: true,
                acceptsFragmenting: true,
            },
            {
                userAddress: this.accounts[3].address,
                value: 78,
                numberOfShares: 40,
                isSale: true,
                acceptsFragmenting: true,
            },
        ];
        this.purchaseOrderIndices = [1];
        this.saleOrderIndices = [2, 3];
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

    describe("purchase order creation", () => {
        it("should create purchase orders", async () => {
            for (let i = 0; i < this.buyersData.length; i++) {
                expect(this.purchasedOrders.length).to.equal(i);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.buyersData[i].isSale,
                    this.buyersData[i].userAddress,
                    this.asset,
                    this.buyersData[i].value,
                    this.buyersData[i].numberOfShares,
                    this.buyersData[i].acceptsFragmenting
                );

                this.purchasedOrders =
                    await this.exchange.returnPurchasedOrders(this.asset);

                expect(this.purchasedOrders.length).to.equal(i + 1);

                expect(this.purchasedOrders[0].userAddress).to.equal(
                    this.buyersData[i].userAddress
                );
                expect(this.purchasedOrders[0].value).to.equal(
                    this.buyersData[i].value
                );
                expect(this.purchasedOrders[0].isSale).to.equal(
                    this.buyersData[i].isSale
                );
                expect(this.purchasedOrders[0].numberOfShares).to.equal(
                    this.buyersData[i].numberOfShares
                );
                expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
                    this.buyersData[i].acceptsFragmenting
                );
                expect(this.purchasedOrders[0].asset).to.equal(this.asset);
            }
        });
    });

    describe("sale order creation", () => {
        it("should create sale orders", async () => {
            for (let i = 0; i < this.sellersData.length; i++) {
                expect(this.saleOrders.length).to.equal(i);

                await this.exchange.realizeOperationOfCreationOfOrder(
                    this.sellersData[i].isSale,
                    this.sellersData[i].userAddress,
                    this.asset,
                    this.sellersData[i].value,
                    this.sellersData[i].numberOfShares,
                    this.sellersData[i].acceptsFragmenting
                );

                this.saleOrders = await this.exchange.returnSaleOrders(
                    this.asset
                );

                expect(this.saleOrders.length).to.equal(i + 1);

                expect(this.saleOrders[i].userAddress).to.equal(
                    this.sellersData[i].userAddress
                );
                expect(this.saleOrders[i].value).to.equal(
                    this.sellersData[i].value
                );
                expect(this.saleOrders[i].isSale).to.equal(
                    this.sellersData[i].isSale
                );
                expect(this.saleOrders[i].numberOfShares).to.equal(
                    this.sellersData[i].numberOfShares
                );
                expect(this.saleOrders[i].acceptsFragmenting).to.equal(
                    this.sellersData[i].acceptsFragmenting
                );
                expect(this.saleOrders[i].asset).to.equal(this.asset);
            }
        });
    });

    describe("transaction creation", () => {
        it("should create transaction", async () => {
            expect(this.purchasedOrders.length).to.equal(
                this.buyersData.length
            );
            expect(this.saleOrders.length).to.equal(this.sellersData.length);
            expect(this.transactions.length).to.equal(0);

            await this.exchange.realizeOperationOfCreationOfTransaction();

            this.transactions = await this.exchange.returnTransactions();

            this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

            this.purchasedOrders = await this.exchange.returnPurchasedOrders(
                this.asset
            );
            // this.numberOfPurchasedOrders =
            //     await this.exchange.returnNumberOfPurchasedOrdersByAssets(
            //         this.asset
            //     );

            // const orders = await this.exchange.returnOrders();
            // console.log(orders);

            expect(this.transactions.length).to.equal(2);
            expect(this.saleOrders.length).to.equal(0);
            expect(this.purchasedOrders.length).to.equal(0);
        });
    });
});
