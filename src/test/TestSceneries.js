const Exchange = artifacts.require("./Exchange.sol");

function viewListOfOrdersByAssetCode(asset, orders) {
    console.log(`Asset: ${asset}`);
    for (const order of orders) {
        console.log(`${order.numberOfShares} ${order.value}`);
    }
}

contract("Scenario 1", (accounts) => {
    this.creatorAddress = accounts[0];
    // 1. Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts
    // to split, seller wants to sell 100 shares of asset ABC123 for 78 wei and
    // accepts to split.
    // - There will be transaction.
    // - The buyer will buy 100 shares. Therefore, the purchase order must be removed. Shares must be traded for 78 wei.
    // - The seller will sell 100 shares. Therefore, the sales order must be removed. Shares must be traded for 78 wei.
    it("should deploy successfully", async () => {
        this.exchange = await Exchange.new();
        assert.notEqual(this.creatorAddress, 0x0);
        assert.notEqual(this.creatorAddress, "");
        assert.notEqual(this.creatorAddress, null);
        assert.notEqual(this.creatorAddress, undefined);
    });

    it("buyer creates purchase order", async () => {
        const buyerData = {
            buyerAddress: accounts[0],
            asset: "ABC123",
            value: 78,
            numberOfShares: 100,
            isSale: false,
            acceptsFragmenting: true,
        };

        const purchaseOrdersBefore = await this.exchange.returnPurchasedOrders(
            buyerData.asset
        );

        assert.equal(purchaseOrdersBefore.length, 0);

        console.log("Before of order creation");
        viewListOfOrdersByAssetCode(buyerData.asset, purchaseOrdersBefore);

        const createOrder = await this.exchange.addOrder(
            buyerData.buyerAddress,
            buyerData.asset,
            buyerData.value,
            buyerData.numberOfShares,
            buyerData.isSale,
            buyerData.acceptsFragmenting
        );

        const purchaseOrdersAfter = await this.exchange.returnPurchasedOrders(
            buyerData.asset
        );

        assert.equal(purchaseOrdersAfter.length, 1);

        console.log("Before of order creation");
        viewListOfOrdersByAssetCode(buyerData.asset, purchaseOrdersAfter);
    });
});
