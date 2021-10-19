// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/*
	/$$$$$$$$ /$$ /$$                                         /$$                      /$$$$$$    /$$     /$$                                  
	| $$_____/| $$|__/                                        |__/                     /$$__  $$  | $$    | $$                                  
	| $$      | $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$  /$$ /$$$$$$$   /$$$$$$ | $$  \ $$ /$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$$
	| $$$$$   | $$| $$ /$$__  $$ /$$__  $$ /$$__  $$| $$__  $$| $$| $$__  $$ /$$__  $$| $$  | $$|_  $$_/|_  $$_/   /$$__  $$ /$$__  $$ /$$_____/
	| $$__/   | $$| $$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  \ $$| $$| $$  \ $$| $$  \ $$| $$  | $$  | $$    | $$    | $$$$$$$$| $$  \__/|  $$$$$$ 
	| $$      | $$| $$| $$  | $$| $$  | $$| $$_____/| $$  | $$| $$| $$  | $$| $$  | $$| $$  | $$  | $$ /$$| $$ /$$| $$_____/| $$       \____  $$
	| $$      | $$| $$| $$$$$$$/| $$$$$$$/|  $$$$$$$| $$  | $$| $$| $$  | $$|  $$$$$$$|  $$$$$$/  |  $$$$/|  $$$$/|  $$$$$$$| $$       /$$$$$$$/
	|__/      |__/|__/| $$____/ | $$____/  \_______/|__/  |__/|__/|__/  |__/ \____  $$ \______/    \___/   \___/   \_______/|__/      |_______/ 
					| $$      | $$                                         /$$  \ $$                                                          
					| $$      | $$                                        |  $$$$$$/                                                          
					|__/      |__/                                         \______/                                                           
*/
                                          
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
 * Steps for initializing the contract
 * 1. Deploy the contract with right constructor params
 * 2. Call getRandomNumber
 * 3. Add presale address presalerList
 * 4. Gift to give away winners
 * 5. Set BaseURI, contractURI, provenanceHash, togglePresale, toggleSaleStatus, setSignerAddress
 * 6. Set lockMetadata
 * 7. Let it mint
 */ 
