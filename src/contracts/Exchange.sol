// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Exchange {
    struct Order {
        uint256 index;
        bool isSale;
        address userAddress;
        uint256 createdAt;
        string asset;
        uint256 value;
        uint256 numberOfShares;
        bool acceptsFragmenting;
        bool isActive;
    }

    struct Transaction {
        uint256 index;
        address seller;
        address buyer;
        string asset;
        uint256 createdAt;
        uint256 value;
        uint256 numberOfShares;
        uint256 saleOrderIndex;
        uint256 purchaseOrderIndex;
    }

    Order[] private orders;
    Transaction[] private transactions;
    string[] private assets;

    mapping(string => mapping(uint256 => uint256))
        private saleOrdersMappingByAssets;
    mapping(string => mapping(uint256 => uint256))
        private purchasedOrdersMappingByAssets;

    mapping(string => uint256) private numberOfSaleOrdersByAssets;
    mapping(string => uint256) private numberOfPurchasedOrdersByAssets;

    function returnOrderByOrderIndex(uint256 orderIndex)
        private
        view
        returns (Order memory)
    {
        return orders[orderIndex - 1];
    }

    function returnPositionOfOrderInArray(uint256 orderIndex)
        public
        pure
        returns (uint256)
    {
        return orderIndex - 1;
    }

    function compareAssets(string memory asset1, string memory asset2)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((asset1))) ==
            keccak256(abi.encodePacked((asset2))));
    }

    function createOrder(
        bool isSale,
        address userAddress,
        string memory asset,
        uint256 value,
        uint256 numberOfShares,
        bool acceptsFragmenting
    ) public view returns (Order memory) {
        return
            Order({
                index: orders.length + 1,
                isSale: isSale,
                userAddress: userAddress,
                asset: asset,
                value: value,
                numberOfShares: numberOfShares,
                createdAt: block.timestamp, // require view-type function
                acceptsFragmenting: acceptsFragmenting,
                isActive: true
            });
    }

    function createTransaction(
        address seller,
        address buyer,
        string memory asset,
        uint256 value,
        uint256 numberOfShares,
        uint256 saleOrderIndex,
        uint256 purchaseOrderIndex
    ) public view returns (Transaction memory) {
        return
            Transaction({
                index: transactions.length + 1,
                seller: seller,
                buyer: buyer,
                asset: asset,
                value: value,
                createdAt: block.timestamp, // require view-type function,
                numberOfShares: numberOfShares,
                saleOrderIndex: saleOrderIndex,
                purchaseOrderIndex: purchaseOrderIndex
            });
    }

    function addOrder(Order memory order) public {
        orders.push(order);
    }

    function addTransaction(Transaction memory transaction) public {
        transactions.push(transaction);
    }

    function addAsset(string memory asset) public {
        assets.push(asset);
        numberOfSaleOrdersByAssets[asset] = 0;
        numberOfPurchasedOrdersByAssets[asset] = 0;
    }

    function returnOrders() public view returns (Order[] memory) {
        return orders;
    }

    function returnTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function returnAssets() public view returns (string[] memory) {
        return assets;
    }

    function existsAsset(string memory asset) public view returns (bool) {
        for (uint256 i = 0; i < assets.length; i++) {
            if (compareAssets(assets[i], asset)) {
                return true;
            }
        }

        return false;
    }

    function checkTransactionConflict(
        bool sellerAcceptsToFragment,
        bool buyerAcceptsToFragment,
        bool sellerHasTheMostQuantity,
        bool numberOfSharesIsDifferent
    ) public pure returns (bool) {
        if (
            !sellerAcceptsToFragment &&
            sellerHasTheMostQuantity &&
            numberOfSharesIsDifferent
        ) {
            return true;
        }

        if (
            !buyerAcceptsToFragment &&
            !sellerHasTheMostQuantity &&
            numberOfSharesIsDifferent
        ) {
            return true;
        }

        return false;
    }

    function isEmpty(bool isSale, string memory asset)
        public
        view
        returns (bool)
    {
        if (isSale) {
            return numberOfSaleOrdersByAssets[asset] == 0;
        }

        return numberOfPurchasedOrdersByAssets[asset] == 0;
    }

    function realizeOperationOfCreationOfOrder(
        bool isSale,
        address userAddress,
        string memory asset,
        uint256 value,
        uint256 numberOfShares,
        bool acceptsFragmenting
    ) public returns (Order memory) {
        if (!existsAsset(asset)) {
            addAsset(asset);
        }

        uint256 orderIndex = orders.length + 1;

        Order memory order = createOrder(
            isSale,
            userAddress,
            asset,
            value,
            numberOfShares,
            acceptsFragmenting
        );

        addOrder(order);

        // Empty list
        if (isEmpty(isSale, asset)) {
            if (isSale) {
                saleOrdersMappingByAssets[asset][0] = orderIndex;
                saleOrdersMappingByAssets[asset][orderIndex] = 0;

                numberOfSaleOrdersByAssets[asset] += 1;
            } else {
                purchasedOrdersMappingByAssets[asset][0] = orderIndex;
                purchasedOrdersMappingByAssets[asset][orderIndex] = 0;

                numberOfPurchasedOrdersByAssets[asset] += 1;
            }

            return order;
        }

        uint256 firstNode;

        if (isSale) {
            firstNode = saleOrdersMappingByAssets[asset][0];
        } else {
            firstNode = purchasedOrdersMappingByAssets[asset][0];
        }

        // Add in first position
        if (isSale) {
            if (value < orders[firstNode - 1].value) {
                saleOrdersMappingByAssets[asset][0] = orderIndex;
                saleOrdersMappingByAssets[asset][orderIndex] = firstNode;

                numberOfSaleOrdersByAssets[asset] += 1;

                return order;
            }
        } else {
            if (value > orders[firstNode - 1].value) {
                purchasedOrdersMappingByAssets[asset][0] = orderIndex;
                purchasedOrdersMappingByAssets[asset][orderIndex] = firstNode;

                numberOfPurchasedOrdersByAssets[asset] += 1;

                return order;
            }
        }

        // Add in any position
        uint256 _order = firstNode;
        uint256 previousOrder = 0;

        while (_order > 0) {
            if (isSale) {
                if (value < orders[_order - 1].value) {
                    saleOrdersMappingByAssets[asset][
                        previousOrder
                    ] = orderIndex;
                    saleOrdersMappingByAssets[asset][orderIndex] = _order;

                    numberOfSaleOrdersByAssets[asset] += 1;

                    return order;
                }
            } else {
                if (value > orders[_order - 1].value) {
                    purchasedOrdersMappingByAssets[asset][
                        previousOrder
                    ] = orderIndex;
                    purchasedOrdersMappingByAssets[asset][orderIndex] = _order;

                    numberOfPurchasedOrdersByAssets[asset] += 1;

                    return order;
                }
            }

            previousOrder = _order;

            if (isSale) {
                _order = saleOrdersMappingByAssets[asset][_order];
            } else {
                _order = purchasedOrdersMappingByAssets[asset][_order];
            }
        }

        // Add in last position
        if (isSale) {
            saleOrdersMappingByAssets[asset][previousOrder] = orderIndex;
            saleOrdersMappingByAssets[asset][orderIndex] = 0;

            numberOfSaleOrdersByAssets[asset] += 1;
        } else {
            purchasedOrdersMappingByAssets[asset][previousOrder] = orderIndex;
            purchasedOrdersMappingByAssets[asset][orderIndex] = 0;

            numberOfPurchasedOrdersByAssets[asset] += 1;
        }

        return order;
    }

    function returnSaleOrders(string memory asset)
        public
        view
        returns (Order[] memory)
    {
        Order[] memory _orders = new Order[](numberOfSaleOrdersByAssets[asset]);
        uint256 orderIndex = saleOrdersMappingByAssets[asset][0];
        uint256 i = 0;

        while (orderIndex > 0) {
            if (returnOrderByOrderIndex(orderIndex).isActive) {
                _orders[i] = returnOrderByOrderIndex(orderIndex);

                i += 1;
            }

            orderIndex = saleOrdersMappingByAssets[asset][orderIndex];
        }

        return _orders;
    }

    function returnPurchasedOrders(string memory asset)
        public
        view
        returns (Order[] memory)
    {
        Order[] memory _orders = new Order[](
            numberOfPurchasedOrdersByAssets[asset]
        );
        uint256 orderIndex = purchasedOrdersMappingByAssets[asset][0];
        uint256 i = 0;

        while (orderIndex > 0) {
            if (returnOrderByOrderIndex(orderIndex).isActive) {
                _orders[i] = returnOrderByOrderIndex(orderIndex);

                i += 1;
            }

            orderIndex = purchasedOrdersMappingByAssets[asset][orderIndex];
        }

        return _orders;
    }

    function realizeOperationOfCreationOfTransaction() public {
        for (uint256 i = 0; i < assets.length; i++) {
            string memory asset = assets[i];

            Order[] memory saleOrders = returnSaleOrders(asset);
            Order[] memory purchasedOrders = returnPurchasedOrders(asset);

            uint256 numberOfSaleOrders = saleOrders.length;
            uint256 numberOfPurchasedOrders = purchasedOrders.length;

            uint256 j = 0;

            while (j < numberOfSaleOrders) {
                uint256 h = 0;

                while (h < numberOfPurchasedOrders) {
                    Order memory saleOrder = saleOrders[j];
                    Order memory purchasedOrder = purchasedOrders[h];

                    if (
                        saleOrder.value == purchasedOrder.value &&
                        !checkTransactionConflict(
                            saleOrder.acceptsFragmenting,
                            purchasedOrder.acceptsFragmenting,
                            saleOrder.numberOfShares >
                                purchasedOrder.numberOfShares,
                            saleOrder.numberOfShares !=
                                purchasedOrder.numberOfShares
                        ) &&
                        returnOrderByOrderIndex(saleOrder.index).isActive &&
                        returnOrderByOrderIndex(purchasedOrder.index).isActive
                    ) {
                        uint256 minimunOfShares = saleOrder.numberOfShares >
                            purchasedOrder.numberOfShares
                            ? purchasedOrder.numberOfShares
                            : saleOrder.numberOfShares;

                        Transaction memory transaction = createTransaction(
                            saleOrder.userAddress,
                            purchasedOrder.userAddress,
                            asset,
                            saleOrder.value,
                            minimunOfShares,
                            saleOrder.index,
                            purchasedOrder.index
                        );

                        addTransaction(transaction);

                        if (
                            saleOrder.numberOfShares >
                            purchasedOrder.numberOfShares
                        ) {
                            Order
                                memory order = realizeOperationOfCreationOfOrder(
                                    saleOrder.isSale,
                                    saleOrder.userAddress,
                                    saleOrder.asset,
                                    saleOrder.value,
                                    saleOrder.numberOfShares - minimunOfShares,
                                    saleOrder.acceptsFragmenting
                                );

                            saleOrders[j] = order;
                            // numberOfSaleOrders++;
                        } else if (
                            purchasedOrder.numberOfShares >
                            saleOrder.numberOfShares
                        ) {
                            Order
                                memory order = realizeOperationOfCreationOfOrder(
                                    purchasedOrder.isSale,
                                    purchasedOrder.userAddress,
                                    purchasedOrder.asset,
                                    purchasedOrder.value,
                                    purchasedOrder.numberOfShares -
                                        minimunOfShares,
                                    purchasedOrder.acceptsFragmenting
                                );

                            purchasedOrders[h] = order;
                            // numberOfPurchasedOrders++;
                        }

                        orders[returnPositionOfOrderInArray(saleOrder.index)]
                            .isActive = false;
                        orders[
                            returnPositionOfOrderInArray(purchasedOrder.index)
                        ].isActive = false;

                        numberOfSaleOrdersByAssets[saleOrder.asset] -= 1;
                        numberOfPurchasedOrdersByAssets[
                            purchasedOrder.asset
                        ] -= 1;

                        h = numberOfPurchasedOrders;
                    }

                    h++;
                }

                j++;
            }
        }
    }

    function returnNumberOfPurchasedOrdersByAssets(string memory asset)
        public
        view
        returns (uint256)
    {
        return numberOfPurchasedOrdersByAssets[asset];
    }

    function returnNumberOfSaleOrdersByAssets(string memory asset)
        public
        view
        returns (uint256)
    {
        return numberOfSaleOrdersByAssets[asset];
    }
}
