const StockExchange = artifacts.require("./StockExchange.sol");

function viewListOfOrdersByAssetCode(assetCode, orders) {
    console.log(`Asset: ${assetCode}`);
    for (const order of orders) {
        console.log(`${order.numberOfShares} ${order.targetPricePerShare}`);
    }
}

contract("Scenario 1", (accounts) => {
    creatorAddress = accounts[0];
    // 1. Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts
    // to split, seller wants to sell 100 shares of asset ABC123 for 78 wei and
    // accepts to split.
    // - There will be transaction.
    // - The buyer will buy 100 shares. Therefore, the purchase order must be removed. Shares must be traded for 78 wei.
    // - The seller will sell 100 shares. Therefore, the sales order must be removed. Shares must be traded for 78 wei.
    it("should deploy successfully", async () => {
        this.stockExchange = await StockExchange.new();
        assert.notEqual(creatorAddress, 0x0);
        assert.notEqual(creatorAddress, "");
        assert.notEqual(creatorAddress, null);
        assert.notEqual(creatorAddress, undefined);
    });

    it("buyer creates purchase order", async () => {
        const buyerData = {
            buyerAddress: accounts[0],
            assetCode: "ABC123",
            targetPricePerShare: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };

        const purchaseOrdersBefore = await this.stockExchange.returnOrders(
            false,
            buyerData.assetCode
        );

        assert.equal(purchaseOrdersBefore.length, 0);

        const createOrder = await this.stockExchange.addOrder(
            buyerData.buyerAddress,
            buyerData.assetCode,
            buyerData.targetPricePerShare,
            buyerData.numberOfShares,
            buyerData.isSale,
            buyerData.acceptsFragmenting
        );

        const purchaseOrdersAfter = await this.stockExchange.returnOrders(
            false,
            buyerData.assetCode
        );

        viewListOfOrdersByAssetCode(buyerData.assetCode, purchaseOrdersAfter);

        assert.equal(purchaseOrdersAfter.length, 1);
    });
});
