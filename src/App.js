import Web3, { fromGwei } from "web3";
import './App.css';
import { useEffect, useState } from 'react';

window.addEventListener('load', async () => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
   if (window.ethereum) {
     const web3 = new Web3(window.ethereum);
     try {
       // Request account access if needed
       await window.ethereum.enable();
       // Acccounts now exposed
       return web3;
     } catch (error) {
       console.error(error);
     }
   }
   // Legacy dapp browsers...
   else if (window.web3) {
     // Use Mist/MetaMask's provider.
     const web3 = window.web3;
     console.log('Injected web3 detected.');
     return web3;
   }
   // Fallback to localhost; use dev console port by default...
   else {
     const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
     const web3 = new Web3(provider);
     console.log('No web3 instance injected, using Local web3.');
     return web3;
   }
 });

const App = () => {
  const [accountData, setAccountData] = useState("");
  useEffect(() => {
    const loadBlockchainData = async () => {
      if(typeof window.ethereum!=='undefined'){
        const web3 = new Web3(window.ethereum);
        const netId = await web3.eth.net.getId();
        console.log(netId);
        const accounts = await web3.eth.getAccounts();
  
        //load balance
        if(typeof accounts[0] !=='undefined'){
          const balance = await web3.eth.getBalance(accounts[0])
          setAccountData({account: accounts[0], balance: balance, web3: web3});
        } else {
          window.alert('Please login with MetaMask')
        }
      } else {
        window.alert('Please install MetaMask')
      }
    };
    loadBlockchainData();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>{accountData.account}</p>
        <p>{accountData.balance ? `${Web3.utils.fromWei(accountData.balance.toString(), "ether")} ETH` : ""}</p>
      </header>
    </div>
  );
}

export default App;
