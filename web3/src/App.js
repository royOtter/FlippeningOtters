import logo from './logo.svg';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
import { useWeb3React } from '@web3-react/core'
import { injected } from "./connectors"
import Web3 from 'web3';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

var abi = [{"inputs":[{"internalType":"address","name":"ethFeed","type":"address"},{"internalType":"address","name":"btcFeed","type":"address"},{"internalType":"address","name":"vrfLinkToken","type":"address"},{"internalType":"address","name":"vrfCoordinator","type":"address"},{"internalType":"bytes32","name":"keyHash","type":"bytes32"},{"internalType":"uint256","name":"linkFee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"FLIPPENING_OTTER_TOKEN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_AIR_DROP_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_COMPANION_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_GIVE_AWAY_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_MINT_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_PRESALE_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_PRESALE_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OTTER_WING_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"entries","type":"address[]"}],"name":"addToPresaleList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"receivers","type":"address[]"}],"name":"airDrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"airDropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"checkUpkeep","outputs":[{"internalType":"bool","name":"upkeepNeeded","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"companionsAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"s1","type":"string"},{"internalType":"string","name":"s2","type":"string"}],"name":"compare","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"entries","type":"address[]"}],"name":"decreaseGiveAwayBudget","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalShifter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalizeMinting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipped","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRandomNumber","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"giveAwayAmountMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"giveAwayBuy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"giveAwayListAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"giveAwayLive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gnosis_safe","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"entries","type":"address[]"}],"name":"increaseGiveAwayBudget","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isFlipped","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"locked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenQuantity","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintingFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"performUpkeep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenQuantity","type":"uint256"}],"name":"presaleBuy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"presaleLive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"presalerListAlloc","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"privateAmountMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomResult","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"},{"internalType":"uint256","name":"randomness","type":"uint256"}],"name":"rawFulfillRandomness","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"entries","type":"address[]"}],"name":"removeFromPresaleList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleLive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"URI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"URI","type":"string"}],"name":"setContractURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"setDesstinationAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setEnableKeeper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setOtterMintPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"toggleCompanionsAvailable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toggleGiveAwayStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"togglePresaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toggleSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toggleWingsAvailable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToAddons","outputs":[{"internalType":"string","name":"wing","type":"string"},{"internalType":"string","name":"companion","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToImageId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAmountMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"companionType","type":"string"}],"name":"updateCompanion","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"keyHash","type":"bytes32"}],"name":"updateKeyHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"linkFee","type":"uint256"}],"name":"updateLinkFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"wingType","type":"string"}],"name":"updateWing","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"wingsAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

var contractAddress = '0xAEfB629E256Ea78954c1E58Abc0BA6ea46939430';

let web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/424b1575eaa24cceb235a16490bc2776") ;//"https://rinkeby.infura.io/v3/424b1575eaa24cceb235a16490bc27765");


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: "#FCCBCA",
  border: 'none',
  tableContainer: {
    boxShadow: "none"
  }
}));

function App() {
  const [txId, setTxId] = useState("");
  const [waitingGif, setWaitingGif] = useState(false);

  
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  var quantity = 0;
  
  async function connect() {
    try {
      await activate(injected);
      web3.eth.getAccounts().then((response)=> {
        web3.eth.defaultAccount = response[0];
      });
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  function handleChange(e) {
    quantity = e.target.value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(quantity <= 0) {
      alert("Quantity should be positive");
      return;
    } 
    setTxId("");
    setWaitingGif(true);
    var flippening_otter = new web3.eth.Contract(abi, contractAddress);
    // flippening_otter.defaultChain = 'rinkeby';
    // console.log(quantity);
    // await flippening_otter.methods.call({from:web3.eth.defaultAccount});
    var price = 10000000000000000 * quantity
    let result = await flippening_otter.methods.mint(quantity).send({from:web3.eth.defaultAccount,
           value:price});
    console.log(result);
    setTxId(result.transactionHash);
    setWaitingGif(false);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <img id="logo" alt="" src="https://www.flippeningotters.io/gallery/Logo_Horizontal_Black-Yellow-ts1634056054.svg" />
      </Grid>
      <Grid item xs={3}>
        {active ? <button onClick={disconnect} className="button" id="wallet">Disconnect<br />Wallet</button> : ""}
      </Grid>
      <Grid item xs={3}>
        {active ? <label className="connection">Connected with <b>{account}</b></label> : <label className="connection">Not connected</label>}
      </Grid>
      <Grid item xs={12}  style={{ textAlign: 'center'}} alignItems="center"
        justifyContent="center">
        { active ?
        (<form onSubmit={handleSubmit} className="form">
            <label>
              Quantity:   
              <input className="input" type="number" name="name" onChange={handleChange}/>
            </label>
            <input className= "button" type="submit" value="Mint" />
      </form>)
      : <button onClick={connect} className="button" >Connect<br />Wallet</button>}
      </Grid>
      <Grid item xs={12}  style={{ textAlign: 'center'}} alignItems="center"
        justifyContent="center">
        { waitingGif ? <CircularProgress />:  "" }
      </Grid>
      <Grid item xs={12}  style={{ textAlign: 'center'}} alignItems="center"
        justifyContent="center">
        { txId !== "" ?`Your transaction id is ${txId}`:  "" }
      </Grid>
    </Grid>
  );
}

export default App;
