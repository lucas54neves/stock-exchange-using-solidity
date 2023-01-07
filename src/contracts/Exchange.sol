// SPDX-License-Identifier: MIT
// pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

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
        bool isPassive;
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
        uint256 purchasedOrderIndex;
    }

    address payable private owner;

    Order[] private orders;
    Transaction[] private transactions;
    string[] private assets;

    mapping(string => mapping(uint256 => uint256))
        private saleOrdersMappingByAssets;
    mapping(string => mapping(uint256 => uint256))
        private purchasedOrdersMappingByAssets;

    mapping(string => uint256) private numberOfSaleOrdersByAssets;
    mapping(string => uint256) private numberOfPurchasedOrdersByAssets;

    mapping(address => uint256) private balances;
    address[] private addressFromBalances;
    uint256 private numberOfAddress;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "this is not the owner");
        _; // it means run the code.
    }

    event Deposited(address from, uint256 amount);

    function depositMoney() public payable returns (uint256) {
        balances[msg.sender] += msg.value;

        if (!existsAddress(msg.sender)) {
            numberOfAddress += 1;
            addressFromBalances.push(msg.sender);
        }

        emit Deposited(msg.sender, msg.value);

        return balances[msg.sender];
    }

    function withdraw(uint256 amount) private onlyOwner {
        require(balances[msg.sender] >= amount, "Balance not sufficient");

        balances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }

    function getSmartContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function sendMoney(
        address receiver,
        address sender,
        uint256 amount
    ) public returns (bool) {
        require(balances[sender] >= amount, "Balance not sufficient");

        balances[sender] -= amount;

        if (receiver != owner) {
            balances[receiver] += amount;
            payable(receiver).transfer(amount);
        }
    }

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

    function compareStrings(string memory _string1, string memory _string2)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((_string1))) ==
            keccak256(abi.encodePacked((_string2))));
    }

    function createOrder(
        bool isSale,
        address userAddress,
        string memory asset,
        uint256 value,
        uint256 numberOfShares,
        bool acceptsFragmenting,
        bool isPassive
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
                isActive: true,
                isPassive: isPassive
            });
    }

    function createTransaction(
        address seller,
        address buyer,
        string memory asset,
        uint256 value,
        uint256 numberOfShares,
        uint256 saleOrderIndex,
        uint256 purchasedOrderIndex
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
                purchasedOrderIndex: purchasedOrderIndex
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
            if (compareStrings(assets[i], asset)) {
                return true;
            }
        }

        return false;
    }

    function toString(address account) public pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(bytes memory data) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function existsAddress(address _address) public view returns (bool) {
        for (uint256 i = 0; i < addressFromBalances.length; i++) {
            string memory address1 = toString(addressFromBalances[i]);
            string memory address2 = toString(_address);

            if (compareStrings(address1, address2)) {
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
        bool acceptsFragmenting,
        bool isPassive
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
            acceptsFragmenting,
            isPassive
        );

        // Solidity truncates all results
        if (isPassive) {
            sendMoney(owner, userAddress, (value * 1) / 100);
        } else {
            sendMoney(owner, userAddress, (value * 2) / 100);
        }

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

        if (!isPassive) {
            realizeOperationOfCreationOfTransaction(asset, order);
        }

        return order;
    }

    function returnAddressesFromBalances()
        public
        view
        returns (address[] memory)
    {
        return addressFromBalances;
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

    function checkIfOrdersIsCompatible(
        Order memory saleOrder,
        Order memory purchasedOrder
    ) private view returns (bool) {
        return
            saleOrder.isSale &&
            (!purchasedOrder.isSale) &&
            saleOrder.value == purchasedOrder.value &&
            !checkTransactionConflict(
                saleOrder.acceptsFragmenting,
                purchasedOrder.acceptsFragmenting,
                saleOrder.numberOfShares > purchasedOrder.numberOfShares,
                saleOrder.numberOfShares != purchasedOrder.numberOfShares
            ) &&
            returnOrderByOrderIndex(saleOrder.index).isActive &&
            returnOrderByOrderIndex(purchasedOrder.index).isActive;
    }

    function realizeOperationOfCreationOfTransactionInAllAsset(
        string memory asset
    ) public returns (bool) {
        Order[] memory saleOrders = returnSaleOrders(asset);
        Order[] memory purchasedOrders = returnPurchasedOrders(asset);

        for (
            uint256 saleOrderIndex = 0;
            saleOrders.length > saleOrderIndex;
            ++saleOrderIndex
        ) {
            for (
                uint256 purchasedOrderIndex = 0;
                purchasedOrders.length > purchasedOrderIndex;
                ++purchasedOrderIndex
            ) {
                Order memory saleOrder = saleOrders[saleOrderIndex];
                Order memory purchasedOrder = purchasedOrders[
                    purchasedOrderIndex
                ];

                if (checkIfOrdersIsCompatible(saleOrder, purchasedOrder)) {
                    bool saleOrderIsBigger = saleOrder.numberOfShares >
                        purchasedOrder.numberOfShares;
                    bool purchasedOrderIsBigger = purchasedOrder
                        .numberOfShares > saleOrder.numberOfShares;

                    uint256 minimunOfShares = saleOrderIsBigger
                        ? purchasedOrder.numberOfShares
                        : saleOrder.numberOfShares;

                    sendMoney(
                        purchasedOrder.userAddress,
                        saleOrder.userAddress,
                        saleOrder.value
                    );

                    Transaction memory transaction = createTransaction(
                        saleOrder.userAddress,
                        purchasedOrder.userAddress,
                        asset,
                        saleOrder.value,
                        minimunOfShares,
                        saleOrderIndex,
                        purchasedOrderIndex
                    );

                    addTransaction(transaction);

                    if (saleOrderIsBigger) {
                        realizeOperationOfCreationOfOrder(
                            saleOrder.isSale,
                            saleOrder.userAddress,
                            saleOrder.asset,
                            saleOrder.value,
                            saleOrder.numberOfShares - minimunOfShares,
                            saleOrder.acceptsFragmenting,
                            saleOrder.isPassive
                        );
                    }

                    if (purchasedOrderIsBigger) {
                        realizeOperationOfCreationOfOrder(
                            purchasedOrder.isSale,
                            purchasedOrder.userAddress,
                            purchasedOrder.asset,
                            purchasedOrder.value,
                            purchasedOrder.numberOfShares - minimunOfShares,
                            purchasedOrder.acceptsFragmenting,
                            purchasedOrder.isPassive
                        );
                    }

                    uint256 saleOrderPosition = returnPositionOfOrderInArray(
                        saleOrder.index
                    );
                    uint256 purchasedOrderPosition = returnPositionOfOrderInArray(
                            purchasedOrder.index
                        );

                    orders[saleOrderPosition].isActive = false;
                    orders[purchasedOrderPosition].isActive = false;

                    numberOfSaleOrdersByAssets[asset] -= 1;
                    numberOfPurchasedOrdersByAssets[asset] -= 1;
                }
            }
        }
    }

    function realizeOperationOfCreationOfTransaction(
        string memory asset,
        Order memory order
    ) public returns (bool) {
        Order[] memory ordersSalesOrPurchase;

        if (order.isSale) {
            ordersSalesOrPurchase = returnPurchasedOrders(asset);
        } else {
            ordersSalesOrPurchase = returnSaleOrders(asset);
        }

        for (uint256 i = 0; i < ordersSalesOrPurchase.length; i++) {
            Order memory _order = ordersSalesOrPurchase[i];
            Order memory saleOrder;
            Order memory purchasedOrder;

            if (order.isSale) {
                saleOrder = orders[returnPositionOfOrderInArray(order.index)];
                purchasedOrder = orders[
                    returnPositionOfOrderInArray(_order.index)
                ];
            } else {
                saleOrder = orders[returnPositionOfOrderInArray(_order.index)];
                purchasedOrder = orders[
                    returnPositionOfOrderInArray(order.index)
                ];
            }

            if (
                saleOrder.value == purchasedOrder.value &&
                !checkTransactionConflict(
                    saleOrder.acceptsFragmenting,
                    purchasedOrder.acceptsFragmenting,
                    saleOrder.numberOfShares > purchasedOrder.numberOfShares,
                    saleOrder.numberOfShares != purchasedOrder.numberOfShares
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

                sendMoney(
                    purchasedOrder.userAddress,
                    saleOrder.userAddress,
                    saleOrder.value
                );

                addTransaction(transaction);

                if (saleOrder.numberOfShares > purchasedOrder.numberOfShares) {
                    realizeOperationOfCreationOfOrder(
                        saleOrder.isSale,
                        saleOrder.userAddress,
                        saleOrder.asset,
                        saleOrder.value,
                        saleOrder.numberOfShares - minimunOfShares,
                        saleOrder.acceptsFragmenting,
                        saleOrder.isPassive
                    );
                } else if (
                    saleOrder.numberOfShares < purchasedOrder.numberOfShares
                ) {
                    realizeOperationOfCreationOfOrder(
                        purchasedOrder.isSale,
                        purchasedOrder.userAddress,
                        purchasedOrder.asset,
                        purchasedOrder.value,
                        purchasedOrder.numberOfShares - minimunOfShares,
                        purchasedOrder.acceptsFragmenting,
                        purchasedOrder.isPassive
                    );
                }

                uint256 saleOrderPosition = returnPositionOfOrderInArray(
                    saleOrder.index
                );
                uint256 purchasedOrderPosition = returnPositionOfOrderInArray(
                    purchasedOrder.index
                );

                orders[saleOrderPosition].isActive = false;
                orders[purchasedOrderPosition].isActive = false;

                numberOfSaleOrdersByAssets[asset] -= 1;
                numberOfPurchasedOrdersByAssets[asset] -= 1;

                return true;
            }
        }

        return false;
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
