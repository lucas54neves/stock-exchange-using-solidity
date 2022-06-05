// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Exchange {
    struct Order {
        uint256 index;
        bool isSale;
        address userAddress;
        uint256 createdAt;
        string assetCode;
        uint256 value;
        uint256 numberOfShares;
        bool acceptsFragmenting;
    }

    struct Transaction {
        uint256 index;
        address seller;
        address buyer;
        string assetCode;
        uint256 createdAt;
        uint256 value;
        uint256 numberOfShares;
        uint256 saleOrderIndex;
        uint256 purchaseOrderIndex;
    }

    Order[] private orders;
    Transaction[] private transactions;

    mapping(uint256 => uint256) private saleOrdersMapping;
    mapping(uint256 => uint256) private purchasedOrdersMapping;

    uint256 private numberOfSaleOrders;
    uint256 private numberOfPurchasedOrders;

    constructor() {
        saleOrdersMapping[0] = 0;
        purchasedOrdersMapping[0] = 0;

        numberOfSaleOrders = 0;
        numberOfPurchasedOrders = 0;
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
        uint256 orderIndex,
        bool isSale,
        address userAddress,
        string memory assetCode,
        uint256 value,
        uint256 numberOfShares,
        bool acceptsFragmenting
    ) public view returns (Order memory) {
        return
            Order({
                index: orderIndex,
                isSale: isSale,
                userAddress: userAddress,
                assetCode: assetCode,
                value: value,
                numberOfShares: numberOfShares,
                createdAt: block.timestamp, // require view-type function
                acceptsFragmenting: acceptsFragmenting
            });
    }

    function createTransaction(
        uint256 transactionIndex,
        address seller,
        address buyer,
        string memory assetCode,
        uint256 value,
        uint256 numberOfShares,
        uint256 saleOrderIndex,
        uint256 purchaseOrderIndex
    ) public view returns (Transaction memory) {
        return
            Transaction({
                index: transactionIndex,
                seller: seller,
                buyer: buyer,
                assetCode: assetCode,
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

    function returnOrders() public view returns (Order[] memory) {
        return orders;
    }

    function returnTransactions() public view returns (Transaction[] memory) {
        return transactions;
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

    function isEmpty(bool isSale) public view returns (bool) {
        if (isSale) {
            return saleOrdersMapping[0] == 0;
        }

        return purchasedOrdersMapping[0] == 0;
    }

    function realizeOperationOfCreationOfOrder(
        bool isSale,
        address userAddress,
        string memory assetCode,
        uint256 value,
        uint256 numberOfShares,
        bool acceptsFragmenting
    ) public returns (bool) {
        uint256 orderIndex = orders.length + 1;

        Order memory order = createOrder(
            orderIndex,
            isSale,
            userAddress,
            assetCode,
            value,
            numberOfShares,
            acceptsFragmenting
        );

        addOrder(order);

        // Empty list
        if (isEmpty(isSale)) {
            if (isSale) {
                saleOrdersMapping[0] = orderIndex;
                saleOrdersMapping[orderIndex] = 0;
                numberOfSaleOrders += 1;
            } else {
                purchasedOrdersMapping[0] = orderIndex;
                purchasedOrdersMapping[orderIndex] = 0;
                numberOfPurchasedOrders += 1;
            }

            return true;
        }

        uint256 firstNode;

        if (isSale) {
            firstNode = saleOrdersMapping[0];
        } else {
            firstNode = purchasedOrdersMapping[0];
        }

        // Add in first position
        if (isSale) {
            if (value < orders[firstNode - 1].value) {
                saleOrdersMapping[0] = orderIndex;
                saleOrdersMapping[orderIndex] = firstNode;

                numberOfSaleOrders += 1;

                return true;
            }
        } else {
            if (value > orders[firstNode - 1].value) {
                purchasedOrdersMapping[0] = orderIndex;
                purchasedOrdersMapping[orderIndex] = firstNode;

                numberOfPurchasedOrders += 1;

                return true;
            }
        }

        // Add in any position
        uint256 _order = firstNode;
        uint256 previousOrder = 0;

        while (_order > 0) {
            if (isSale) {
                if (value < orders[_order - 1].value) {
                    saleOrdersMapping[previousOrder] = orderIndex;
                    saleOrdersMapping[orderIndex] = _order;

                    numberOfSaleOrders += 1;

                    return true;
                }
            } else {
                if (value > orders[_order - 1].value) {
                    purchasedOrdersMapping[previousOrder] = orderIndex;
                    purchasedOrdersMapping[orderIndex] = _order;

                    numberOfPurchasedOrders += 1;

                    return true;
                }
            }

            previousOrder = _order;

            if (isSale) {
                _order = saleOrdersMapping[_order];
            } else {
                _order = purchasedOrdersMapping[_order];
            }
        }

        // Add in last position
        if (isSale) {
            saleOrdersMapping[previousOrder] = orderIndex;
            saleOrdersMapping[orderIndex] = 0;

            numberOfSaleOrders += 1;
        } else {
            purchasedOrdersMapping[previousOrder] = orderIndex;
            purchasedOrdersMapping[orderIndex] = 0;

            numberOfPurchasedOrders += 1;
        }

        return true;
    }

    function returnSaleOrders() public view returns (Order[] memory) {
        Order[] memory _orders = new Order[](numberOfSaleOrders);
        uint256 orderIndex = saleOrdersMapping[0];
        uint256 i = 0;

        while (orderIndex > 0) {
            _orders[i] = orders[orderIndex - 1];

            orderIndex = saleOrdersMapping[orderIndex];

            i += 1;
        }

        return _orders;
    }

    function returnPurchasedOrders() public view returns (Order[] memory) {
        Order[] memory _orders = new Order[](numberOfPurchasedOrders);
        uint256 orderIndex = purchasedOrdersMapping[0];
        uint256 i = 0;

        while (orderIndex > 0) {
            _orders[i] = orders[orderIndex - 1];

            orderIndex = purchasedOrdersMapping[orderIndex];

            i += 1;
        }

        return _orders;
    }
}
