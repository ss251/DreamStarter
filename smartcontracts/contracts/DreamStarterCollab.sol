// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./common/IAccessMaster.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

    /**
     * validate()
     */
error DreamStarterCollab__ProposalRejected();
error DreamStarterCollab_ClaimedNotPossible();

contract DreamStarterCollab is Context, ERC721Enumerable , ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    bool public pause ;
    bool public isCreatorStaked;
    bool private isProposalRejected;
    bool private isProposalCleared;

    address public immutable proposalCreator;

    uint256 public immutable crowdFundingGoal;
    uint256 public fundsInReserve;///@dev to know how much fund is collected still yet before the
    uint256 public fundingActiveTime;
    uint256 public fundingEndTime;
    uint256 public salePrice;
    
    uint8 public numberOfMileStones;
    uint8 public yieldBasisPoint;
    

    string public baseURI;

    string[] public mileStone;
    mapping (uint256 => bool) public refundStatus;

    IACCESSMASTER flowRoles;
    IERC20 token;

    modifier onlyOperator() {
        require(
            flowRoles.isOperator(_msgSender()),
            "DreamStarterCollab: User is not authorized"
        );
        _;
    }
    
    modifier onlyProposalCreator {
        require(_msgSender() == proposalCreator,"DreamStarterCollab: User is not proposal creator");
        _;      
    }

    modifier onlyWhenProposalIsNotActive {
        require(
            block.timestamp < fundingActiveTime,"DreamStarterCollab: Funding has been intiated , action cannot be performed"
        );
        _;
    }
    modifier onlyWhenNotPaused {
        require(
            pause == false ,"DreamStarterCollab: Funding is paused!"
        );
        _;
    }

    event TicketMinted(
        uint256 tokenID,
        address indexed creator
    );

    event MileStoneSubmitted(
        string data
    );

    event Staked(
        uint256 indexed amount,
        bool state
    );

    event Unstaked(
        uint256 indexed amount,
        bool state
    );

    event FundWithdrawnByHandler(
        uint8 milestoneNumber,
        uint256 amount,
        address wallet
    );

    event FundsTransferred(
        address indexed toWallet,
        address indexed fromWallet,
        uint256 indexed amount
    );

    event RefundClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 indexed amount
    );

    event Donation(
        uint256 amount,
        address  doner,
        uint256 gas
    );


    /**
     * 
     * @param _proposalCreator - who is  creating the proposal
     * @param proposalName - Name of the event as well as NFT token Name
     * @param proposalSymbol - Symbol of the event as well as the NFT token symbol
     * @param proposalDetails - First parameter crowdfunding goal which should be in stablecoin ,
     * Second parameter is the starting time of proposal, third parameter is endingTime of the proposal
     * fourth parameter is the Price of the NFT
     * @param _baseURI - BaseURI  of  NFT for it's details
     * @param contractAddr  - first parameter is the contract stableCoin Address for recieving funds and 
     * second parameter is Accessmaster Address  for the company
     */

    constructor(
        address _proposalCreator,
        string memory proposalName,
        string memory proposalSymbol,
        uint256 []  memory proposalDetails,
        string memory _baseURI,
        address [] memory contractAddr
    ) ERC721(proposalName, proposalSymbol) {
        proposalCreator = _proposalCreator;
        require(proposalDetails.length == 4,"DreamStarter: Invalid Proposal Input");
        crowdFundingGoal = proposalDetails[0];
        fundingActiveTime = proposalDetails[1];
        fundingEndTime = proposalDetails[2];
        salePrice = proposalDetails[3];
        baseURI = _baseURI;
        require(contractAddr.length == 2,"DreamStarter: Invalid Contract Input");
        token = IERC20(contractAddr[0]);
        flowRoles = IACCESSMASTER(contractAddr[1]);
    }

    receive() external payable{
        emit Donation(msg.value,_msgSender(),gasleft());
    }   

    /** Private/Internal Functions **/
    function _pause() private {
        pause = true;
    }

    function _unpause() private {
        pause = false;
    }

     function _proposalRejection() private{
        isProposalRejected = true;
        _pause(); 
    }

    function _transferFunds(address from,address to,uint256 amount) private  returns(bool){
        uint256 value =  token.balanceOf(_msgSender());
        require(value >= amount,"DreamStarterCollab: Not Enough Funds!");
        bool success = token.transferFrom(from,to,amount);
        require(success, "DreamStarterCollab: Transfer failed"); 
        emit FundsTransferred(from,to,amount);
        return success;       
    }

      /** PUBLIC/EXTERNAL Function */

     function setFundingStartTime(uint256 time) external onlyProposalCreator onlyWhenProposalIsNotActive {
        fundingActiveTime = time;
     }

     function setFundingEndTime(uint256 time) external onlyProposalCreator onlyWhenProposalIsNotActive {
        fundingEndTime = time;
     }
 
    function submitMileStoneInfo(string memory data)external onlyProposalCreator {
        mileStone.push(data);
        emit MileStoneSubmitted(data);
    }

    ///@dev this function can be called only once for the intialization of first milestone funding
    function intiateProposalFunding() external onlyProposalCreator {
        require(fundsInReserve == crowdFundingGoal && numberOfMileStones == 0,"DreamStarter: Proposal cannot be intiated");
        _unpause();
    }


    /// @dev Users must utilize this tool to reject the proposal in order to get their money back 
    /// if the crowdfunding campaign is not finished in the allotted period.
    /// And it is accessible to everybody.
    function intiateRejection()  external {
        if(block.timestamp > fundingEndTime && fundsInReserve < crowdFundingGoal){
            _proposalRejection();
            isProposalCleared = true;
        }
    }


    function stake(uint256 amount) external onlyProposalCreator onlyWhenProposalIsNotActive{
        uint256 stakingAmount = (crowdFundingGoal * 20) / 100; 
        require(amount == stakingAmount,"DreamStarterCollab: Funds should be equal to staking amount");
        isCreatorStaked = _transferFunds(_msgSender(),address(this),stakingAmount);
        emit Staked(stakingAmount,isCreatorStaked);
    }


    function mintTicket()external returns (uint256) {
        require(block.timestamp >= fundingActiveTime || block.timestamp < fundingEndTime,"DreamStarterCollab: Funding cannot be done");
        require(fundsInReserve <= crowdFundingGoal,"DreamStarterCollab: Funding goal has been reached");
        if(isCreatorStaked = false){
                _proposalRejection();
                revert DreamStarterCollab__ProposalRejected();        
        }
        _transferFunds(_msgSender(),address(this),salePrice);
        fundsInReserve += salePrice;
        _tokenIdTracker.increment();
        uint256 currentTokenID = _tokenIdTracker.current();
        _safeMint(_msgSender(), currentTokenID);
        emit TicketMinted(currentTokenID, _msgSender());
        return currentTokenID;
    }

    /// @notice only Proposal  can withdraw the funds collected
    function withdrawFunds(address wallet, uint256 amount) external onlyProposalCreator onlyWhenNotPaused nonReentrant{
        uint256 val = (crowdFundingGoal * 20) / 100;
        require(amount < val && fundsInReserve > 0,"DreamStarterCollab: Amount to be collected more than staked"); // 
        fundsInReserve -= amount;
        _pause();
        _transferFunds(address(this),wallet,amount);
        numberOfMileStones ++;
        emit FundWithdrawnByHandler(numberOfMileStones,amount,wallet);
    }

    /// validate() external  -> To unpause  or Reject or  to set if proposal is all cleared or not

    // bool public isCreatorStaked;
    // bool private isProposalRejected;
    // bool private isProposalCleared;

    function validate(bool result,bool proposalRejectedStatus) external onlyOperator {
        if(result == true){
            if(fundsInReserve == 0){
                isProposalCleared = true;
            }
            else{
                _unpause();
            }
        }
        else{
            if(proposalRejectedStatus){
                _proposalRejection();
            }
            else{
                _pause();
            }
        }
       
    }


    function claimback(uint256 tokenId) external nonReentrant returns(uint256 ,bool) {
       require(ownerOf(tokenId) == _msgSender(),"DreamStarter: User is not the token owner");
       require(refundStatus[tokenId] == false,"DreamStarter: Refund is already claimed!");
       if(fundingEndTime < block.timestamp && fundsInReserve != crowdFundingGoal){   
           uint256 refundValue = refundAmount(fundsInReserve);
           refundStatus[tokenId] = true;
           _transferFunds(address(this),_msgSender(),refundValue);
           emit RefundClaimed(tokenId,_msgSender(),refundValue);
           return (refundValue,refundStatus[tokenId]);
       }
       else if(isProposalRejected){
            uint256 value = (crowdFundingGoal * 20) / 100;
            value += fundsInReserve; 
            uint256 refundValue = refundAmount(value);
            refundStatus[tokenId] = true;
            _transferFunds(address(this),_msgSender(),refundValue);
            emit RefundClaimed(tokenId,_msgSender(),refundValue);
            return (refundValue,refundStatus[tokenId]);
       }
       else{
            revert DreamStarterCollab_ClaimedNotPossible();
       }
    }   

    function unStake() external onlyProposalCreator  returns(uint256 amount) {
        require(isProposalCleared == true && isCreatorStaked == true,"DreamStarter: User cannot withdraw funds");
        amount =  (crowdFundingGoal * 20) / 100; 
        isCreatorStaked = false;
        _transferFunds(address(this),proposalCreator,amount);        
    }

    
    /** OPERATOR FUNCTIONS */
    function withdrawFundByOperator(
            address wallet,
            uint256 amount ,
            address tokenAddr
        )external onlyOperator returns(bool status){
           status = IERC20(tokenAddr).transferFrom(address(this),wallet,amount);
    }

    function unpauseOrPauseByOperator(bool state) external onlyOperator{
        if(state){
            _pause();
        }
        else _unpause();
    }

    function intiateRejectionByOperator()external onlyOperator {
         _proposalRejection();
    }

    /** Getter Functions **/

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(tokenId), "DreamStarterCollab: Non-Existent Asset");
        return baseURI;
    }

    function refundAmount(uint256 amount)public view  returns (uint256 refundValue) {
         refundValue  = amount / totalSupply();

    }
    /////////////////////////////////////////////////

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
