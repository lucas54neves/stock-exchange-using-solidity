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

    mapping(string => Order[]) private salesOrdersByAssetCodeMapping;
    uint256 salesOrdersByAssetCounter;

    mapping(string => Order[]) private purchaseOrdersByAssetCodeMapping;
    uint256 purchaseOrdersByAssetCounter;

    mapping(string => Transaction[]) private transactionsByAssetCodeMapping;
    uint256 transactionsByAssetCounter;

    function compareAssets(string memory asset1, string memory asset2)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((asset1))) ==
            keccak256(abi.encodePacked((asset2))));
    }

    function createTransaction(
        uint256 transactionIndex,
        address seller,
        address buyer,
        string memory assetCode,
        uint256 pricePerShare,
        uint256 numberOfShares
    ) public view returns (Transaction memory) {
        return
            Transaction({
                index: transactionIndex,
                seller: seller,
                buyer: buyer,
                assetCode: assetCode,
                pricePerShare: pricePerShare,
                createdAt: block.timestamp, // require view-type function,
                numberOfShares: numberOfShares
            });
    }

    function returnTransactions(string memory assetCode)
        public
        view
        returns (Transaction[] memory)
    {
        return transactionsByAssetCodeMapping[assetCode];
    }

    function returnOrders(bool isSale, string memory assetCode)
        public
        view
        returns (Order[] memory)
    {
        if (isSale) {
            return salesOrdersByAssetCodeMapping[assetCode];
        }

        return purchaseOrdersByAssetCodeMapping[assetCode];
    }

    function addTransaction(
        address seller,
        address buyer,
        string memory assetCode,
        uint256 pricePerShare,
        uint256 numberOfShares
    ) public {
        transactionsByAssetCounter += 1;

        Transaction memory transaction = createTransaction(
            transactionsByAssetCounter,
            seller,
            buyer,
            assetCode,
            pricePerShare,
            numberOfShares
        );

        transactionsByAssetCodeMapping[transaction.assetCode].push(transaction);
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

    function insertOrder(
        address userAddress,
        string memory assetCode,
        uint256 targetPricePerShare,
        uint256 numberOfShares,
        bool isSale,
        bool acceptsFragmenting
    ) public {
        if (isSale) {
            salesOrdersByAssetCounter += 1;

            Order memory order = createOrder(
                salesOrdersByAssetCounter,
                userAddress,
                assetCode,
                targetPricePerShare,
                numberOfShares,
                acceptsFragmenting
            );

            salesOrdersByAssetCodeMapping[assetCode].push(order);
        } else {
            purchaseOrdersByAssetCounter += 1;

            Order memory order = createOrder(
                purchaseOrdersByAssetCounter,
                userAddress,
                assetCode,
                targetPricePerShare,
                numberOfShares,
                acceptsFragmenting
            );

            purchaseOrdersByAssetCodeMapping[assetCode].push(order);
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
            orders = purchaseOrdersByAssetCodeMapping[assetCode];
        } else {
            orders = salesOrdersByAssetCodeMapping[assetCode];
        }

        uint256 size = orders.length;

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
                    transactionsByAssetCounter += 1;

                    createTransaction(
                        transactionsByAssetCounter,
                        userAddress,
                        orders[i].userAddress,
                        assetCode,
                        orders[i].targetPricePerShare,
                        numberOfShares
                    );

                    orders[i].numberOfShares -= numberOfShares;

                    if (orders[i].numberOfShares == 0) {
                        delete orders[i];
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
                    transactionsByAssetCounter += 1;

                    createTransaction(
                        transactionsByAssetCounter,
                        orders[i].userAddress,
                        userAddress,
                        assetCode,
                        orders[i].targetPricePerShare,
                        numberOfShares
                    );

                    orders[i].numberOfShares -= numberOfShares;

                    if (orders[i].numberOfShares == 0) {
                        delete orders[i];
                    }

                    return true;
                }
            }
        }

        insertOrder(
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