contract FlippeningOtters is ERC721Enumerable, Ownable, KeeperCompatibleInterface, VRFConsumerBase {
    using ECDSA for bytes32;

    uint256 public constant OTTER_GIFT = 99;
    uint256 public constant OTTER_PRIVATE = 900;
    uint256 public constant OTTER_PUBLIC = 9000;
    uint256 public constant OTTER_MAX = OTTER_GIFT + OTTER_PRIVATE + OTTER_PUBLIC;
    uint256 public constant OTTER_PRICE = 0.05 ether;
    uint256 public constant OTTER_PER_MINT = 5;
    
    mapping(address => bool) public presalerList;
    mapping(address => uint256) public presalerListPurchases;
    mapping(string => bool) private _usedNonces;
    mapping(uint256 => uint256) private _tokenIdToImageId;
    
    string private _contractURI;
    string private _tokenBaseURI = "https://flippeningotters.io/api/metadata/";
    address private _signerAddress;
	
    string public proof;
    uint256 public giftedAmount;
    uint256 public publicAmountMinted;
    uint256 public privateAmountMinted;
    uint256 public presalePurchaseLimit = 2;
    bool public presaleLive;
    bool public saleLive;
    bool public locked;
    
    
    AggregatorV3Interface internal ethMarketCapFeed;
    AggregatorV3Interface internal btcMarketCapFeed;
    bool public done;
    
    
    bytes32 internal randomKeyHash;
    uint256 internal randomLinkFee;
    uint256 public randomResult;
    
    // ETH Mainnet params.
    //
    // https://docs.chain.link/docs/ethereum-addresses
    // ethFeed: 0xAA2FE1324b84981832AafCf7Dc6E6Fe6cF124283
    // btcFeed: 0x47E1e89570689c13E723819bf633548d611D630C
    //
    // https://docs.chain.link/docs/vrf-contracts/
    // vrfLinkToken: 0x514910771AF9Ca656af840dff83E8264EcF986CA
    // vrfCoordinator: 0xf0d54349aDdcf704F77AE15b96510dEA15cb7952
    // keyHash: 0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445
    // Fee: 2 LNK
    constructor(address ethFeed, address btcFeed, address vrfLinkToken, address vrfCoordinator, bytes32 keyHash, uint256 linkFee) 
        ERC721("Flippening Otters", "FOT") 
        VRFConsumerBase(
            vrfCoordinator, // VRF Coordinator
            vrfLinkToken  // LINK Token
        ) { 
      ethMarketCapFeed = AggregatorV3Interface(ethFeed);
      btcMarketCapFeed = AggregatorV3Interface(btcFeed);
      randomKeyHash = keyHash;
      randomLinkFee = linkFee * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    modifier notLocked {
        require(!locked, "Contract metadata methods are locked");
        _;
    }
    
    function addToPresaleList(address[] calldata entries) external onlyOwner {
        for(uint256 i = 0; i < entries.length; i++) {
            address entry = entries[i];
            require(entry != address(0), "NULL_ADDRESS");
            require(!presalerList[entry], "DUPLICATE_ENTRY");

            presalerList[entry] = true;
        }   
    }

    function removeFromPresaleList(address[] calldata entries) external onlyOwner {
        for(uint256 i = 0; i < entries.length; i++) {
            address entry = entries[i];
            require(entry != address(0), "NULL_ADDRESS");
            
            presalerList[entry] = false;
        }
    }
    
    function hashTransaction(address sender, uint256 qty, string memory nonce) private pure returns(bytes32) {
          bytes32 hash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            keccak256(abi.encodePacked(sender, qty, nonce)))
          );
          
          return hash;
    }
    
    function matchAddresSigner(bytes32 hash, bytes memory signature) private view returns(bool) {
        return _signerAddress == hash.recover(signature);
    }
    
    function buy(bytes32 hash, bytes memory signature, string memory nonce, uint256 tokenQuantity) external payable {
        require(saleLive, "SALE_CLOSED");
        require(!presaleLive, "ONLY_PRESALE");
        // Only minting from the official website will be permitted.
        require(matchAddresSigner(hash, signature), "DIRECT_MINT_DISALLOWED");
        require(!_usedNonces[nonce], "HASH_USED");
        require(hashTransaction(msg.sender, tokenQuantity, nonce) == hash, "HASH_FAIL");
        require(totalSupply() < OTTER_MAX, "OUT_OF_STOCK");
        require(publicAmountMinted + tokenQuantity <= OTTER_PUBLIC, "EXCEED_PUBLIC");
        require(tokenQuantity <= OTTER_PER_MINT, "EXCEED_OTTER_PER_MINT");
        require(OTTER_PRICE * tokenQuantity <= msg.value, "INSUFFICIENT_ETH");
        
        for(uint256 i = 0; i < tokenQuantity; i++) {
            publicAmountMinted++;
            shuffleMint(msg.sender, totalSupply() + 1);
        }
        
        _usedNonces[nonce] = true;
    }
    
    function presaleBuy(uint256 tokenQuantity) external payable {
        require(!saleLive && presaleLive, "PRESALE_CLOSED");
        require(presalerList[msg.sender], "NOT_QUALIFIED");
        require(totalSupply() < OTTER_MAX, "OUT_OF_STOCK");
        require(privateAmountMinted + tokenQuantity <= OTTER_PRIVATE, "EXCEED_PRIVATE");
        require(presalerListPurchases[msg.sender] + tokenQuantity <= presalePurchaseLimit, "EXCEED_ALLOC");
        require(OTTER_PRICE * tokenQuantity <= msg.value, "INSUFFICIENT_ETH");
        
        for (uint256 i = 0; i < tokenQuantity; i++) {
            privateAmountMinted++;
            presalerListPurchases[msg.sender]++;
            shuffleMint(msg.sender, totalSupply() + 1);
        }
    }
    
    function gift(address[] calldata receivers) external onlyOwner {
        require(totalSupply() + receivers.length <= OTTER_MAX, "MAX_MINT");
        require(giftedAmount + receivers.length <= OTTER_GIFT, "GIFTS_EMPTY");
        
        for (uint256 i = 0; i < receivers.length; i++) {
            giftedAmount++;
            shuffleMint(receivers[i], totalSupply() + 1);
        }
    }
    
    /**
     * Generates a number between 1 to num (inclusive).
     */ 
    function rangedRandomNum(uint256 num) internal view returns (uint256) {
        return uint256(keccak256(abi.encode(block.timestamp, msg.sender, totalSupply(), randomResult)))%num + 1;
    }
    
    function shuffleMint(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId);
        uint256 target = rangedRandomNum(tokenId);
        // Swap target and tokenId image mapping.
        _tokenIdToImageId[tokenId] = target;
        _tokenIdToImageId[target] = tokenId;
    }
    
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function isPresaler(address addr) external view returns (bool) {
        return presalerList[addr];
    }
    
    function presalePurchasedCount(address addr) external view returns (uint256) {
        return presalerListPurchases[addr];
    }
    
    // Owner functions for enabling presale, sale, revealing and setting the provenance hash
    function lockMetadata() external onlyOwner {
        locked = true;
    }
    
    function togglePresaleStatus() external onlyOwner {
        presaleLive = !presaleLive;
    }
    
    function toggleSaleStatus() external onlyOwner {
        saleLive = !saleLive;
    }
    
    function setSignerAddress(address addr) external onlyOwner {
        _signerAddress = addr;
    }
    
    function setProvenanceHash(string calldata hash) external onlyOwner notLocked {
        proof = hash;
    }
    
    function setContractURI(string calldata URI) external onlyOwner notLocked {
        _contractURI = URI;
    }
    
    function setBaseURI(string calldata URI) external onlyOwner notLocked {
        _tokenBaseURI = URI;
    }
    
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "Cannot query non-existent token");
        require(locked, "Wait for minting to complete");
        require(_tokenIdToImageId[tokenId] > 0, "Cannot query non-existent imageId");
        
        return string(abi.encodePacked(_tokenBaseURI, _tokenIdToImageId[tokenId]));
    }
    
    function updateLinkFee(uint256 linkFee) external onlyOwner {
      randomLinkFee = linkFee * 10 ** 18;
    }
    
    
    function updateKeyHash(bytes32 keyHash) external onlyOwner {
      randomKeyHash = keyHash;
    }
    
    /** 
     * Requests randomness 
     */
    function getRandomNumber() public onlyOwner returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= randomLinkFee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(randomKeyHash, randomLinkFee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }
    
    // TODO: change it to internal function after testing.
    function isFlipped() public view returns (bool) {
        (, int256 btcMarketCap,,,) = btcMarketCapFeed.latestRoundData();
        (, int256 ethMarketCap,,,) = ethMarketCapFeed.latestRoundData();
        return btcMarketCap <= ethMarketCap ;
    }
    
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = !done && isFlipped();
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        require(isFlipped(), "Flippening event must have already happened");
        done = true;
        // Mint the Flippening Otter
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }  
}