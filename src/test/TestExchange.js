const Exchange = artifacts.require("./Exchange.sol");

contract("Exchange", (accounts) => {
    const creatorAddress = accounts[0];

    beforeEach(async () => {
        this.exchange = await Exchange.new();
    });

    it("should deploy successfully", async () => {
        assert.notEqual(creatorAddress, 0x0);
        assert.notEqual(creatorAddress, "");
        assert.notEqual(creatorAddress, null);
        assert.notEqual(creatorAddress, undefined);
    });

    it("should compare assets", async () => {
        const sameAssets = await this.exchange.compareAssets("PETRO", "PETRO");

        assert.equal(sameAssets, true);

        const differentAssets = await this.exchange.compareAssets("PETRO", "VALE");

        assert.equal(differentAssets, false);
    });

    it("should create a order", async () => {
        const orderData = {
            index: 45,
            isSale: false,
            userAddress: accounts[1],
            assetCode: "VALE",
            value: 1235,
            numberOfShares: 4,
            acceptsFragmenting: true,
        };

        const order = await this.exchange.createOrder(
            orderData.index,
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            orderData.value,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        );

        assert.equal(orderData.index, order.index);
        assert.equal(orderData.isSale, order.isSale);
        assert.equal(orderData.userAddress, order.userAddress);
        assert.equal(orderData.assetCode, order.assetCode);
        assert.equal(orderData.value, order.value);
        assert.equal(orderData.numberOfShares, order.numberOfShares);
        assert.equal(orderData.acceptsFragmenting, order.acceptsFragmenting);
    });

    it("should create a transaction", async () => {
        const transactionData = {
            index: 14,
            seller: accounts[0],
            buyer: accounts[2],
            assetCode: "ITAUSA",
            value: 22,
            numberOfShares: 1,
            saleOrderIndex: 4,
            purchaseOrderIndex: 3,
        };

        const transaction = await this.exchange.createTransaction(
            transactionData.index,
            transactionData.seller,
            transactionData.buyer,
            transactionData.assetCode,
            transactionData.value,
            transactionData.numberOfShares,
            transactionData.saleOrderIndex,
            transactionData.purchaseOrderIndex
        );

        assert.equal(transactionData.index, transaction.index);
        assert.equal(transactionData.seller, transaction.seller);
        assert.equal(transactionData.buyer, transaction.buyer);
        assert.equal(transactionData.assetCode, transaction.assetCode);
        assert.equal(transactionData.value, transaction.value);
        assert.equal(
            transactionData.numberOfShares,
            transaction.numberOfShares
        );
        assert.equal(
            transactionData.saleOrderIndex,
            transaction.saleOrderIndex
        );
        assert.equal(
            transactionData.purchaseOrderIndex,
            transaction.purchaseOrderIndex
        );
    });

    it("should add orders", async () => {
        const orderData = {
            index: 45,
            isSale: false,
            userAddress: accounts[1],
            assetCode: "VALE",
            value: 1235,
            numberOfShares: 4,
            acceptsFragmenting: true,
        };

        const order = await this.exchange.createOrder(
            orderData.index,
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            orderData.value,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        );

        let orders;

        for (let i = 0; i <= 10; i++) {
            orders = await this.exchange.returnOrders();
            
            assert.equal(orders.length, i);

            await this.exchange.addOrder(order);
        }

        assert.equal(orders.length, 10);
    });

    it("should add transaction", async () => {
        const transactionData = {
            index: 14,
            seller: accounts[0],
            buyer: accounts[2],
            assetCode: "ITAUSA",
            value: 22,
            numberOfShares: 1,
            saleOrderIndex: 4,
            purchaseOrderIndex: 3,
        };

        const transaction = await this.exchange.createTransaction(
            transactionData.index,
            transactionData.seller,
            transactionData.buyer,
            transactionData.assetCode,
            transactionData.value,
            transactionData.numberOfShares,
            transactionData.saleOrderIndex,
            transactionData.purchaseOrderIndex
        );

        let transactions;

        for (let i = 0; i <= 10; i++) {
            transactions = await this.exchange.returnTransactions();
            
            assert.equal(transactions.length, i);

            await this.exchange.addTransaction(transaction);
        }

        assert.equal(transactions.length, 10);
    });

    it("should check transaction conflict", async () => {
        assert.equal(
            await this.exchange.checkTransactionConflict(
                false,
                true,
                true
            ),
            true
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                false,
                false,
                true
            ),
            true
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                false,
                false,
                false
            ),
            true
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                true,
                false,
                false
            ),
            true
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(true, true, true),
            false
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                true,
                true,
                false
            ),
            false
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                false,
                true,
                false
            ),
            false
        );
        assert.equal(
            await this.exchange.checkTransactionConflict(
                true,
                false,
                true
            ),
            false
        );
    });

    it("should return sale orders", async () => {
        const orderData = {
            isSale: true,
            userAddress: accounts[1],
            assetCode: "VALE",
            numberOfShares: 4,
            acceptsFragmenting: true,
        };

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            56,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            58,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            52,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            47,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            69,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            53,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            51,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        const orders = await this.exchange.returnSaleOrders();
        
        assert.equal(orders.length, 7);
        assert.equal(orders[0].value, 47);
        assert.equal(orders[1].value, 51);
        assert.equal(orders[2].value, 52);
        assert.equal(orders[3].value, 53);
        assert.equal(orders[4].value, 56);
        assert.equal(orders[5].value, 58);
        assert.equal(orders[6].value, 69);
    });

    it("should return purchased orders", async () => {
        const orderData = {
            isSale: false,
            userAddress: accounts[1],
            assetCode: "VALE",
            numberOfShares: 4,
            acceptsFragmenting: true,
        };

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            56,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            58,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            52,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            47,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            69,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            53,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        await this.exchange.realizeOperationOfCreationOfOrder(
            orderData.isSale,
            orderData.userAddress,
            orderData.assetCode,
            51,
            orderData.numberOfShares,
            orderData.acceptsFragmenting
        )

        const orders = await this.exchange.returnPurchasedOrders();
        
        assert.equal(orders.length, 7);
        assert.equal(orders[0].value, 69);
        assert.equal(orders[1].value, 58);
        assert.equal(orders[2].value, 56);
        assert.equal(orders[3].value, 53);
        assert.equal(orders[4].value, 52);
        assert.equal(orders[5].value, 51);
        assert.equal(orders[6].value, 47);
    });
});
