// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Market {
    struct Order {
        uint256 index;
        address createdBy;
        uint256 createdAt;
        string assetCode;
        uint256 targetPricePerShare;
        uint256 numberOfShares;
        bool acceptsFragmenting;
    }

    struct Transaction {
        uint256 index;
        address seller;
        address buyer;
        uint256 sellOrderIndex;
        uint256 buyOrderIndex;
        string assetCode;
        uint256 createdAt;
        uint256 pricePerShare;
        uint256 numberOfShares;
    }

    struct GetOrdersReturn {
        uint256 size;
        mapping(uint256 => Order) orders;
    }

    Order[] private sellOrders;
    Order[] private buyOrders;
    Transaction[] private transactions;

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function createOrder(
        uint256 orderIndex,
        address userAddress,
        string memory assetCode,
        uint256 targetPricePerShare,
        uint256 numberOfShares,
        bool acceptsFragmenting
    ) public view returns (Order memory) {
        return
            Order({
                index: orderIndex,
                createdBy: userAddress,
                assetCode: assetCode,
                targetPricePerShare: targetPricePerShare,
                numberOfShares: numberOfShares,
                createdAt: block.timestamp, // require view-type function
                acceptsFragmenting: acceptsFragmenting
            });
    }

    function createTransaction(
        address seller,
        address buyer,
        uint256 createdAt,
        uint256 sellOrderIndex,
        uint256 buyOrderIndex,
        string memory assetCode,
        uint256 pricePerShare,
        uint256 numberOfShares
    ) public view returns (Transaction memory) {
        return
            Transaction({
                index: transactions.length + 1,
                seller: seller,
                buyer: buyer,
                sellOrderIndex: sellOrderIndex,
                buyOrderIndex: buyOrderIndex,
                assetCode: assetCode,
                pricePerShare: pricePerShare,
                createdAt: createdAt,
                numberOfShares: numberOfShares
            });
    }

    function addOrder(
        address userAddress,
        string memory assetCode,
        uint256 targetPricePerShare,
        uint256 numberOfShares,
        bool isSell,
        bool acceptsFragmenting
    ) public {
        uint256 orderIndex;

        if (isSell) {
            orderIndex = sellOrders.length + 1;
        } else {
            orderIndex = buyOrders.length + 1;
        }

        Order memory order = createOrder(
            orderIndex,
            userAddress,
            assetCode,
            targetPricePerShare,
            numberOfShares,
            acceptsFragmenting
        );

        if (isSell) {
            addSellOrder(order);
        } else {
            addBuyOrder(order);
        }
    }

    // Todo: insert orderly
    function addSellOrder(Order memory order) public {
        sellOrders.push(order);
    }

    // Todo: insert orderly
    function addBuyOrder(Order memory order) public {
        buyOrders.push(order);
    }

    function readSellOrders() public view returns (Order[] memory) {
        return sellOrders;
    }

    function readBuyOrders() public view returns (Order[] memory) {
        return buyOrders;
    }

    function readTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function readOrdersFromUser(address userAddress, bool isSellOrder)
        public
        view
        returns (Order[] memory)
    {
        Order[] memory orders;

        if (isSellOrder) {
            for (uint256 i = 0; i <= sellOrders.length; i++) {
                if (sellOrders[i].createdBy == userAddress) {
                    orders[i] = sellOrders[i];
                }
            }
        } else {
            for (uint256 i = 0; i <= buyOrders.length; i++) {
                if (buyOrders[i].createdBy == userAddress) {
                    orders[i] = buyOrders[i];
                }
            }
        }

        return orders;
    }

    function readTransactionsFromUser(address userAddress)
        public
        view
        returns (Transaction[] memory)
    {
        Transaction[] memory transactionsFromUser;

        for (uint256 i = 0; i <= transactions.length; i++) {
            if (
                transactions[i].seller == userAddress ||
                transactions[i].buyer == userAddress
            ) {
                transactionsFromUser[i] = transactions[i];
            }
        }

        return transactionsFromUser;
    }

    function updateOrder(
        address userAddress,
        bool isSellOrder,
        uint256 orderIndex,
        uint256 newNumberOfShare,
        uint256 newTargetPricePerShare
    ) public view returns (Order memory) {
        Order[] memory orders = readOrdersFromUser(userAddress, isSellOrder);

        assert(orders.length > 0);

        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].index == orderIndex) {
                orders[i].numberOfShares = newNumberOfShare;
                orders[i].targetPricePerShare = newTargetPricePerShare;

                return orders[i];
            }
        }

        revert("Order not found.");
    }

    function checkTransactionConflict(
        bool sellerAcceptsToFragment,
        bool buyerAcceptsToFragment,
        bool sellerHasTheMostQuantity
    ) public pure returns (bool) {
        if (!sellerAcceptsToFragment && sellerHasTheMostQuantity) {
            return true;
        }

        if (!buyerAcceptsToFragment && !sellerHasTheMostQuantity) {
            return true;
        }

        return false;
    }
}
