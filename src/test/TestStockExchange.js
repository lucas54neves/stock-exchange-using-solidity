const StockExchange = artifacts.require("./StockExchange.sol");

contract("StockExchange", (accounts) => {
    const creatorAddress = accounts[0];

    beforeEach(async () => {
        this.stockExchange = await StockExchange.new();
    });

    it("should deploy successfully", async () => {
        assert.notEqual(creatorAddress, 0x0);
        assert.notEqual(creatorAddress, "");
        assert.notEqual(creatorAddress, null);
        assert.notEqual(creatorAddress, undefined);
    });

    it("should return sales orders", async () => {
        let salesOrders = await this.stockExchange.getSalesOrdersArray();

        assert.equal(salesOrders.length, 0);

        for (let i = 1; i <= 10; i++) {
            await this.stockExchange.insertOrder(
                salesOrders,
                accounts[2],
                "ITAUSA",
                58,
                3,
                true,
                false
            );

            salesOrders = await this.stockExchange.getSalesOrdersArray();

            assert.equal(salesOrders.length, i);
        }
    });

    it("should return purchase orders", async () => {
        let purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();

        assert.equal(purchaseOrders.length, 0);

        for (let i = 1; i <= 10; i++) {
            await this.stockExchange.insertOrder(
                purchaseOrders,
                accounts[2],
                "ITAUSA",
                58,
                3,
                false,
                false
            );

            purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();

            assert.equal(purchaseOrders.length, i);
        }
    });

    it("should return transactions", async () => {
        let transactions = await this.stockExchange.getTransactions();

        const transaction = await this.stockExchange.createTransaction(
            accounts[1],
            accounts[2],
            "ABC123",
            35,
            9
        );

        for (let i = 1; i <= 10; i++) {
            await this.stockExchange.addTransaction(transaction);

            transactions = await this.stockExchange.getTransactions();

            assert.equal(transactions.length, i);
        }
    });

    it("should compare assets", async () => {
        const equalsAssets = await this.stockExchange.compareAssets(
            "ITAUSA",
            "ITAUSA"
        );
        const notEqualsAssets = await this.stockExchange.compareAssets(
            "ITAUSA",
            "PETRO"
        );

        assert.equal(equalsAssets, true);
        assert.notEqual(notEqualsAssets, true);
    });

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
    });

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
    });

    it("should add sale order", async () => {
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
    });

    it("should add transaction", async () => {
        const transaction = await this.stockExchange.createTransaction(
            accounts[1],
            accounts[2],
            "ABC123",
            35,
            9
        );

        await this.stockExchange.addTransaction(transaction);

        const transactions = await this.stockExchange.getTransactions();

        assert.equal(transactions.length, 1);
        assert.equal(transactions[0].seller, accounts[1]);
        assert.equal(transactions[0].buyer, accounts[2]);
        assert.equal(transactions[0].assetCode, "ABC123");
        assert.equal(transactions[0].pricePerShare, 35);
        assert.equal(transactions[0].numberOfShares, 9);
    });

    it("should add purchase order", async () => {
        const order = await this.stockExchange.createOrder(
            54,
            accounts[2],
            "ITAUSA",
            58,
            3,
            false
        );

        await this.stockExchange.addPurchaseOrder(order);

        const orders = await this.stockExchange.getPurchaseOrdersArray();

        assert.equal(orders.length, 1);
        assert.equal(orders[0].index, 54);
        assert.equal(orders[0].userAddress, accounts[2]);
        assert.equal(orders[0].assetCode, "ITAUSA");
        assert.equal(orders[0].targetPricePerShare, 58);
        assert.equal(orders[0].numberOfShares, 3);
        assert.equal(orders[0].acceptsFragmenting, false);
    });

    it("should insert order", async () => {
        let purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();
        let salesOrders = await this.stockExchange.getSalesOrdersArray();

        assert.equal(purchaseOrders.length, 0);
        assert.equal(salesOrders.length, 0);

        await this.stockExchange.insertOrder(
            purchaseOrders,
            accounts[2],
            "ITAUSA",
            58,
            3,
            false,
            false
        );

        purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();

        assert.equal(purchaseOrders.length, 1);
        assert.equal(purchaseOrders[0].userAddress, accounts[2]);
        assert.equal(purchaseOrders[0].assetCode, "ITAUSA");
        assert.equal(purchaseOrders[0].targetPricePerShare, 58);
        assert.equal(purchaseOrders[0].numberOfShares, 3);
        assert.equal(purchaseOrders[0].acceptsFragmenting, false);

        await this.stockExchange.insertOrder(
            purchaseOrders,
            accounts[3],
            "BR132",
            46,
            3,
            true,
            false
        );

        salesOrders = await this.stockExchange.getSalesOrdersArray();

        assert.equal(salesOrders.length, 1);
        assert.equal(salesOrders[0].userAddress, accounts[3]);
        assert.equal(salesOrders[0].assetCode, "BR132");
        assert.equal(salesOrders[0].targetPricePerShare, 46);
        assert.equal(salesOrders[0].numberOfShares, 3);
        assert.equal(salesOrders[0].acceptsFragmenting, false);
    });

    it("should return number of orders", async () => {
        let purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();
        let salesOrders = await this.stockExchange.getSalesOrdersArray();

        assert.equal(
            await this.stockExchange.numberOfOrders(purchaseOrders),
            0
        );
        assert.equal(await this.stockExchange.numberOfOrders(salesOrders), 0);

        await this.stockExchange.insertOrder(
            purchaseOrders,
            accounts[2],
            "ITAUSA",
            58,
            3,
            false,
            false
        );

        purchaseOrders = await this.stockExchange.getPurchaseOrdersArray();

        assert.equal(
            await this.stockExchange.numberOfOrders(purchaseOrders),
            1
        );

        await this.stockExchange.insertOrder(
            purchaseOrders,
            accounts[3],
            "BR132",
            46,
            3,
            true,
            false
        );

        salesOrders = await this.stockExchange.getSalesOrdersArray();

        assert.equal(await this.stockExchange.numberOfOrders(salesOrders), 1);
    });

    // addOrder

    it("should check transaction conflict", async () => {
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                false,
                true,
                true
            ),
            true
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                false,
                false,
                true
            ),
            true
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                false,
                false,
                false
            ),
            true
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                true,
                false,
                false
            ),
            true
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(true, true, true),
            false
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                true,
                true,
                false
            ),
            false
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                false,
                true,
                false
            ),
            false
        );
        assert.equal(
            await this.stockExchange.checkTransactionConflict(
                true,
                false,
                true
            ),
            false
        );
    });
});
