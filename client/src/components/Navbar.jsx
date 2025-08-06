import { useEffect, useState } from 'react';
import { Avatar, Dropdown } from "flowbite-react";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

import ConnectWallet from '../components/ConnectWallet'
import { current } from '@reduxjs/toolkit';

export default function Component() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCardVisible, setIsCardVisible] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigationLinks = `
        font-bold
        text-lg 
        transition-all 
        duration-300 
        ease-in-out 
        text-lime-400
        hover:text-gray-900 
        hover:scale-110 
        hover:shadow-xl 
        rounded-lg 
        m-1
        px-3
        py-2
        hover:bg-lime-400 
        transform 
        hover:-translate-y-1 
        active:scale-95 
        cursor-pointer
    `;

    const NavLinks = () => (
        <>
            <div className={navigationLinks}><Link to='/'>Home</Link></div>
            <div className={navigationLinks}>About</div>
            <div className={navigationLinks}>Services</div>
            <div className={navigationLinks}>Pricing</div>
            <div className={navigationLinks}>Contact</div>
        </>
    );

    const handleLogin = async () => {
        if (currentUser) {
            dispatch(signOut());
            navigate('/');
        }
        else {
            navigate('/signin')
        }
    }


    const handleOpenCard = () => {
        setIsCardVisible(true);
    };

    const handleCloseCard = () => {
        setIsCardVisible(false);
    };

    return (
        <div className="sticky z-[100] animate__animated animate__fadeInDown rounded-2xl m-3 bg-gray-800">
            <div className="flex justify-between items-center m-4 p-3">
                {/* Logo */}
                <div>
                    <img className='h-[40px] w-[95px]' src="/images/logo-new.png" alt="" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-4">
                    <NavLinks />
                </div>

                {/* User and Dropdown */}
                <div className="relative flex items-center space-x-4">
                    {!isCardVisible && (<Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            currentUser ? (<img src='/images/userAvatar.png' className='w-[45px] h-[45px] rounded-full' />) : (<img src='/images/userNull.png' className='w-[45px] h-[45px] rounded-full' />)
                        }
                        className=" bg-gray-900 border-lime-400 border-none z-[110]"
                        menuClassName="bg-gray-800 border-gray-700 z-[110]"
                    >
                        <Dropdown.Header className="font-semibold text-lime-400 bg-gray-800">
                            <span className="block text-sm">{currentUser ? currentUser.userId : "User ID"}</span>
                            <span className="font-semibold block truncate text-sm font-medium">{currentUser ? currentUser.email : "user@email.com"}</span>
                        </Dropdown.Header>
                        {currentUser ? (<Link to='/user-profile'>
                            <Dropdown.Item
                                className="font-bold text-white hover:bg-gray-700 focus:bg-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                            >
                                Dashboard
                            </Dropdown.Item>
                        </Link>) : (
                            <div></div>
                        )
                        }
                        {/* 
                        <Dropdown.Item
                            className="font-bold text-white hover:bg-gray-700 focus:bg-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        >
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item
                            className="font-bold text-white hover:bg-gray-700 focus:bg-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        >
                            Earnings
                        </Dropdown.Item> */}
                        <Dropdown.Item
                            onClick={handleOpenCard}
                            className="font-bold text-white hover:bg-gray-700 focus:bg-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        >
                            MetaMask Wallet
                        </Dropdown.Item>
                        <Dropdown.Divider className="bg-gray-700" />
                        <Dropdown.Item
                            onClick={handleLogin}
                            className="font-bold text-red-400 hover:bg-gray-700 focus:bg-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        >
                            {currentUser ? "Sign out" : "Sign In"}
                        </Dropdown.Item>
                    </Dropdown>)}

                    {/* Mobile Burger Menu */}
                    <button
                        className="md:hidden focus:outline-none z-[110]"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div >

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden bg-gray-700 p-4 z-[100]">
                        <div className="flex flex-col space-y-4">
                            <NavLinks />
                        </div>
                    </div>
                )
            }

            {
                isCardVisible && (<ConnectWallet isVisible={isCardVisible}
                    onClose={handleCloseCard} />)
            }
        </div >
    );
}
