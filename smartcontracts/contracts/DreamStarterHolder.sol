// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./common/IAccessMaster.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./common/ERC721A/ERC721A.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

    /**
     * validate()
     * change claimback
     * add YieldSubmission
     * 
     */
error DreamStarterHolder__ProposalRejected();
error DreamStarterHolder_ClaimedNotPossible();
error DreamStarterHolder_NotEnoughFunds();

contract DreamStarterHolder is Context, ERC721A , ReentrancyGuard {
 

    bool public pause ;
    bool public isCreatorStaked;
    bool public isYieldReturned;
    bool private isProposalRejected;
    bool private isProposalCleared;

    address public immutable proposalCreator;

    uint256 public immutable crowdFundingGoal;
    uint256 public fundsInReserve;///@dev to know how much fund is collected still yet before the
    uint256 public fundingActiveTime;
    uint256 public fundingEndTime;
    uint256 public salePrice;
    uint256 public stakingAmount;

    uint8 public numberOfMileStones;
    uint8 public immutable yieldBasisPoints;
   

    string public baseURI;

    string[] public mileStone;
    mapping (address => bool) public refundStatus;

    IACCESSMASTER flowRoles;
    IERC20 token;

    modifier onlyOperator() {
        require(
            flowRoles.isOperator(_msgSender()),
            "DreamStarterHolder: User is not authorized"
        );
        _;
    }
    
    modifier onlyProposalCreator {
        require(_msgSender() == proposalCreator,"DreamStarterHolder: User is not proposal creator");
        _;      
    }

    modifier onlyWhenProposalIsNotActive {
        require(
            block.timestamp < fundingActiveTime,"DreamStarterHolder: Funding has been intiated , action cannot be performed"
        );
        _;
    }
    modifier onlyWhenNotPaused {
        require(
            pause == false ,"DreamStarterHolder: Funding is paused!"
        );
        _;
    }

    event TicketMinted(
        uint256 indexed previousSupply,
        uint256 indexed currentSupply,
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
        uint256 indexed quantity,
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
     * @param yieldRate - It is predefined rate of Returns the event organisor will give 
     * to the Token Holders after the event is finished
     * @param _baseURI - BaseURI  of  NFT for it's details
     * @param contractAddr  - first parameter is the contract stableCoin Address for recieving funds and 
     * second parameter is Accessmaster Address  for the company
     */

    constructor(
        address _proposalCreator,//1
        string memory proposalName,//2
        string memory proposalSymbol,//3
        uint256 []  memory proposalDetails,//4
        uint8 yieldRate,//5
        string memory _baseURI,//6
        address [] memory contractAddr//7
    ) ERC721A(proposalName, proposalSymbol) {
        proposalCreator = _proposalCreator;
        require(proposalDetails.length == 4,"DreamStarterHolder: Invalid Proposal Input");
        crowdFundingGoal = proposalDetails[0];
        fundingActiveTime = proposalDetails[1];
        fundingEndTime = proposalDetails[2];
        salePrice = proposalDetails[3];
        yieldBasisPoints = yieldRate;
        baseURI = _baseURI;
        require(contractAddr.length == 2,"DreamStarterHolder: Invalid Contract Input");
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
        require(value >= amount,"DreamStarterHolder: Not Enough Funds!");
        bool success = token.transferFrom(from,to,amount);
        require(success, "DreamStarterHolder: Transfer failed"); 
        emit FundsTransferred(from,to,amount);
        return success;       
    }

      /** PUBLIC/EXTERNAL Function */

    function setFundingStartTime(
        uint256 time
    )external onlyProposalCreator onlyWhenProposalIsNotActive {
        fundingActiveTime = time;
     }

    function setFundingEndTime(
        uint256 time
    )external onlyProposalCreator onlyWhenProposalIsNotActive {
        fundingEndTime = time;
     }

    function updateNFTPrice(
        uint256 price
    )external onlyProposalCreator onlyWhenProposalIsNotActive returns (uint256) {
        salePrice = price;
        return salePrice;
     }
 
    function submitMileStoneInfo(string memory data)external onlyProposalCreator {
        mileStone.push(data);
        emit MileStoneSubmitted(data);
    }

    ///@dev this function can be called only once for the intialization of first milestone funding, only by creator
    function intiateProposalFunding()external onlyProposalCreator {
        require(fundsInReserve == crowdFundingGoal && numberOfMileStones == 0,"DreamStarterHolder: Proposal cannot be intiated");
        _unpause();
    }


    /// @dev Users must utilize this tool to reject the proposal in order to get their money back 
    /// if the crowdfunding campaign is not finished in the allotted period.
    /// And it is accessible to everybody.
    function intiateRejection()  external {
        if( block.timestamp > fundingEndTime && fundsInReserve < crowdFundingGoal){
            _proposalRejection();
            isProposalCleared = true;
        }
    }


    function stake() external onlyProposalCreator onlyWhenProposalIsNotActive{
        stakingAmount = (crowdFundingGoal * 20) / 100; 
        isCreatorStaked = _transferFunds(_msgSender(),address(this),stakingAmount);
        emit Staked(stakingAmount,isCreatorStaked);
    }


    function mintTicket(uint256 quantity)external returns (uint256 prevQuntity,uint256 currentQuantity) {
        require(block.timestamp >= fundingActiveTime || block.timestamp < fundingEndTime,"DreamStarterHolder: Funding cannot be done");
        require(fundsInReserve <= crowdFundingGoal,"DreamStarterHolder: Funding goal has been reached");
        if(isCreatorStaked == false){
                _proposalRejection();
                revert DreamStarterHolder__ProposalRejected();        
        }
        prevQuntity = totalSupply();
        uint256 amount = quantity * salePrice;
        _transferFunds(_msgSender(),address(this),amount);
        fundsInReserve += amount;

        _safeMint(_msgSender(), quantity);
        emit TicketMinted(prevQuntity,totalSupply() ,_msgSender());
        currentQuantity = totalSupply();
    }

    /// @notice only Proposal  can withdraw the funds collected
    function withdrawFunds(address wallet, uint256 amount) external onlyProposalCreator onlyWhenNotPaused nonReentrant{
        uint256 val = (crowdFundingGoal * 20) / 100;
        require(amount < val && fundsInReserve > 0,"DreamStarterHolder: Amount to be collected more than staked");
        fundsInReserve -= amount;
        _pause();
        _transferFunds(address(this),wallet,amount);
        numberOfMileStones ++;
        emit FundWithdrawnByHandler(numberOfMileStones,amount,wallet);
    }

    /// validate() -> To unpause  or Reject or  to set if proposal is all cleared or not
    function claimback() external nonReentrant returns(uint256 ,bool) {
       uint nftBalance = balanceOf(_msgSender());
       uint256 amountToClaim ;
       uint256 refundValue;
       require(nftBalance > 0,"DreamStarterHolder: User is not the token owner");
       require(refundStatus[_msgSender()] == false,"DreamStarterHolder: Refund is already claimed!");
       if(fundingEndTime < block.timestamp && fundsInReserve != crowdFundingGoal){   
            refundValue = refundAmount(fundsInReserve);
            refundStatus[_msgSender()] = true;
            amountToClaim = nftBalance * refundValue;
            _transferFunds(address(this),_msgSender(),refundValue);
            emit RefundClaimed(nftBalance,_msgSender(),refundValue);
            return (refundValue,refundStatus[_msgSender()]);
       }
       else if(isProposalRejected){
            uint256 value = (crowdFundingGoal * 20) / 100;
            value += fundsInReserve;
            refundValue = refundAmount(value);
            refundStatus[_msgSender()] = true;
            amountToClaim = nftBalance * refundValue;
           _transferFunds(address(this),_msgSender(),amountToClaim);
            emit RefundClaimed(nftBalance,_msgSender(),amountToClaim);
            return (refundValue,refundStatus[_msgSender()]);
       }
       else if(isYieldReturned){
            uint256 yieldReturns = calculateYieldReturns();
            refundValue = refundAmount(yieldReturns);
            refundStatus[_msgSender()] = true;
            amountToClaim = nftBalance * refundValue;
           _transferFunds(address(this),_msgSender(),amountToClaim);
           emit RefundClaimed(nftBalance,_msgSender(),amountToClaim);
           return (refundValue,refundStatus[_msgSender()]);
       }
       else{
            revert DreamStarterHolder_ClaimedNotPossible();
       }
    }   

    function yieldSubmission() external onlyProposalCreator{
       if(isYieldReturned == true) revert DreamStarterHolder_NotEnoughFunds();
       uint256 yieldReturns = calculateYieldReturns();
       uint256 balanceOfCreator = token.balanceOf(proposalCreator);
       if(balanceOfCreator >=  yieldReturns){
            _transferFunds(_msgSender(),address(this),yieldReturns);
            isYieldReturned = true;
       }
       else{
            uint256 deficit = yieldReturns - balanceOfCreator;
            if(deficit <= stakingAmount){
                _transferFunds(_msgSender(),address(this),balanceOfCreator);
                stakingAmount -= deficit;
                isYieldReturned = true;
            }
            else{
                revert DreamStarterHolder_NotEnoughFunds();
            }
       }

    }

    function unStake() external onlyProposalCreator  returns(uint256) {
        require(isProposalCleared == true && isCreatorStaked == true,"DreamStarterHolder: User cannot withdraw funds");
        require(stakingAmount > 0,"DreamStarterHolder: Not Enough Funds");
        isCreatorStaked = false;
        _transferFunds(address(this),proposalCreator,stakingAmount);   
        return stakingAmount;     
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
        require(_exists(tokenId), "DreamStarterHolder: Non-Existent Asset");
        return baseURI;
    }

    function refundAmount(uint256 amount)public view  returns (uint256 refundValue) {
         refundValue  = amount / totalSupply();

    }

    function calculateYieldReturns()public view  returns (uint256 yield) {
        uint256 amount = (crowdFundingGoal * yieldBasisPoints) / 100;        
        yield = crowdFundingGoal + amount;
    }

    /////////////////////////////////////////////////
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721A) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
