const testsData = [
  {
    testName: "Case 14",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
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
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: "Case 15",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
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
    testName: "Case 16",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
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
    testName: "Case 17",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
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
    testName: "Case 18",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
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
    testName: "Case 19",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: false,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
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
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
        },
        {
          value: 78,
          numberOfShares: 40,
          isSale: true,
          acceptsFragmenting: true,
        },
      ],
      transactions: [],
    },
  },
  {
    testName: "Case 20",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: true,
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
    testName: "Case 21",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
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
    testName: "Case 22",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 130,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: false,
      },
      {
        value: 78,
        numberOfShares: 40,
        isSale: true,
        acceptsFragmenting: false,
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
    testName: "Case 23",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: true,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: true,
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
    testName: "Case 24",
    asset: "ABC123",
    buyers: [
      {
        value: 78,
        numberOfShares: 100,
        isSale: false,
        acceptsFragmenting: false,
      },
    ],
    sellers: [
      {
        value: 78,
        numberOfShares: 60,
        isSale: true,
        acceptsFragmenting: true,
      },
      {
        value: 78,
        numberOfShares: 50,
        isSale: true,
        acceptsFragmenting: true,
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
        },
      ],
      saleOrders: [
        {
          value: 78,
          numberOfShares: 60,
          isSale: true,
          acceptsFragmenting: true,
        },
        {
          value: 78,
          numberOfShares: 50,
          isSale: true,
          acceptsFragmenting: true,
        },
      ],
      transactions: [],
    },
  },
];

module.exports = { testsData };
