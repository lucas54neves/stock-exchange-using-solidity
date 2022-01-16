// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Market {
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