import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useProposal } from "@/app/ProposalProvider";

import DreamStarterCollabABI from '../../../../abi/DreamStarterCollab.json'
import MyTokenABI from '../../../../abi/MyToken.json'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Move these inside a useEffect
let erc20ContractAddress = '';
let stakingContractAddress = '';
let provider: ethers.providers.Web3Provider | null = null;
let signer = null;
let erc20Contract: ethers.Contract
let stakingContract: ethers.Contract

type Proposal = {
    title: string;
    description: string;
};

type UseProposal = {
    proposal: Proposal | null;
    votesPercentage: number;
};

type ExtendedError = Error & { code?: number };

const CrowdfundingEvents = () => {
    const { proposal, votesPercentage }: UseProposal = useProposal();
    const [amountToStake, setAmountToStake] = useState<string>('');
    const [connectedNetwork, setConnectedNetwork] = useState<number | null>(null);
    const [crowdFundingGoal, setCrowdFundingGoal] = useState<ethers.BigNumber | null>(null);
    const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState<boolean>(false);

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
        async function fetchCrowdFundingGoal() {
            try {
                const goal = await (stakingContract).crowdFundingGoal();
                console.log("name")
                console.log(ethers.utils.formatEther(goal))
                setCrowdFundingGoal(goal);

                const calculatedStake = goal.mul(ethers.BigNumber.from("20")).div(ethers.BigNumber.from("100"));
                setAmountToStake(ethers.utils.formatEther(calculatedStake));

            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error fetching crowd funding goal:", error.message);
                } else {
                    console.error("Error fetching crowd funding goal:", error);
                }
            }
        }

        fetchCrowdFundingGoal();
    }, [stakingContract]);

    useEffect(() => {
        async function checkIsCreatorStaked() {
            try {
                const staked = await stakingContract.isCreatorStaked(); 
                console.log(staked)
                setIsCreatorAlreadyStaked(staked);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error checking if creator is staked:", error.message);
                } else {
                    console.error("Error checking if creator is staked:", error);
                }
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
                const err = error as ExtendedError;
                if (err.code === 4902) {
                    alert("Please connect to Mumbai testnet manually.");
                } else {
                    toast.error(`Error: ${err.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000
                    });
                }
                return;
            }
        }

        try {
            const weiAmount = ethers.utils.parseEther(amountToStake);

            const approveTx = await erc20Contract.approve(stakingContractAddress, weiAmount);
            await approveTx.wait();

            const stakeTx = await stakingContract.stake(weiAmount);
            await stakeTx.wait();

            toast.success("Tokens staked successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });
        } catch (error) {
            const err = error as ExtendedError;
            toast.error(`Error: ${err.message}`, {
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
