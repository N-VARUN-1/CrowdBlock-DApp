import React, { useEffect, useState } from 'react';
import { Sidebar, Spinner } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiMenu, HiFlag, HiGift, HiCurrencyRupee, HiCash } from "react-icons/hi";
import {
    FaEthereum
} from "react-icons/fa";

import { useSelector } from 'react-redux';

export default function Sidebar() {
    const { currentUser } = useSelector(state => state.user);
    const { wallet } = useSelector(state => state.wallet);
    return (
        <>
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

                        <Link>
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
        </>
    )
}
