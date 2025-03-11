import React, { useEffect, useState } from 'react';
import { Sidebar, Spinner, Progress } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiMenu, HiFlag, HiGift, HiCurrencyRupee, HiCash } from "react-icons/hi";
import {
    FaEthereum
} from "react-icons/fa";

import { Card } from "flowbite-react";
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';
import { contractABI } from '../Config/config';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';


export default function ResponsiveSidebar() {
    const [contract, setContract] = useState(null)
    // const [campaignCount, setCampaignCount] = useState(0);
    const [campaigns, setCampaigns] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const { wallet } = useSelector(state => state.wallet);

    const CONTRACT_ADDRESS = import.meta.env.VITE_DEPLOYMENT_ADDRESS;

    const [isLoading, setIsLoading] = useState(false);

    const connectWallet = async () => {
        try {
            // Check if Ethereum provider is available
            if (!window.ethereum) {
                console.error("Ethereum provider not found");
                return;
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Create provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Create contract instance
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

            setContract(contract);
            return contract;

            // Fetch campaign count using the correct method
            // const count = await contract.campaignCount();

            // // Convert BigInt to number
            // const campaignCount = Number(count);
            // setCampaignCount(campaignCount);
            // console.log(campaignCount)

            // // Fetch campaign details
            // const campaignDetails = [];
            // for (let i = 1; i <= campaignCount; i++) {
            //     try {
            //         const campaign = await contract.getCampaignDetails(i);
            //         campaignDetails.push({
            //             owner: campaign[0],
            //             title: campaign[1],
            //             description: campaign[2],
            //             targetAmount: campaign[3].toString(),
            //             deadline: campaign[4],
            //             amountRaised: campaign[5].toString(),
            //             withdrawn: campaign[6]
            //         });
            //     } catch (campaignError) {
            //         console.error(`Error fetching campaign ${i}:`, campaignError);
            //     }
            // }

            // setCampaigns(campaignDetails);
        } catch (error) {
            console.error("Error connecting wallet", error);

            // More detailed error handling
            if (error.code === "ACTION_REJECTED") {
                alert("You rejected the connection request");
            } else {
                alert("An error occurred while connecting wallet");
            }
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    useEffect(() => {
        // const fetchCampaignDetails = async (req, res) => {
        //     setIsLoading(true)
        //     try {
        //         const response = await fetch(`/api/campaign/get-campaign-details/${currentUser.userId}`);
        //         if (!response) {
        //             throw new Error('Failed to fetch campaigns');
        //         }

        //         const data = await response.json();
        //         setCampaigns(data);
        //         setIsLoading(false)
        //     } catch (error) {
        //         console.log(error.message);
        //     }
        // };

        const fetchCampaignDetails = async () => {
            setIsLoading(true);
            try {
                // console.log(currentUser.userId)
                const response = await fetch(`https://crowd-block-d-app.vercel.app/api/campaign/get-campaign-details/${currentUser.userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch campaigns');
                }

                const data = await response.json();

                // If no campaigns, set to empty array and stop loading
                if (data.length === 0) {
                    setCampaigns([]);
                    setIsLoading(false);
                    return;
                }

                // If campaigns exist, proceed with enriching
                const enrichedCampaigns = await Promise.all(
                    data.map(async (campaign) => {
                        try {
                            const details = await contract.getCampaignDetails(campaign.campaignId);
                            const [
                                owner,
                                title,
                                description,
                                targetAmount,
                                deadline,
                                amountRaised,
                                withdrawn,
                            ] = details;

                            const targetAmountEther = ethers.formatEther(targetAmount);
                            const amountRaisedEther = ethers.formatEther(amountRaised);

                            const progressPercentage = targetAmountEther > 0
                                ? (amountRaisedEther / targetAmountEther) * 100
                                : 0;

                            return {
                                ...campaign,
                                title,
                                description,
                                targetAmountEther,
                                amountRaised: ethers.formatEther(amountRaised),
                                withdrawn,
                                progressPercentage: progressPercentage.toFixed(2),
                            };
                        } catch (error) {
                            console.error(`Error fetching details for campaign ${campaign.campaignId}:`, error);
                            return campaign;
                        }
                    })
                );

                setCampaigns(enrichedCampaigns);
                setIsLoading(false);

            } catch (error) {
                console.error('Error fetching campaigns:', error);
                setCampaigns([]);
                setIsLoading(false);
            }
        };

        fetchCampaignDetails();
    }, [contract]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='min-h-screen'>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleSidebar}
                className="flex gap-3 md:hidden ml-8 z-50 p-2 bg-lime-400 dark:bg-gray-800 rounded-lg"
            >
                <HiMenu className="w-6 h-6" />
                <span className='font-semibold'>Dashboard</span>
            </button>

            <div className='h-screen mb-3 flex flex-1 overflow-hidden'>
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    className={`
                    fixed top-0 left-0 z-[999] h-screen transition-transform duration-300 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:block 
                    dark 
                    w-auto 
                    shadow-lg
                    mb-4 ml-3
                    rounded-xl
                `}
                    aria-label="Responsive sidebar"
                >
                    {/* Close button for mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="h-10 w-10 md:hidden absolute top-4 right-4 p-2 bg-lime-400 dark:bg-lime-400 rounded-lg"
                    >
                        &times;
                    </button>

                    <Sidebar.Items className="mt-12 md:mt-0">
                        <Card href="#" className="dark:border-lime-400 max-w-sm">
                            <div className="flex flex-col">
                                <h5 className='text-lime-400 font-bold text-3xl'>Welcome!</h5>
                                <span className='text-lime-400 font-semibold text-md'>-{currentUser.userId}</span>
                            </div>
                            <div className="mt-1.5 flex flex-col">
                                <span className='font-semibold text-gray-500 dark:text-gray-200'>Wallet Address:</span>
                                <span className='text-lime-400'>
                                    {wallet && wallet.address
                                        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                                        : 'No Wallet Connected'}
                                </span>
                            </div>
                        </Card>
                        <Sidebar.ItemGroup>

                            <Link to="/user-profile">
                                <Sidebar.Item className='font-semibold'>
                                    <div className='flex items-center gap-4 justify-start '>
                                        <HiChartPie
                                            className='text-lime-400 text-xl'
                                        />
                                        <span className='text-lg'>Dashboard</span>
                                    </div>
                                </Sidebar.Item>
                            </Link>

                            <Link to="/create-campaign">
                                <Sidebar.Item className='font-semibold' label="Pro" labelColor="lime">
                                    <div className='flex items-center gap-4 justify-start '>
                                        <HiFlag
                                            className='text-lime-400 text-xl'
                                        />
                                        <span className='pr-4 flex flex-col '>Create Your <span> Campaign</span></span>
                                    </div>
                                </Sidebar.Item>
                            </Link>

                            <Link to="/contribute-campaign">
                                <Sidebar.Item className='font-semibold' label="3">
                                    <div className='flex items-center gap-4 justify-start '>
                                        <FaEthereum
                                            className='text-lime-400 text-xl'
                                        />
                                        <span className='pr-4 flex flex-col '>Contribute to<span>Campaign</span></span>
                                    </div>
                                </Sidebar.Item>
                            </Link>

                            <Link to='/withdraw-campaign'>
                                <Sidebar.Item className='font-semibold'>
                                    <div className='flex items-center gap-4 justify-start '>
                                        <FaEthereum
                                            className='text-lime-400 text-xl'
                                        />
                                        <span className='pr-4 flex flex-col '>Withdraw</span>
                                    </div>

                                </Sidebar.Item>
                            </Link>

                        </Sidebar.ItemGroup>
                    </Sidebar.Items >
                </Sidebar >


                {/* Main content area */}
                <main className="h-screen w-full overflow-y-auto" >
                    <div className=''>
                        {isLoading ? (
                            <div className='h-screen flex items-center justify-center'>
                                <Spinner className='text-lime-400 h-[50px] w-[50px]]' />
                            </div>
                        ) : (
                            campaigns.length === 0 ? (
                                <p className='flex justify-center items-center m-5 font-bold text-lime-400'>No campaigns created!</p>
                            ) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4'>
                                    {campaigns.map((campaign) => (
                                        <Card
                                            href="#"
                                            key={campaign.campaignId}
                                            className="z-10 max-w-md bg-gray-800 m-3 hover:border-lime hover:bg-gray-800 border-none rounded-lg shadow-md hover:shadow-2xl overflow-hidden transition-transform transform hover:scale-105"
                                        >
                                            <div className="p-1">
                                                {campaign.photo && (
                                                    <img
                                                        src={`data:image/jpeg;base64,${campaign.photo}`}
                                                        alt={campaign.title}
                                                        className="w-full aspect-[16/9] object-center rounded-lg mb-4"
                                                    />
                                                )}
                                                <h5 className="flex items-center justify-center text-xl sm:text-2xl font-bold tracking-tight text-lime-400 dark:text-white mb-2">
                                                    {campaign.title}
                                                </h5>
                                                <p className="flex items-center justify-center text-sm sm:text-md font-semibold text-white dark:text-gray-400 mb-4 px-2">
                                                    {campaign.description.split(" ").length <= 30
                                                        ? campaign.description
                                                        : "Description must contain maximum 30 words."}
                                                </p>
                                                <p className="pt-4 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold text-white dark:text-gray-200 mb-3">
                                                    Target Fund: <span className="text-green-400">{campaign.targetAmount} ETH</span>
                                                </p>
                                                <p className="pt-4 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold text-white dark:text-gray-200 mb-3">
                                                    Target Fund: <span className="text-green-400">{campaign.amountRaised || 0} ETH</span>
                                                </p>
                                                <div className='flex justify-evenly pt-4 md:flex-col'>
                                                    <p className="flex items-center justify-center text-xs sm:text-sm font-bold text-white dark:text-gray-400 mb-1">
                                                        From:<span className="font-semibold text-yellow-300 ml-1">{new Date(campaign.fromDate).toLocaleDateString()}</span>
                                                    </p>
                                                    <p className="flex items-center justify-center text-xs sm:text-sm font-bold text-white dark:text-gray-400 mb-1">
                                                        To: <span className="font-semibold text-yellow-300 ml-1">{new Date(campaign.toDate).toLocaleDateString()}</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className='text-lime-400 font-semibold'>Progress</span>
                                                    <Progress progress={campaign.progressPercentage} color='lime' />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div >

        </div>
    );
}
