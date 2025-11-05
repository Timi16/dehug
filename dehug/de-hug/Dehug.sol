// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol"; // ← ADD THIS FOR ROYALTIES!

contract DeHugIncentives is ERC1155, Ownable, ReentrancyGuard, ERC2981 {
    // Enums
    enum ContentType { DATASET, MODEL }
    enum QualityTier { BRONZE, SILVER, GOLD, PLATINUM }

    // Constants
    uint256 public constant DATASET_DOWNLOAD_POINTS = 10;
    uint256 public constant MODEL_DOWNLOAD_POINTS = 20;
    uint256 public constant QUALITY_BONUS_MULTIPLIER = 2;

    // Structs
    struct Content {
        address uploader;
        ContentType contentType;
        string ipfsHash;
        string metadataIPFSHash;
        string title;
        QualityTier qualityTier;
        uint256 downloadCount;
        uint256 totalPointsEarned;
        uint256 uploadTimestamp;
        bool isActive;
        string imageIPFSHash;
    }

    struct UserProfile {
        uint256 totalPoints;
        uint256 reputationScore;
        bool isPremiumContributor;
    }

    // State variables
    uint256 private _currentTokenId;
    mapping(uint256 => Content) public contents;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) private userContent;
    mapping(string => uint256) public ipfsHashToTokenId;
    mapping(address => bool) public verifiedUploaders;

    // Events
    event ContentUploaded(
        uint256 indexed tokenId,
        address indexed uploader,
        ContentType contentType,
        string ipfsHash,
        string title
    );

    event ContentDownloaded(
        uint256 indexed tokenId,
        address indexed downloader,
        address indexed uploader,
        uint256 pointsAwarded
    );

    event BatchDownloadsUpdated(
        uint256 indexed tokenId,
        uint256 additionalDownloads,
        uint256 pointsAwarded
    );

    event QualityTierUpdated(
        uint256 indexed tokenId,
        QualityTier oldTier,
        QualityTier newTier
    );

    event ReputationUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore
    );

    event RoyaltySet(
        address indexed receiver,
        uint96 feeNumerator
    );

    constructor() ERC1155("") Ownable(msg.sender) {
        _currentTokenId = 0;
        
        // Set default royalty: 5% to contract owner
        // 500 = 5% (500/10000 = 0.05)
        _setDefaultRoyalty(msg.sender, 500);
    }

    // ============================================
    // ROYALTY FUNCTIONS (NEW!)
    // ============================================

    /**
     * @dev Set default royalty for all NFTs
     * @param receiver Address to receive royalties
     * @param feeNumerator Royalty percentage (500 = 5%, 1000 = 10%)
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        require(feeNumerator <= 1000, "Royalty too high (max 10%)");
        _setDefaultRoyalty(receiver, feeNumerator);
        emit RoyaltySet(receiver, feeNumerator);
    }

    /**
     * @dev Set custom royalty for specific token
     * @param tokenId Token to set royalty for
     * @param receiver Address to receive royalties
     * @param feeNumerator Royalty percentage
     */
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyOwner {
        require(tokenId > 0 && tokenId <= _currentTokenId, "Invalid token ID");
        require(feeNumerator <= 1000, "Royalty too high (max 10%)");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /**
     * @dev Remove royalty for specific token
     */
    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

    // ============================================
    // EXISTING FUNCTIONS (Keep all your original functions)
    // ============================================

    function uploadContent(
        ContentType _contentType,
        string memory _ipfsHash,
        string memory _metadataIPFSHash,
        string memory _imageIPFSHash,
        string memory _title,
        string[] memory _tags
    ) external nonReentrant returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(ipfsHashToTokenId[_ipfsHash] == 0, "Content already exists");

        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        contents[newTokenId] = Content({
            uploader: msg.sender,
            contentType: _contentType,
            ipfsHash: _ipfsHash,
            metadataIPFSHash: _metadataIPFSHash,
            title: _title,
            qualityTier: QualityTier.BRONZE,
            downloadCount: 0,
            totalPointsEarned: 0,
            uploadTimestamp: block.timestamp,
            isActive: true,
            imageIPFSHash: _imageIPFSHash
        });

        ipfsHashToTokenId[_ipfsHash] = newTokenId;
        userContent[msg.sender].push(newTokenId);

        _mint(msg.sender, newTokenId, 1, "");

        userProfiles[msg.sender].totalPoints += 50;
        userProfiles[msg.sender].reputationScore += 10;

        emit ContentUploaded(newTokenId, msg.sender, _contentType, _ipfsHash, _title);

        return newTokenId;
    }

    function updateDownloadCount(uint256 _tokenId, uint256 _downloadCount) external onlyOwner {
        require(_tokenId > 0 && _tokenId <= _currentTokenId, "Invalid token ID");
        require(contents[_tokenId].isActive, "Content is not active");

        Content storage content = contents[_tokenId];
        uint256 additionalDownloads = _downloadCount - content.downloadCount;
        
        if (additionalDownloads > 0) {
            uint256 pointsPerDownload = content.contentType == ContentType.DATASET 
                ? DATASET_DOWNLOAD_POINTS 
                : MODEL_DOWNLOAD_POINTS;
            
            uint256 pointsAwarded = additionalDownloads * pointsPerDownload;
            
            content.downloadCount = _downloadCount;
            content.totalPointsEarned += pointsAwarded;
            
            userProfiles[content.uploader].totalPoints += pointsAwarded;
            userProfiles[content.uploader].reputationScore += additionalDownloads;

            emit BatchDownloadsUpdated(_tokenId, additionalDownloads, pointsAwarded);
        }
    }

    function manualUpdateQualityTier(uint256 _tokenId, QualityTier _newTier) external onlyOwner {
        require(_tokenId > 0 && _tokenId <= _currentTokenId, "Invalid token ID");
        
        QualityTier oldTier = contents[_tokenId].qualityTier;
        contents[_tokenId].qualityTier = _newTier;
        
        emit QualityTierUpdated(_tokenId, oldTier, _newTier);
    }

    function deactivateContent(uint256 _tokenId) external {
        require(_tokenId > 0 && _tokenId <= _currentTokenId, "Invalid token ID");
        require(
            contents[_tokenId].uploader == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        
        contents[_tokenId].isActive = false;
    }

    function redeemPoints(uint256 _tokenId, uint256 _points) external nonReentrant {
        require(userProfiles[msg.sender].totalPoints >= _points, "Insufficient points");
        userProfiles[msg.sender].totalPoints -= _points;
    }

    function addVerifiedUploader(address _uploader) external onlyOwner {
        verifiedUploaders[_uploader] = true;
    }

    function removeVerifiedUploader(address _uploader) external onlyOwner {
        verifiedUploaders[_uploader] = false;
    }

    // View functions
    function getContent(uint256 _tokenId) external view returns (
        address uploader,
        ContentType contentType,
        string memory ipfsHash,
        string memory title,
        QualityTier qualityTier,
        uint256 downloadCount,
        uint256 totalPointsEarned,
        uint256 uploadTimestamp,
        bool isActive
    ) {
        Content memory content = contents[_tokenId];
        return (
            content.uploader,
            content.contentType,
            content.ipfsHash,
            content.title,
            content.qualityTier,
            content.downloadCount,
            content.totalPointsEarned,
            content.uploadTimestamp,
            content.isActive
        );
    }

    function getContentBatch(uint256[] memory _tokenIds) external view returns (
        address[] memory uploaders,
        ContentType[] memory contentTypes,
        string[] memory ipfsHashes,
        string[] memory titles,
        QualityTier[] memory qualityTiers,
        uint256[] memory downloadCounts,
        bool[] memory isActiveList
    ) {
        uploaders = new address[](_tokenIds.length);
        contentTypes = new ContentType[](_tokenIds.length);
        ipfsHashes = new string[](_tokenIds.length);
        titles = new string[](_tokenIds.length);
        qualityTiers = new QualityTier[](_tokenIds.length);
        downloadCounts = new uint256[](_tokenIds.length);
        isActiveList = new bool[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            Content memory content = contents[_tokenIds[i]];
            uploaders[i] = content.uploader;
            contentTypes[i] = content.contentType;
            ipfsHashes[i] = content.ipfsHash;
            titles[i] = content.title;
            qualityTiers[i] = content.qualityTier;
            downloadCounts[i] = content.downloadCount;
            isActiveList[i] = content.isActive;
        }

        return (uploaders, contentTypes, ipfsHashes, titles, qualityTiers, downloadCounts, isActiveList);
    }

    function getContentMetadata(uint256 _tokenId) external view returns (string memory) {
        return contents[_tokenId].metadataIPFSHash;
    }

    function getUserContent(address _user) external view returns (uint256[] memory) {
        return userContent[_user];
    }

    function getUserStats(address _user) external view returns (
        uint256 totalPoints,
        uint256 reputationScore,
        bool isPremiumContributor,
        uint256 contentCount
    ) {
        UserProfile memory profile = userProfiles[_user];
        return (
            profile.totalPoints,
            profile.reputationScore,
            profile.isPremiumContributor,
            userContent[_user].length
        );
    }

    function getLatestContent(uint256 _count) external view returns (uint256[] memory tokenIds) {
        uint256 count = _count > _currentTokenId ? _currentTokenId : _count;
        tokenIds = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = _currentTokenId - i;
        }
        
        return tokenIds;
    }

    function getLatestTokenId() external view returns (uint256) {
        return _currentTokenId;
    }

    function totalSupply() external view returns (uint256) {
        return _currentTokenId;
    }

    function uri(uint256 _tokenId) public view override returns (string memory) {
        require(_tokenId > 0 && _tokenId <= _currentTokenId, "Invalid token ID");
        string memory metadataHash = contents[_tokenId].metadataIPFSHash;
        return string(abi.encodePacked("ipfs://", metadataHash));
    }

    // ============================================
    // INTERFACE SUPPORT (IMPORTANT!)
    // ============================================

    /**
     * @dev See {IERC165-supportsInterface}.
     * Must override to support both ERC1155 and ERC2981
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}