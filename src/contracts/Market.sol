// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Market {
    struct Order {
        address sellerOrBuyerAddress;
        string assetCode;
        uint targetPricePerShare;
        uint numberOfShares;
        uint createdAt;
        uint executedAt;
        bool isSell;
        bool executed;
    }

    Order[] private sellOrders;
    Order[] private buyOrders;

    function getSellOrders() public view returns (Order[] memory) {
        return sellOrders;
    }

    function getBuyOrders() public view returns (Order[] memory) {
        return buyOrders;
    }

    function addOrder(address userAddress, string memory assetCode, uint targetPrice, uint shares, bool isSell) public {
        Order memory order = this.createOrder(userAddress, assetCode, targetPrice, shares, isSell);

        if (isSell) {
            sellOrders.push(order);
        } else {
            buyOrders.push(order);
        }
    }

    function createOrder(address userAddress, string memory assetCode, uint targetPrice, uint shares, bool isSell) public view returns (Order memory) {
        return Order({
            sellerOrBuyerAddress: userAddress,
            assetCode: assetCode,
            targetPricePerShare: targetPrice,
            numberOfShares: shares,
            createdAt: block.timestamp,
            executedAt: 0,
            isSell: isSell,
            executed: false
        });
    }

    function checkTransactionConflict(bool sellerAcceptsToFragment, bool buyerAcceptsToFragment, bool selletHasTheMostQuantity) public pure returns (bool) {
        if (!sellerAcceptsToFragment && selletHasTheMostQuantity) {
            return true;
        }

        if (!buyerAcceptsToFragment && !selletHasTheMostQuantity) {
            return true;
        }

        return false;
    }
}