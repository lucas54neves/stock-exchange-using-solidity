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
}