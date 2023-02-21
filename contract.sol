// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address owner;

    enum Choice {
        ROCK,
        PAPER,
        SCISSORS
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    uint256 public contractBalance;

    constructor() payable {
        owner = msg.sender;
        contractBalance = msg.value;
    }

    event GameResult(
        address player,
        uint256 amount,
        Choice playerChoice,
        Choice contractChoice
    );

    function playGame(Choice playerChoice) public payable returns (bool) {
        //uint randomChoice = uint8(block.timestamp) % 3 + 1;
        require(msg.value > 0, "You must make bet");
        require(
            msg.value * 2 <= address(this).balance,
            "Contract don`t have money"
        );
        Choice contractChoice = Choice(uint8(block.timestamp) % 3);
        emit GameResult(msg.sender, msg.value, playerChoice, contractChoice);
        if (
            (playerChoice == Choice.ROCK &&
                contractChoice == Choice.SCISSORS) ||
            (playerChoice == Choice.PAPER && contractChoice == Choice.ROCK) ||
            (playerChoice == Choice.SCISSORS && contractChoice == Choice.PAPER)
        ) {
            payable(msg.sender).transfer(msg.value * 2);
            return true;
        } else if (playerChoice == contractChoice) {
            payable(msg.sender).transfer(msg.value);
        }
        return false;
    }

    function deposit() public payable {
        contractBalance += msg.value;
    }

    function withdraw() public onlyOwner {
        require(contractBalance > 0, "Contract dont have money");
        payable(msg.sender).transfer(address(this).balance);
        contractBalance = 0;
    }
}
