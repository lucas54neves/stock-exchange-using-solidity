pragma solidity ^0.8.3;

contract Broker {
    struct User {
        address userAddress;
        string name;
        string taxpayerId;
        bool active;
    }
    
    struct Asset {
        string code;
        string name;
        bool active;
    }
    
    address owner;
    string brokerName;
    string brokerRegisteredNumber;
    
    address[] userAddresses;
    mapping(address => User) private addressUserMapping;
    
    string[] assetCodes;
    mapping(string => Asset) private codeAssetMapping;
    
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
    
    function addAsset(string memory code, string memory name) public {
        require(msg.sender == owner, 'Only the owner can add assets');
        
        require(!codeAssetMapping[code].active, 'Asset already exists');
        
        Asset memory asset = Asset({
            code: code,
            name: name,
            active: true
        });
        
        codeAssetMapping[code] = asset;
        
        assetCodes.push(code);
    }
}