// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Market {
    struct Order {
        address createdBy;
        uint createdAt;
        string assetCode;
        uint targetPricePerShare;
        uint numberOfShares;
        bool acceptsFragmenting;
    }

    struct Transaction {
        address seller;
        address buyer;
        uint createdAt;
        uint sellTime;
        uint buyTime;
        string assetCode;
        uint pricePerShare;
        uint numberOfShares;
    }

    Order[] private sellOrders;
    Order[] private buyOrders;
    Transaction[] private transactions;
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function createOrder(address userAddress, string memory assetCode, uint targetPricePerShare, uint numberOfShares, bool acceptsFragmenting) public view returns (Order memory) {
        return Order({
            sellerOrBuyerAddress: userAddress,
            assetCode: assetCode,
            targetPricePerShare: targetPricePerShare,
            numberOfShares: numberOfShares,
            createdAt: block.timestamp,
            acceptsFragmenting: acceptsFragmenting
        });
    }

    function createTransaction(address seller, address buyer, uint createdAt, uint sellTime, uint buyTime, string assetCode, uint pricePerShare, uint numberOfShares) {
        return Transaction({
            seller: seller,
            buyer: buyer,
            createdAt: createdAt,
            sellTime: sellTime,
            buyTime: buyTime,
            assetCode: assetCode,
            pricePerShare: priceOfShares,
            numberOfShares: numberOfShares
        });
    }

    function addOrder(address userAddress, string memory assetCode, uint targetPricePerShare, uint numberOfShares, bool isSell, bool acceptsFragmenting) public {
        Order memory order = createOrder(userAddress, assetCode, targetPricePerShare, numberOfShares, acceptsFragmenting);

        if (isSell) {
            addSellOrder(order);
        } else {
            addBuyOrder(buyer);
        }
    }

    // Todo: insert orderly
    function addSellOrder(Order order) {
        sellOrders.push(order);
    }

    // Todo: insert orderly
    function addBuyOrder(Order order) {
        buyOrders.push(order);
    }

    function getSellOrders() public view returns (Order[] memory) {
        return sellOrders;
    }

    function getBuyOrders() public view returns (Order[] memory) {
        return buyOrders;
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function getSellOrder(string assetCode, uint pricePerShare) {
        for (uint i = 0; i < getSellOrders().length; i++) {
            Order memory sellOrder = getSellOrders()[i];

            if (compareStrings(sellOrder.assetCode, assetCode)) {
                if (sellOrder.targetPricePerShare <= pricePerShare) {
                    return sellOrder;
                }
            }
        }
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

    function
}