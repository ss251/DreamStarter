"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useProposal } from "@/app/ProposalProvider";

// Import ABIs
import DreamStarterCollabABI from '../../../../abi/DreamStarterCollab.json'
import MyTokenABI from '../../../../abi/MyToken.json'

const erc20ContractAddress = '0x8563F7BD1fa85cB75EFB8e710D3971dC3e3C5C8b';
const stakingContractAddress = '0x6E23d299E066996E3f24322A0636786E4c892030';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const erc20Contract = new ethers.Contract(erc20ContractAddress, MyTokenABI, signer);
const stakingContract = new ethers.Contract(stakingContractAddress, DreamStarterCollabABI, signer);

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrowdfundingEvents = () => {
    const { proposal } = useProposal();
    const [connectedNetwork, setConnectedNetwork] = useState(null);
    const [salePrice, setSalePrice] = useState(null);
    const [crowdFundingGoal, setCrowdFundingGoal] = useState(null);
    const [totalFunding, setTotalFunding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  
    const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState(false);

    useEffect(() => {
        async function getNetwork() {
            const network = await provider.getNetwork();
            setConnectedNetwork(network.chainId);
        }
        getNetwork();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const price = await stakingContract.salePrice();
                setSalePrice(ethers.utils.formatEther(price));

                const goal = await stakingContract.crowdFundingGoal();
                setCrowdFundingGoal(goal);

                const totalSupply = await stakingContract.totalSupply();
                const nftFunding = totalSupply.mul(price);

                let total = nftFunding;

                if (isCreatorAlreadyStaked) {
                    const stakedAmount = goal.mul(ethers.BigNumber.from("20")).div(ethers.BigNumber.from("100"));
                    total = total.add(stakedAmount);
                }

                setTotalFunding(ethers.utils.formatEther(total));

            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [stakingContract, isCreatorAlreadyStaked]);

    useEffect(() => {
        async function checkIsCreatorStaked() {
            try {
                const staked = await stakingContract.isCreatorStaked(); 
                setIsCreatorAlreadyStaked(staked);
            } catch (error) {
                console.error("Error checking if creator is staked:", error.message);
            }
        }

        if (proposal) {
            checkIsCreatorStaked();
        }
    }, [proposal, stakingContract]);

    async function handleMint() {
        try {
            const weiSalePrice = ethers.utils.parseEther(salePrice);
    
            // Approve the staking contract
            const approveTx = await erc20Contract.approve(stakingContractAddress, weiSalePrice);
            await approveTx.wait();
    
            // Mint the token
            const mintTx = await stakingContract.mintTicket();
            await mintTx.wait();
    
            toast.success("Token minted successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });
        } catch (error) {
            toast.error(`Error: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });
        }
    }
    

    if (isLoading) {
        return <p>Loading...</p>;  // Display a loading message when isLoading is true
    }

    const fundingProgress = totalFunding ? (parseFloat(totalFunding) / parseFloat(ethers.utils.formatEther(crowdFundingGoal))) * 100 : 0;

    if (!proposal) return <p className="text-white/80">No crowdfunding events</p>;

    return (
        <>
            <ToastContainer />
            <div className="flex justify-center mt-8">
                <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
                    <div className="text-xl font-bold">{proposal.title}</div>
                    <p>{proposal.description}</p>
                    <div className="mt-4">
                        <button onClick={handleMint} className="px-4 py-2 bg-green-500 text-white rounded-md">
                            Mint NFT
                        </button>
                    </div>
                    <div className="mt-4">
                        <p>Funding Progress:</p>
                        <div className="w-full h-4 bg-gray-300 rounded">
                            <div style={{ width: `${fundingProgress}%` }} className="h-full bg-blue-500 rounded"></div>
                        </div>
                        <p>{totalFunding}/{ethers.utils.formatEther(crowdFundingGoal)} ETH</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrowdfundingEvents;
