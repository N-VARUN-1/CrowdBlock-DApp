// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract CrowdFunding {
    struct Campaign {
        address payable owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountRaised;
        bool withdrawn;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 campaignId,
        address owner,
        string title,
        uint256 targetAmount,
        uint256 deadline
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _targetAmount,
        uint256 _duration
    ) external returns (uint256) {
        require(_targetAmount > 0, "Target Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        // require(
        //     _duration >= 1 days,
        //     "Campaign duration must be at least 1 day"
        // );
        // require(_targetAmount > 0, "Target Amount must be greater than 0");

        campaignCount++;

        uint256 deadline = block.timestamp + _duration;

        campaigns[campaignCount] = Campaign({
            owner: payable(msg.sender),
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            deadline: deadline,
            amountRaised: 0,
            withdrawn: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _targetAmount,
            deadline
        );

        return campaignCount;
    }

    function contributeToCampaign(uint256 _campaignCount) external payable {
        require(
            campaigns[_campaignCount].owner != address(0),
            "Campaign does not exist"
        );
        require(msg.value > 0, "Contributions must be greater than 0");

        Campaign storage chosenCampaign = campaigns[_campaignCount];

        require(block.timestamp <= chosenCampaign.deadline, "Campaign Expired");

        chosenCampaign.amountRaised += msg.value; // ethers or amount that user contributed
    }

    function withDrawFunds(
        uint256 _campaignId,
        address _owner
    ) external payable {
        Campaign storage currentCampaign = campaigns[_campaignId];
        require(msg.sender == _owner, "Access Unauthorized");
        require(
            block.timestamp > currentCampaign.deadline,
            "Campaign Still active"
        );

        require(
            currentCampaign.amountRaised >= currentCampaign.targetAmount,
            "Target Amount Not Reached"
        );
        require(!currentCampaign.withdrawn, "You have already withdrawn funds");

        uint256 amount = currentCampaign.amountRaised;

        currentCampaign.owner.transfer(amount);
    }

    function getCampaignDetails(
        uint256 _campaignId
    )
        external
        view
        returns (
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        Campaign memory chosenCampaign = campaigns[_campaignId];

        return (
            chosenCampaign.owner,
            chosenCampaign.title,
            chosenCampaign.description,
            chosenCampaign.targetAmount,
            chosenCampaign.deadline,
            chosenCampaign.amountRaised,
            chosenCampaign.withdrawn
        );
    }
}
