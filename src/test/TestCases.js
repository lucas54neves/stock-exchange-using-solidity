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
      }\t${order[1] ? order[1].value : ""}\t${
        order[1] ? order[1].numberOfShares : ""
      }`
    );
  }
}

const separator =
  "====================================================================================================";

describe(`${separator}\n\nCase 1: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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

      expect(this.purchasedOrders[0].userAddress, this.buyerData.userAddress);
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
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
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 2: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

      expect(this.transactions[0].purchaseOrderIndex, this.purchaseOrderIndex);
      expect(this.transactions[0].saleOrderIndex, this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 3: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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

      expect(this.purchasedOrders[0].userAddress, this.buyerData.userAddress);
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

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

      expect(this.transactions[0].purchaseOrderIndex, this.purchaseOrderIndex);
      expect(this.transactions[0].saleOrderIndex, this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 4: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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
      expect(this.saleOrders[0].numberOfShares, this.sellerData.numberOfShares);
      expect(
        this.saleOrders[0].acceptsFragmenting,
        this.sellerData.acceptsFragmenting
      );
      expect(this.saleOrders[0].asset, this.asset);
    });
  });

  describe("\nTransaction creation", () => {
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

      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
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
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 5: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a sell order with 50 shares will remain.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

  describe("\nSale order creation", () => {
    it("should create a sale order with shares rest", async () => {
      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
      expect(this.transactions[0].asset).to.equal(this.asset);

      expect(this.transactions[0].value).to.equal(this.buyerData.value);
      expect(this.transactions[0].value).to.equal(this.sellerData.value);

      expect(this.transactions[0].numberOfShares).to.equal(100);
      expect(this.saleOrders[0].numberOfShares).to.equal(50);

      expect(this.transactions[0].purchaseOrderIndex).to.equal(
        this.purchaseOrderIndex
      );
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 6: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a sell order with 50 shares will remain.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

  describe("\nSale order creation", () => {
    it("should create a sale order with shares rest", async () => {
      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
      expect(this.transactions[0].asset).to.equal(this.asset);

      expect(this.transactions[0].value).to.equal(this.buyerData.value);
      expect(this.transactions[0].value).to.equal(this.sellerData.value);

      expect(this.transactions[0].numberOfShares).to.equal(100);
      expect(this.saleOrders[0].numberOfShares).to.equal(50);

      expect(this.transactions[0].purchaseOrderIndex).to.equal(
        this.purchaseOrderIndex
      );
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 7: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

describe(`${separator}\n\nCase 8: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

describe(`${separator}\n\nCase 9: Buyer wants to buy 150 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a purchased order with 50 shares will remain.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

  describe("\nSale order creation", () => {
    it("should create a sale order with shares rest", async () => {
      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
      expect(this.transactions[0].asset).to.equal(this.asset);

      expect(this.transactions[0].value).to.equal(this.buyerData.value);
      expect(this.transactions[0].value).to.equal(this.sellerData.value);

      expect(this.transactions[0].numberOfShares).to.equal(100);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(50);

      expect(this.transactions[0].purchaseOrderIndex).to.equal(
        this.purchaseOrderIndex
      );
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 10: Buyer wants to buy 150 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will not take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

describe(`${separator}\n\nCase 11: Buyer wants to buy 150 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place and a purchased order with 50 shares will remain.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

    it("should create a sale order with shares rest", async () => {
      expect(this.transactions[0].buyer).to.equal(this.buyerData.userAddress);
      expect(this.transactions[0].seller).to.equal(this.sellerData.userAddress);
      expect(this.transactions[0].asset).to.equal(this.asset);

      expect(this.transactions[0].value).to.equal(this.buyerData.value);
      expect(this.transactions[0].value).to.equal(this.sellerData.value);

      expect(this.transactions[0].numberOfShares).to.equal(100);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(50);

      expect(this.transactions[0].purchaseOrderIndex).to.equal(
        this.purchaseOrderIndex
      );
      expect(this.transactions[0].saleOrderIndex).to.equal(this.saleOrderIndex);
    });
  });
});

describe(`${separator}\n\nCase 12: Buyer wants to buy 150 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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
      expect(this.purchasedOrders[0].value).to.equal(this.buyerData.value);
      expect(this.purchasedOrders[0].isSale).to.equal(this.buyerData.isSale);
      expect(this.purchasedOrders[0].numberOfShares).to.equal(
        this.buyerData.numberOfShares
      );
      expect(this.purchasedOrders[0].acceptsFragmenting).to.equal(
        this.buyerData.acceptsFragmenting
      );
      expect(this.purchasedOrders[0].asset).to.equal(this.asset);
    });
  });

  describe("\nSale order creation", () => {
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

  describe("\nTransaction creation", () => {
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

describe(`${separator}\n\nCase 13: Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. The first seller wants to sell 60 shares of asset ABC123 for 78 wei and accepts to split. The second seller wants to sell 40 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.`, () => {
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
    console.log();
    console.log("Before test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  afterEach(() => {
    console.log();
    console.log("After test");
    viewListOfOrdersByAssetCode(
      this.asset,
      this.purchasedOrders,
      this.saleOrders
    );
    console.log();
  });

  describe("\nPurchase order creation", () => {
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

        this.purchasedOrders = await this.exchange.returnPurchasedOrders(
          this.asset
        );

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

  describe("\nSale order creation", () => {
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

        this.saleOrders = await this.exchange.returnSaleOrders(this.asset);

        expect(this.saleOrders.length).to.equal(i + 1);

        expect(this.saleOrders[i].userAddress).to.equal(
          this.sellersData[i].userAddress
        );
        expect(this.saleOrders[i].value).to.equal(this.sellersData[i].value);
        expect(this.saleOrders[i].isSale).to.equal(this.sellersData[i].isSale);
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

  describe("\nTransaction creation", () => {
    it("should create transaction", async () => {
      expect(this.purchasedOrders.length).to.equal(this.buyersData.length);
      expect(this.saleOrders.length).to.equal(this.sellersData.length);
      expect(this.transactions.length).to.equal(0);

      await this.exchange.realizeOperationOfCreationOfTransaction();

      this.transactions = await this.exchange.returnTransactions();
      this.saleOrders = await this.exchange.returnSaleOrders(this.asset);
      this.purchasedOrders = await this.exchange.returnPurchasedOrders(
        this.asset
      );

      this.numberOfPurchasedOrders =
        await this.exchange.returnNumberOfPurchasedOrdersByAssets(this.asset);
      this.returnNumberOfSaleOrders =
        await this.exchange.returnNumberOfSaleOrdersByAssets(this.asset);

      expect(this.transactions.length).to.equal(2);
      expect(this.purchasedOrders.length).to.equal(0);
      expect(this.numberOfPurchasedOrders).to.equal(0);
      expect(this.saleOrders.length).to.equal(0);
      expect(this.returnNumberOfSaleOrders).to.equal(0);
    });
  });
});

const { testsData } = require("./data");

for (const data of testsData) {
  describe(`${separator}\n\n${data.testName}`, () => {
    before(async () => {
      const Exchange = await ethers.getContractFactory("Exchange");
      this.exchange = await Exchange.deploy();
      this.accounts = await ethers.getSigners();

      this.asset = "ABC123";
      this.purchasedOrders = [];
      this.saleOrders = [];
      this.transactions = [];
    });

    beforeEach(() => {
      console.log();
      console.log("Before test");
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();
    });

    afterEach(() => {
      console.log();
      console.log("After test");
      viewListOfOrdersByAssetCode(
        this.asset,
        this.purchasedOrders,
        this.saleOrders
      );
      console.log();
    });

    describe("\nPurchase order creation", () => {
      it("should create purchase orders", async () => {
        for (let i = 0; i < data.buyers.length; i++) {
          expect(this.purchasedOrders.length).to.equal(i);

          await this.exchange.realizeOperationOfCreationOfOrder(
            data.buyers[i].isSale,
            this.accounts[i + 1].address,
            data.asset,
            data.buyers[i].value,
            data.buyers[i].numberOfShares,
            data.buyers[i].acceptsFragmenting
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
          expect(this.purchasedOrders[0].asset).to.equal(data.asset);
        }
      });
    });

    describe("\nSale order creation", () => {
      it("should create sale orders", async () => {
        for (let i = 0; i < data.sellers.length; i++) {
          expect(this.saleOrders.length).to.equal(i);

          await this.exchange.realizeOperationOfCreationOfOrder(
            data.sellers[i].isSale,
            this.accounts[i + 1].address,
            data.asset,
            data.sellers[i].value,
            data.sellers[i].numberOfShares,
            data.sellers[i].acceptsFragmenting
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
          expect(this.saleOrders[i].asset).to.equal(data.asset);
        }
      });
    });

    describe("\nTransaction creation", () => {
      it(
        data.shouldCreateTransaction
          ? "should create transaction"
          : "should not create transaction",
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
          }
          expect(this.numberOfSaleOrders).to.equal(
            data.finalOrders.saleOrders.length
          );
        }
      );
    });
  });
}
