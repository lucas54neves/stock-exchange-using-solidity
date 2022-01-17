// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "truffle/Assert.sol";
import "../contracts/Market.sol";

contract TestMarket {
    Market market;

    function beforeEach() public {
        market = new Market();
    }

    function testTransactionConflicts() public {
        Assert.equal(market.checkTransactionConflict(true, true, true), false, "transaction must not conflict");
        Assert.equal(market.checkTransactionConflict(true, true, false), false, "transaction must not conflict");
        Assert.equal(market.checkTransactionConflict(false, true, false), false, "transaction must not conflict");
        Assert.equal(market.checkTransactionConflict(true, false, true), false, "transaction must not conflict");
        Assert.equal(market.checkTransactionConflict(false, true, true), true, "seller does not accept to fragment and seller is the side with the most quantity");
        Assert.equal(market.checkTransactionConflict(false, false, true), true, "seller and buyer do not accept to fragment and seller is the side with the most quantity");
        Assert.equal(market.checkTransactionConflict(false, false, false), true, "seller and buyer do not accept to fragment and buyer is the side with the most quantity");
        Assert.equal(market.checkTransactionConflict(true, false, false), true, "buyer does not accept to fragment and buyer is the side with the most quantity");
    }

    function testOrderAddition() public {
        market.addOrder(msg.sender, "TEST123", 34, 3, true);
        market.addOrder(msg.sender, "TEST123", 38, 1, true);
        market.addOrder(msg.sender, "TEST125", 57, 3, true);
        market.addOrder(msg.sender, "TEST125", 59, 2, false);
        market.addOrder(msg.sender, "TEST123", 43, 30, false);
        market.addOrder(msg.sender, "TEST126", 56, 7, false);
        market.addOrder(msg.sender, "TEST128", 32, 14, false);

        Assert.equal(market.getSellOrders().length, 3, "sell orders not added correctly");
        Assert.equal(market.getBuyOrders().length, 4, "buy orders not added correctly");
    }

    function testOrderCreation() public {
        Market.Order memory order = market.createOrder(msg.sender, "ABC321", 58, 7, false);

        Assert.equal(order.sellerOrBuyerAddress, msg.sender, "seller's or buyer's address not entered correctly");
        Assert.equal(order.assetCode, "ABC321", "asset code is incorrect");
        Assert.equal(order.targetPricePerShare, 58, "target price per share is incorrect");
        Assert.equal(order.numberOfShares, 7, "number of shares is incorrect");
        Assert.equal(order.isSell, false, "boolean that informs the order type is incorrect");
    }
}