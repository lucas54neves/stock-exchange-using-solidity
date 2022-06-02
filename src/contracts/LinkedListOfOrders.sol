// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract LinkedListOfOrders {
    struct Node {
        int256 nodeIndex;
        int256 orderIndex;
        int256 orderValue;
    }

    mapping(int256 => int256) private nextNodes;
    mapping(int256 => int256) private previousNodes;

    mapping(int256 => Node) private nodes;

    int256 numberOfNodes;

    constructor() {
        nextNodes[-1] = -1;
        previousNodes[-1] = -1;
        numberOfNodes = 0;
    }

    function isEmpty() private view returns (bool) {
        return numberOfNodes == 0;
    }

    function addOrder(int256 orderIndex, int256 orderValue)
        public
        returns (bool)
    {
        Node memory node;
        int256 nodeIndex = numberOfNodes + 1;

        // Empty list
        if (isEmpty()) {
            nextNodes[-1] = nodeIndex;
            nextNodes[nodeIndex] = -1;

            previousNodes[nodeIndex] = -1;
            previousNodes[-1] = nodeIndex;

            node = Node(nodeIndex, orderIndex, orderValue);

            nodes[nodeIndex] = node;

            numberOfNodes += 1;

            return true;
        }

        int256 firstNode = nextNodes[-1];
        int256 lastNode = previousNodes[-1];

        // Add in first position
        if (orderValue < nodes[firstNode].orderValue) {
            nextNodes[-1] = nodeIndex;
            nextNodes[nodeIndex] = firstNode;

            previousNodes[firstNode] = nodeIndex;
            previousNodes[nodeIndex] = -1;

            node = Node(nodeIndex, orderIndex, orderValue);

            nodes[nodeIndex] = node;

            numberOfNodes += 1;

            return true;
        }

        // Add in last position
        if (orderValue > nodes[lastNode].orderValue) {
            nextNodes[lastNode] = nodeIndex;
            nextNodes[nodeIndex] = -1;

            previousNodes[-1] = nodeIndex;
            previousNodes[nodeIndex] = lastNode;

            node = Node(nodeIndex, orderIndex, orderValue);

            nodes[nodeIndex] = node;
            lastNode = nodeIndex;

            numberOfNodes += 1;

            return true;
        }

        // Add in any position
        int256 _node = nextNodes[-1];

        while (_node > -1) {
            if (orderValue < nodes[_node].orderValue) {
                int256 previousNode = previousNodes[_node];
                int256 nextNode = _node;

                nextNodes[previousNode] = nodeIndex;
                nextNodes[nodeIndex] = nextNode;

                previousNodes[nextNode] = nodeIndex;
                previousNodes[nodeIndex] = previousNode;

                node = Node(nodeIndex, orderIndex, orderValue);

                nodes[nodeIndex] = node;

                numberOfNodes += 1;

                return true;
            }

            _node = nextNodes[_node];
        }

        return false;
    }

    function returnNodesAscending() public view returns (Node[] memory) {
        Node[] memory _nodes = new Node[](uint256(numberOfNodes));
        int256 node = nextNodes[-1];
        uint256 i = 0;

        while (node > -1) {
            _nodes[i] = nodes[node];

            node = nextNodes[node];

            i += 1;
        }

        return _nodes;
    }

    function returnNodesDescending() public view returns (Node[] memory) {
        Node[] memory _nodes = new Node[](uint256(numberOfNodes));
        int256 node = previousNodes[-1];
        uint256 i = 0;

        while (node > -1) {
            _nodes[i] = nodes[node];

            node = previousNodes[node];

            i += 1;
        }

        return _nodes;
    }
}
