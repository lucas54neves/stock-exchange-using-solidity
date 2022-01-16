// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Broker {
    address owner;
    string brokerName;
    string brokerRegisteredNumber;
    
    struct User {
        address userAddress;
        string name;
        string taxpayerId;
        bool active;
    }
    
    struct Quota {
        string assetCode;
        uint256 quotaCode;
        address owner;
        bool active;
    }
    
    struct Asset {
        string code;
        string name;
        bool active;
        uint256 numberOfQuotas;
    }
    
    struct SaleOrder {
        string quotaCode;
        uint value;
        uint time;
        address seller;
        bool executed;
        string assetCode;
    }
    
    address[] userAddresses;
    mapping(address => User) private addressUserMapping;
    
    string[] assetCodes;
    mapping(string => Asset) private codeAssetMapping;
    
    mapping(string => Quota) private assetQuotaMapping;
    
    string[] salesOrderCodes;
    mapping(string => SaleOrder) private salesOrderMapping;
    
    constructor() {
        owner = msg.sender;
        brokerRegisteredNumber = '18.768.038/0001-74';
        brokerName = 'Broker de Teste';
    }
    
    function addUser(string memory name, string memory taxpayerId) public {
        require(!addressUserMapping[msg.sender].active, 'User already exists');
        
        User memory user = User({
            userAddress: msg.sender,
            name: name,
            taxpayerId: taxpayerId,
            active: true
        });
        
        addressUserMapping[msg.sender] = user;
        
        userAddresses.push(msg.sender);
    }
    
    function getUsers() public view returns (User[] memory) {
        require(msg.sender == owner, 'Only the owner can view users');
        
        User[] memory users = new User[](userAddresses.length);
        
        for (uint i = 0; i < userAddresses.length; i++) {
            users[i] = addressUserMapping[userAddresses[i]];
        }
        
        return users;
    }
    
    function addAsset(string memory code, string memory name, uint256  numberOfQuotas) public {
        require(msg.sender == owner, 'Only the owner can add assets');
        
        require(!codeAssetMapping[code].active, 'Asset already exists');
        
        Asset memory asset = Asset({
            code: code,
            name: name,
            active: true,
            numberOfQuotas: numberOfQuotas
        });
        
        codeAssetMapping[code] = asset;
        
        assetCodes.push(code);
        
        for (uint i = 1; i <= numberOfQuotas; i++) {
            Quota memory quota = Quota({
                assetCode: code,
                quotaCode: i,
                owner: msg.sender,
                active: true
            });
            
            string memory quotaCode = string(abi.encodePacked(code, i));
            
            assetQuotaMapping[quotaCode] = quota;
        }
    }
    
    function getAssetQuotas(string memory assetCode) public view returns (Quota[] memory) {
        Asset memory asset = codeAssetMapping[assetCode];
        
        Quota[] memory quotas = new Quota[](asset.numberOfQuotas);
        
        for (uint i = 0; i < asset.numberOfQuotas; i++) {
            string memory quotaCode = string(abi.encodePacked(asset.code, i));
            
            quotas[i] = assetQuotaMapping[quotaCode];
        }
        
        return quotas;
    }
    
    function sendMoney(address payable recipientAddress) public payable {
        (bool sent, ) = recipientAddress.call{value: msg.value}("");
        
        require(sent, "Failed to send Ether.");
    }
    
    function putForSale(string memory quotaCode) public payable {
        Quota memory quota = assetQuotaMapping[quotaCode];
        
        require(!quota.active, 'Quota does not exist');
        
        require(msg.sender == quota.owner, "Only the asset's owner can sell the asset");
        
        SaleOrder memory order = SaleOrder({
            quotaCode: quotaCode,
            value: msg.value,
            time: block.timestamp,
            seller: msg.sender,
            executed: false,
            assetCode: quota.assetCode
        });
        
        salesOrderMapping[quotaCode] = order;
        
        salesOrderCodes.push(quotaCode);
    }
    
    function compareStrings(string memory a, string memory b) private view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
    function getSaleOrderByAsset(string memory assetCode) private returns (SaleOrder memory) {
        uint256 index = salesOrderCodes.length + 1;
        
        for (uint i = 0; i < salesOrderCodes.length; i++) {
            string memory currentQuotaCode = salesOrderCodes[i];
            
            SaleOrder memory currentSaleOrder = salesOrderMapping[currentQuotaCode];
            
            if (compareStrings(currentSaleOrder.assetCode, assetCode)) {
                if (index == salesOrderCodes.length + 1) {
                    index = i;
                } else {
                    string memory previousQuotaCode = salesOrderCodes[i];
                    
                    SaleOrder memory previousSaleOrder = salesOrderMapping[previousQuotaCode];
                    
                    if (currentSaleOrder.value < previousSaleOrder.value) {
                        index = i;
                    }
                }
            }
        }
        
        require(!(index == salesOrderCodes.length + 1), 'No sales orders found');
        
        string memory quotaCode = salesOrderCodes[index];
                    
        return salesOrderMapping[quotaCode];
    }
    
    // function buyAsset(string memory assetCode) public returns (bool) {
    //     try this.getSaleOrderByAsset(assetCode) private returns (SaleOrder memory saleOrder, bool success) {
    //         return (saleOrder, true);
    //     } catch {
    //         return false;
    //     }
    // }
}