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
    const { proposal, votesPercentage } = useProposal();
    const [amountToStake, setAmountToStake] = useState('');
    const [connectedNetwork, setConnectedNetwork] = useState(null);
    const [crowdFundingGoal, setCrowdFundingGoal] = useState(null);
    const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState(false);

    useEffect(() => {
        async function getNetwork() {
            const network = await provider.getNetwork();
            setConnectedNetwork(network.chainId);
        }
        getNetwork();
    }, []);

    useEffect(() => {
        async function fetchCrowdFundingGoal() {
            try {
                const goal = await stakingContract.crowdFundingGoal();
                console.log("name")
                console.log(ethers.utils.formatEther(goal)) // Assuming your read function is named "crowdFundingGoal"
                setCrowdFundingGoal(goal);
                
                // Calculate 20% of the goal
                const calculatedStake = goal.mul(ethers.BigNumber.from("20")).div(ethers.BigNumber.from("100"));
                setAmountToStake(ethers.utils.formatEther(calculatedStake));

            } catch (error) {
                console.error("Error fetching crowd funding goal:", error.message);
            }
        }
        
        fetchCrowdFundingGoal();
    }, [stakingContract]);

    useEffect(() => {
        async function checkIsCreatorStaked() {
            try {
                const staked = await stakingContract.isCreatorStaked(); 
                console.log(staked) // Assuming the proposal ID is needed to check
                setIsCreatorAlreadyStaked(staked);
            } catch (error) {
                console.error("Error checking if creator is staked:", error.message);
            }
        }

        if (proposal) {
            checkIsCreatorStaked();
        }
    }, [proposal, stakingContract]);

    const isMumbaiTestnet = connectedNetwork === 80001;

    async function handleContribute() {
        if (!isMumbaiTestnet) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13881' }],  // Mumbai Testnet Chain ID
                });
            } catch (error) {
                if (error.code === 4902) {
                    alert("Please connect to Mumbai testnet manually.");
                } else {
                    toast.error(`Error: ${error.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000
                    });
                }
                return;
            }
        }

        try {
            const weiAmount = ethers.utils.parseEther(amountToStake);

            // Approve the staking contract to move the user's tokens
            const approveTx = await erc20Contract.approve(stakingContractAddress, weiAmount);
            await approveTx.wait();

            // Stake the tokens
            const stakeTx = await stakingContract.stake(weiAmount);
            await stakeTx.wait();

            toast.success("Tokens staked successfully!", {
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

    if (!proposal) return <p className="text-white/80">No crowdfunding events</p>;

    return (
        <>
        <ToastContainer/>
        <div className="flex justify-center mt-8">
            <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
                <div className="text-xl font-bold">{proposal.title}</div>
                <p>{proposal.description}</p>
                {votesPercentage > 50 && (
                    <div className="mt-4">
                        {isCreatorAlreadyStaked ? (
                            <p className="text-gray-500">Creator has already staked into this proposal.</p>
                        ) : (
                            <>
                                <input 
                                    type="text"
                                    readOnly 
                                    placeholder="Suggested Contribution Amount"
                                    value={amountToStake}
                                    className="p-2 border rounded-md flex-1 mr-2 text-gray-500"
                                />
                                <button onClick={handleContribute} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                    Contribute
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default CrowdfundingEvents;
