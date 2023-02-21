const contractAddress = "0xe36ECcCD7b1b5f889BAf957B154148DD1f02De8c";
const contractABI = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum RockPaperScissors.Choice",
				"name": "playerChoice",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RockPaperScissors.Choice",
				"name": "contractChoice",
				"type": "uint8"
			}
		],
		"name": "GameResult",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "enum RockPaperScissors.Choice",
				"name": "playerChoice",
				"type": "uint8"
			}
		],
		"name": "playGame",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97)//ChainID 97 BNBtestnet
let signer;
let contract;

const event = "GameResult";

provider.send("eth_requestAccounts", []).then(()=>{
    provider.listAccounts().then( (accounts) => {
        signer = provider.getSigner(accounts[0]); //account in metamask
        
        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        )
     
    }
    )
}
)


const playerChoiceSelect = document.getElementById("player-choice");
const playButton = document.getElementById("play-button");
const eventButton = document.getElementById("event-list");
let choices = ["Rock", "Paper", "Scissors"]

playButton.addEventListener("click", async () => {
    //event.preventDefault();
    const playerChoice = playerChoiceSelect.value;
    let amountInEth = document.getElementById("bet-amount").value;
    let amountInWei = ethers.utils.parseEther(amountInEth.toString())
    console.log(amountInWei);

    let resultOfGame = await contract.playGame(playerChoice, {value: amountInWei});
    const res = await resultOfGame.wait();
    console.log(res);

    let queryResult =  await contract.queryFilter('GameResult', await provider.getBlockNumber() - 5000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    //console.log(queryResult[queryResult.length-1].args);

    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.playerChoice.toString();
    let result = await queryResultRecent.args.contractChoice.toString();

    let winner;

    if (option == 0 && result == 2 ||  option == 1 && result == 0 || option == 2 && result == 1){
        winner = 'you win';
    } else if (option == result){
        winner = 'tie';
    } else {
        winner = 'you lose';
    }

    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
    player chose: ${choices[option]}, 
    contract chose: ${choices[result]},
    Result: ${winner}`;
    console.log(resultLogs);

    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;

});

eventButton.addEventListener("click", async () => {

    let queryResult =  await contract.queryFilter('GameResult', await provider.getBlockNumber() - 5000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.playerChoice.toString();
    let result = await queryResultRecent.args.contractChoice.toString();

    let winner;

    if (option == 0 && result == 2 ||  option == 1 && result == 0 || option == 2 && result == 1){
        winner = 'you win';
    } else if (option == result){
        winner = 'tie';
    } else {
        winner = 'you lose';
    }
   

    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
    player chose: ${choices[option]}, 
    contract chose: ${choices[result]},
    Result: ${winner}`;
    console.log(resultLogs);

    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;
    
});

