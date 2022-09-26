import React,{useState,useEffect} from 'react';
import Web3Modal from 'web3modal';
import ethers from "ethers";
import {create as ipfsHttpClient} from "ipfs-http-client";
import axios from 'axios';
import useRouter from "next/router";
import VotingAddress  from './Constants';
import VotingAddressABI from './Constants';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress,VotingAddressABI,signerOrProvider);
  export const VotingContext = React.createContext();
  export const VotingProvider = ({children}) =>{
        const router = useRouter;
        const [currentAccount,setCurrentAccount] = useState('');
        const [candidateLength,setCandidatelength] = useState('');
        const pushCandidate = [];
        const  candidateIndex = [];
        const [candidateArray,setCandidateArray] = useState(pushCandidate);
        // candidate data ends 
        const [error,setError] = useState('');
        const higestVote = [];
        // voters section
        const pushVoter = [];
        const [voterArray,setVoterArray] = useState(pushVoter);
        const [voterLength,setVoterLength] = useState('');
        const [voterAddress,setVoterAddress] = useState([]);
     // connecting metamask
     const checkIfWalletIsConnected = async() =>{
         if(!window.ethereum) return setError("please install metamask")
         const account = await window.ethereum.request({method:"eth_accounts"})
         if(account.length){
            setCurrentAccount(account[0]);
         } else{
            setError("Please Install MetaMask and connect , Reload");
         }
     };
     // connect wallet
     const connectWallet = async()=>{
        if(!window.ethereum) return setError("please Install metamask")
        const account = await window.ethereum.request({method:"eth_requestAccounts"});
        setCurrentAccount(account[0]);
     }
     // upload to ipfs 
       const uploadToIPFS = async(file)=>{
           try{
             const added = await client.add({content: file})
             const url = `https://ipfs.infura.io/ipfs/${added.path}`;
             return url;
           }catch(error){
            setError("error uploading file to ipfs")
           }
       }

     return(
        <VotingContext.Provider value={{checkIfWalletIsConnected,connectWallet,uploadToIPFS}}>
            {children}
        </VotingContext.Provider>
     );
  }

