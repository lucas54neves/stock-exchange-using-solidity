# broker-in-the-chain

Broker contract using Solidity from Ethereum

## Main commands

All commands must be run in the src directory.

### Automated tests

```
truffle test
```

## Test Cases

### Case 1

Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split, seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split.

-   There will be transaction.
-   The buyer will buy 100 shares. Therefore, the purchase order must be removed. Shares must be traded for 78 wei.
-   The seller will sell 100 shares. Therefore, the sales order must be removed. Shares must be traded for 78 wei.

### Case 2

Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept splitting, seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts splitting.

-   There will be transaction.
-   The buyer will buy 100 shares. Therefore, the purchase order must be removed. Shares must be traded for 78 wei.
-   The seller will sell 100 shares. Therefore, the sales order must be removed. Shares must be traded for 78 wei.
