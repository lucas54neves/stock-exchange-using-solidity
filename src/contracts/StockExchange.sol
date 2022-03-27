// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract StockExchange {
    struct Order {
        uint256 index;
        address userAddress;
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
        string assetCode;
        uint256 createdAt;
        uint256 pricePerShare;
        uint256 numberOfShares;
    }

    Order[] private salesOrdersArray;
    mapping(uint256 => Order) private salesOrdersMapping;

    Order[] private purchaseOrdersArray;
    mapping(uint256 => Order) private purchaseOrdersMapping;

    Transaction[] private transactionsArray;
    mapping(uint256 => Transaction) private transactionsMapping;

    function compareAssets(string memory asset1, string memory asset2)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((asset1))) ==
            keccak256(abi.encodePacked((asset2))));
    }

    function createTransaction(
        address seller,
        address buyer,
        string memory assetCode,
        uint256 pricePerShare,
        uint256 numberOfShares
    ) public view returns (Transaction memory) {
        return
            Transaction({
                index: transactionsArray.length + 1,
                seller: seller,
                buyer: buyer,
                assetCode: assetCode,
                pricePerShare: pricePerShare,
                createdAt: block.timestamp, // require view-type function,
                numberOfShares: numberOfShares
            });
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
                userAddress: userAddress,
                assetCode: assetCode,
                targetPricePerShare: targetPricePerShare,
                numberOfShares: numberOfShares,
                createdAt: block.timestamp, // require view-type function
                acceptsFragmenting: acceptsFragmenting
            });
    }

    function addSaleOrder(Order memory order) public {
        salesOrdersArray.push(order);
        salesOrdersMapping[order.index] = order;
    }

    function addPurchaseOrder(Order memory order) public {
        purchaseOrdersArray.push(order);
        purchaseOrdersMapping[order.index] = order;
    }

    function addTransaction(Transaction memory transaction) public {
        transactionsArray.push(transaction);
        transactionsMapping[transaction.index] = transaction;
    }

    function insertOrder(
        Order[] memory orders,
        address userAddress,
        string memory assetCode,
        uint256 targetPricePerShare,
        uint256 numberOfShares,
        bool isSale,
        bool acceptsFragmenting
    ) public {
        Order memory order = createOrder(
            numberOfOrders(orders) + 1,
            userAddress,
            assetCode,
            targetPricePerShare,
            numberOfShares,
            acceptsFragmenting
        );

        if (isSale) {
            addSaleOrder(order);
        } else {
            addPurchaseOrder(order);
        }
    }

    function numberOfOrders(Order[] memory orders)
        public
        pure
        returns (uint256)
    {
        return orders.length;
    }

    function addOrder(
        address userAddress,
        string memory assetCode,
        uint256 targetPricePerShare,
        uint256 numberOfShares,
        bool isSale,
        bool acceptsFragmenting
    ) public returns (bool) {
        Order[] storage orders;

        if (isSale) {
            orders = purchaseOrdersArray;
        } else {
            orders = salesOrdersArray;
        }

        uint256 size = numberOfOrders(orders);

        if (size > 0) {
            for (uint256 i = 0; i < size; i++) {
                if (
                    isSale &&
                    compareAssets(orders[i].assetCode, assetCode) &&
                    orders[i].targetPricePerShare >= targetPricePerShare &&
                    !checkTransactionConflict(
                        acceptsFragmenting,
                        orders[i].acceptsFragmenting,
                        numberOfShares >= orders[i].numberOfShares
                    )
                ) {
                    createTransaction(
                        userAddress,
                        orders[i].userAddress,
                        assetCode,
                        orders[i].targetPricePerShare,
                        numberOfShares
                    );

                    purchaseOrdersMapping[orders[i].index]
                        .numberOfShares -= numberOfShares;

                    if (
                        purchaseOrdersMapping[orders[i].index].numberOfShares ==
                        0
                    ) {
                        delete orders[i];
                        delete purchaseOrdersMapping[orders[i].index];
                    }

                    return true;
                }

                if (
                    !isSale &&
                    compareAssets(orders[i].assetCode, assetCode) &&
                    orders[i].targetPricePerShare <= targetPricePerShare &&
                    !checkTransactionConflict(
                        orders[i].acceptsFragmenting,
                        acceptsFragmenting,
                        numberOfShares >= orders[i].numberOfShares
                    )
                ) {
                    createTransaction(
                        orders[i].userAddress,
                        userAddress,
                        assetCode,
                        orders[i].targetPricePerShare,
                        numberOfShares
                    );

                    salesOrdersMapping[orders[i].index]
                        .numberOfShares -= numberOfShares;

                    if (
                        salesOrdersMapping[orders[i].index].numberOfShares == 0
                    ) {
                        delete orders[i];
                        delete salesOrdersMapping[orders[i].index];
                    }

                    return true;
                }
            }
        }

        insertOrder(
            orders,
            userAddress,
            assetCode,
            targetPricePerShare,
            numberOfShares,
            isSale,
            acceptsFragmenting
        );

        return true;
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
