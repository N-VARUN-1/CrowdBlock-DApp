import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import { setWallet, walletConnected, walletNotConnected } from "../redux/wallet/walletSlice";

export default function Component({ isVisible, onClose }) {
    if (!isVisible) return null;

    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if ethereum is available
        if (!window.ethereum) {
            console.warn("MetaMask not detected");
            return;
        }

        const checkWalletConnected = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    setIsConnected(true);
                    setWalletAddress(accounts[0]);

                    // Automatically reconnect wallet on page load
                    await connectWallet();
                }

                // dispatch(walletConnected());
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        };

        checkWalletConnected();

        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setIsConnected(true);
                setWalletAddress(accounts[0]);
                connectWallet(); // Reconnect when accounts change
            } else {
                setIsConnected(false);
                setWalletAddress('');
                dispatch(setWallet(null)); // Clear wallet in Redux
            }
        };

        // Add event listener
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Cleanup listener
        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [dispatch]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            console.error("MetaMask not installed");
            return;
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            // Create provider
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Get network information
            const network = await provider.getNetwork();

            // Prepare wallet data object
            const walletData = {
                provider: window.ethereum,
                signer: signer,
                address: accounts[0],
                isConnected: true,
                network: {
                    chainId: Number(network.chainId),
                    name: network.name
                },
            };

            console.log(walletData);

            // Dispatch wallet connection with wallet data
            dispatch(setWallet(walletData));

            dispatch(walletConnected());

            setIsConnected(true);
            setWalletAddress(accounts[0]);

            console.log("Wallet connected successfully");
        } catch (error) {
            console.error("Wallet connection error:", error);
            setIsConnected(false);
        }
    };

    return (
        <div className="relative">
            <Card
                href="#"
                className="fixed top-2 right-4 overflow-y-auto z-50 max-w-sm shadow-lg 
                bg-gray-800 border-gray-700 
                dark:bg-gray-800 dark:border-gray-700
                hover:bg-gray-900 
                dark:hover:bg-gray-700
                transition-colors duration-200 "
            >
                <div className="mb-1">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-300 hover:text-white"
                    >
                        <svg
                            className="w-6 h-6"
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
                    </button>
                </div>

                <h5 className="flex flex-col text-2xl font-bold tracking-tight text-white dark:text-white">
                    Connect metamask wallet
                    <span className='text-sm text-gray-400 dark:text-gray-400'>-to CrowdBlock</span>
                </h5>
                {!isConnected ? (
                    <Button
                        gradientMonochrome="lime"
                        className='text-black font-semibold hover:text-black'
                        onClick={connectWallet}
                    >
                        Connect to Wallet
                    </Button>
                ) : (
                    <div className="flex flex-col space-y-2">
                        <h5 className="text-lg font-bold tracking-tight text-lime-400 dark:text-white">
                            Metamask Wallet Connected
                        </h5>
                        <div className="bg-gray-700 p-2 rounded-lg text-white">
                            <span className="font-semibold">Address:</span>
                            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}