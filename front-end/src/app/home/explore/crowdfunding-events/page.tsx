"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useProposal } from "@/app/ProposalProvider";

// Import ABIs
import DreamStarterCollabABI from '../../../../abi/DreamStarterCollab.json'
import MyTokenABI from '../../../../abi/MyToken.json'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let erc20ContractAddress = '';
let stakingContractAddress = '';
let provider: ethers.providers.Web3Provider | null = null;
let signer = null;
let erc20Contract: ethers.Contract;
let stakingContract: ethers.Contract;

const CrowdfundingEvents = () => {
    const { proposal } = useProposal();
    const [connectedNetwork, setConnectedNetwork] = useState<number | null>(null);
    const [salePrice, setSalePrice] = useState<string | null>(null);
    const [crowdFundingGoal, setCrowdFundingGoal] = useState<string | null>(null);
    const [totalFunding, setTotalFunding] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState(false);

    useEffect(() => {
        erc20ContractAddress = '0x8563F7BD1fa85cB75EFB8e710D3971dC3e3C5C8b';
        stakingContractAddress = '0x6E23d299E066996E3f24322A0636786E4c892030';

        if (typeof window !== 'undefined' && window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            
            erc20Contract = new ethers.Contract(erc20ContractAddress, MyTokenABI, signer);
            stakingContract = new ethers.Contract(stakingContractAddress, DreamStarterCollabABI, signer);
        }
    }, []);

    useEffect(() => {
        async function getNetwork() {
            if (provider) {
                const network = await provider.getNetwork();
                setConnectedNetwork(network.chainId);
            }
        }
        getNetwork();
    }, [provider]);

    useEffect(() => {
        async function fetchData() {
            try {
                const price = await stakingContract.salePrice();
                setSalePrice(ethers.utils.formatEther(price));

                const goal = await stakingContract.crowdFundingGoal();
                setCrowdFundingGoal(ethers.utils.formatEther(goal));

                const totalSupply = await stakingContract.totalSupply();
                const nftFunding = totalSupply.mul(price);

                let total = nftFunding;

                if (isCreatorAlreadyStaked) {
                    const stakedAmount = goal.mul(ethers.BigNumber.from("20")).div(ethers.BigNumber.from("100"));
                    total = total.add(stakedAmount);
                }

                setTotalFunding(ethers.utils.formatEther(total));

            } catch (error: any) {
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
            } catch (error: any) {
                console.error("Error checking if creator is staked:", error.message);
            }
        }

        if (proposal) {
            checkIsCreatorStaked();
        }
    }, [proposal, stakingContract]);

    async function handleMint() {
        try {
            const weiSalePrice = ethers.utils.parseEther(salePrice!);

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
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const fundingProgress = totalFunding ? (parseFloat(totalFunding) / parseFloat(crowdFundingGoal!)) * 100 : 0;

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
                        <p>{totalFunding}/{crowdFundingGoal} ETH</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrowdfundingEvents;
