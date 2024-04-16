const {
    Client,
    PrivateKey,
    AccountId,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
  } = require("@hashgraph/sdk");
  
  require("dotenv").config();     

  async function main(){

    //client configuration 
    // const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204202eee18d8eea7b8d3e947f55cf6917ffcdd0895f6a8e513956a3fa7b0a50f0")
    const operatorKey = PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY)

    const operatorId = AccountId.fromString("0.0.4229105");

    let client = Client.forTestnet();
    client.setOperator(operatorId , operatorKey);

      //Create the NFT
const nftCreate = await new TokenCreateTransaction()
.setTokenName("Iqraa")
.setTokenSymbol("IQR")
.setTreasuryAccountId(operatorId)
.setInitialSupply(5000)

.freezeWith(client);

//Sign the transaction with the treasury key
const nftCreateTxSign = await nftCreate.sign(operatorKey);

//Submit the transaction to a Hedera network
const nftCreateSubmit = await nftCreateTxSign.execute(client);

//Get the transaction receipt
const nftCreateRx = await nftCreateSubmit.getReceipt(client);

//Get the token ID
const tokenId = nftCreateRx.tokenId;

//Log the token ID
console.log(`- Created NFT with Token ID: ${tokenId} \n`);



const receiverId = AccountId.fromString("0.0.4229105")


//Create the transfer transaction
const transaction = await new TransferTransaction()
.addTokenTransfer(tokenId, operatorId, -10)

.addTokenTransfer(tokenId, receiverId, 10)

.freezeWith(client);

//Sign with the sender account private key

const signTx = await transaction.sign(operatorKey);

//Sign with the client operator private key and submit to a Hedera network

const txResponse = await signTx.execute(client);

  
//Create the query

const query = new AccountBalanceQuery()

.setAccountId(operatorId);

//Sign with the client operator private key and submit to a Hedera network

const tokenBalance = await query.execute(client);

console.log("The token balance(s) for this account: " +tokenBalance.tokens);



    


  }

  main();