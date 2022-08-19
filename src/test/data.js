const testsData = [
  {
    testName: 'Case 1',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 2',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 3',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 4',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 5',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a sell order with 50 shares will remain.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 6',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a sell order with 50 shares will remain.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 7',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 150,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 8',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 150 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 150,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 9',
    description:
      'Buyer wants to buy 150 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place and a purchased order with 50 shares will remain.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 10',
    description:
      'Buyer wants to buy 150 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split. The transaction will not take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 150,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 11',
    description:
      'Buyer wants to buy 150 shares of asset ABC123 for 78 wei and accepts to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will take place and a purchased order with 50 shares will remain.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 12',
    description:
      'Buyer wants to buy 150 shares of asset ABC123 for 78 wei and does not accept to split. Seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split. The transaction will not take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 150,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 150,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 13',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split. The first seller wants to sell 60 shares of asset ABC123 for 78 wei and accepts to split. The second seller wants to sell 40 shares of asset ABC123 for 78 wei and accepts to split. The transaction will take place.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 14',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and accepts to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. There will be no transaction because the buyer does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 15',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, sellet A wants to sell 60 shares of asset ABC123 for 78 wei and does not agree to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 16',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and agrees to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 17',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and does not agree to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split . There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 18',
    description:
      'Buyer wants to buy 130 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and agrees to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 30,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 19',
    description:
      'Buyer wants to buy 130 shares of asset ABC123 for 78 wei and does not accept to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and accepts to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. There will be no transaction because the buyer does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 130,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 20',
    description:
      'Buyer wants to buy 130 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and does not agree to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 30,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 21',
    description:
      'Buyer wants to buy 130 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and agrees to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 30,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 22',
    description:
      'Buyer wants to buy 130 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and does not agree to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split . There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 30,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 23',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and agrees to split, and seller B wants to sell 50 shares of asset ABC123 for 78 wei and agrees to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 10,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 24',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and accepts to split, and seller B wants to sell 50 shares of asset ABC123 for 78 wei and agrees to split. There will be no transaction because the buyer does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: false,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 100,
          isSale: false,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: 'Case 25',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, seller A wants to sell 60 shares of asset ABC123 for 78 wei and does not agree to split, and seller B wants to sell 50 shares of asset ABC123 for 78 wei and agrees to split. There will be the transaction.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 10,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 26',
    description:
      'Comprador quer comprar 100 ações do ativo ABC123 por 78 wei e aceita fragmentar, um primeiro vendedor quer vender 60 ações do ativo ABC123 por 78 wei e aceita fragmentar e um segundo vendedor quer vender 50 ações do ativo ABC123 por 78 wei e não aceita fragmentar. A transação ocorrerá em partes porque o segundo vendedor não aceita fragmentar.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
      ],
    },
  },
  {
    testName: 'Case 27',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split, a first seller wants to sell 60 shares of asset ABC123 for 78 wei and does not accept to split and a second seller wants to sell 50 shares of asset ABC123 for 78 wei and does not accept to split . The transaction will take place in parts because the second seller does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 60,
        },
      ],
    },
  },
  {
    testName: 'Case 28',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 100 shares of asset ABC123 for 78 wei and agrees to split, and seller B wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 29',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept to split, a first seller wants to sell 100 shares of asset ABC123 for 78 wei and accepts to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and accepts fragment. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 30',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 100 shares of asset ABC123 for 78 wei and does not agree to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 31',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 100 shares of asset ABC123 for 78 wei and agrees to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 32',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split, a first seller wants to sell 100 shares of asset ABC123 for 78 wei and does not accept to split and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and does not accept to split . The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 33',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 140 shares of asset ABC123 for 78 wei and agrees to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 140,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 34',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and does not accept splitting, a first seller wants to sell 140 shares of asset ABC123 for 78 wei and agrees to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 140,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 35',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 140 shares of asset ABC123 for 78 wei and does not agree to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and agrees to split. The transaction will take place in parts because the first seller does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 140,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 140,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
  {
    testName: 'Case 36',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and agrees to split, a first seller wants to sell 140 shares of asset ABC123 for 78 wei and agrees to split, and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and does not agree to split. The transaction will take place in parts because the first seller already sells all the shares the buyer wants.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 140,
        isSale: true,
        acceptsFragmenting: true,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 100,
        },
      ],
    },
  },
  {
    testName: 'Case 37',
    description:
      'Buyer wants to buy 100 shares of asset ABC123 for 78 wei and accepts to split, a first seller wants to sell 140 shares of asset ABC123 for 78 wei and does not accept to split and a second seller wants to sell 40 shares of asset ABC123 for 78 wei and does not accept to split . The transaction will take place in parts because the first seller does not accept fragmentation.',
    asset: 'ABC123',
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
        isPassive: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 140,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
        isPassive: true,
      },
    ],
    shouldCreateTransaction: true,
    finalOrders: {
      purchasedOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: false,
          acceptsFragmenting: true,
          isPassive: true,
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 140,
          isSale: true,
          acceptsFragmenting: false,
          isPassive: true,
        },
      ],
      transactions: [
        {
          value: 78,
          numberOfShares: 40,
        },
      ],
    },
  },
];

module.exports = { testsData };
