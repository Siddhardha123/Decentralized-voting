import React, { useState, useEffect } from "react";
import { getFilesFromPath } from 'web3.storage';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import { create as ipfsHttpClient } from "ipfs-http-client";
import { Web3Storage } from 'web3.storage';
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";
const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE3NjZEMTNDREQ4MzQ0YTk0NzA0MTM2QUNmMkMwZjY1QjQ0NzIyQkUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjQyOTMxNTk0NDUsIm5hbWUiOiJ2b3RpbmcifQ.SFhKQ88BoXdnZ8DNcdzi__HN59MYokoERW0wTs5mI08"

const client = new Web3Storage({ token: apiToken });
// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  // =========================================================
  //---ERROR Message
  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);
  ///CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      getAllVoterData();
      getNewCandidate();
    } else {
      setError("Please Install MetaMask & Connect, Reload");
    }
  };

  // ===========================================================
  //CONNECT WELATE
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    getAllVoterData();
    getNewCandidate();
  };
  // ================================================

  //UPLOAD TO IPFS Voter
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.put(file);
      const url = `https://${added}.ipfs.w3s.link/${files[0]}`;
      console.log('stored files with cid:', cid);
      console.log(url);
    return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };

  //UPLOAD TO IPFS Candidate
  const uploadToIPFSCandidate = async (file) => {
    try {
      const cid = await client.put(file);
      const url = `https://${cid}.ipfs.w3s.link/${file[0].name}`;
      console.log('stored files with cid:',cid);
      console.log(url);
      return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
      console.log(error.message)
    }
  };
  // =============================================
  //CREATE VOTER----------------------
  const createVoter = async (formInput, fileUrl) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position)
      return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = new Blob([JSON.stringify({ name, address, position, image: fileUrl, fileID})], { type: 'application/json' });
    const files = [new File([data], fileID)];
    const added = await client.put(files);
    console.log('FILE ID: ', fileID);
    const url = `https://${added}.ipfs.w3s.link/${fileID}`;
    const voter = await contract.voterRight(address, name, url, fileUrl);
    voter.wait();

    router.push("/voterList");
  };
  // =============================================

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //VOTR LIST
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        pushVoter.push(singleVoterData);
      });

      //VOTER LENGHT
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());
      console.log(voterLength);
    } catch (error) {
      console.log("All data");
    }
  };

  // =============================================

  // =============================================
  ////////GIVE VOTE

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      setError("Sorry!, You have already voted, Reload Browser");
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = new Blob([JSON.stringify({
      name,
      address,
      image: fileUrl,fileID,
      age
    })],{ type: 'application/json' });
    const files = [new File([data], fileID)];
    const added = await client.put(files);
    const ipfs = `https://${added}.ipfs.w3s.link/${fileID}`;
    // const ipfs = `https://ipfs.infura.io/ipfs/${added.path}`;

    const candidate = await contract.setCandidate(
      address,
      age,
      name,
      fileUrl,
      ipfs
    );
    candidate.wait();

    router.push("/");
  };

  const getNewCandidate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    //---------ALL CANDIDATE
    const allCandidate = await contract.getCandidate();

    //--------CANDIDATE DATA
    allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidateData(el);

      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());
    });

    //---------CANDIDATE LENGTH
    const allCandidateLength = await contract.getCandidateLength();
    setCandidateLength(allCandidateLength.toNumber());
  };

  console.log(error);

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createVoter,
        setCandidate,
        getNewCandidate,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
