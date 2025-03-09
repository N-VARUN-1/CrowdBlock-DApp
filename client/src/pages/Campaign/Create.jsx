import React, { useEffect, useState } from 'react'
import {
    HiExclamation
} from "react-icons/hi";
import { Button, Checkbox, Label, TextInput, Textarea, Datepicker, FileInput } from "flowbite-react";
import { useNavigate } from 'react-router-dom'
import { Spinner } from "flowbite-react";
import { ethers } from 'ethers';
import { connect, useDispatch, useSelector } from 'react-redux';
import { contractABI } from '../../Config/config.js';
import { setWallet, walletNotConnected } from '../../redux/wallet/walletSlice.js';
import { setCampaign } from '../../redux/campaign/campaignSlice.js';
// import { setCampaign } from '../../redux/campaign/campaignSlice.js';

export default function Create() {
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [contract, setContract] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        fromDate: '',
        toDate: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    const { wallet, isConnected } = useSelector((state) => state.wallet);

    // console.log(wallet);

    const CONTRACT_ADDRESS = import.meta.env.VITE_DEPLOYMENT_ADDRESS;

    useEffect(() => {
        const initContract = async () => {
            console.log('Initial wallet check:', wallet);
            console.log('Is Connected:', isConnected);
            // Add explicit check for wallet and provider
            if (!isConnected || !wallet?.provider) {
                dispatch(walletNotConnected())
                console.log('Wallet not connected or no provider');
                setContract(null);
                return;
            }

            try {
                console.log('Wallet inside effect:', wallet);
                console.log('Wallet provider:', wallet.provider);
                // console.log(wallet)
                // Use await with getSigner()
                const ethersProvider = new ethers.BrowserProvider(wallet.provider);
                const ethersSigner = await ethersProvider.getSigner();

                // Add error handling for contract creation
                if (!CONTRACT_ADDRESS || !contractABI) {
                    throw new Error("Contract address or ABI is missing");
                }

                const campaignFactoryContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    contractABI,
                    ethersSigner
                );
                setContract(campaignFactoryContract);

            } catch (error) {
                console.error("Could not initialize contract", error);
                setError(error.message || "Could not initialize contract");
            }
        };

        initContract();
    }, [isConnected, wallet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setPhoto(file);
    };

    const handleDateChange = (name) => (date) => {
        console.log("Datepicker value:", date); // Debugging output
        if (!date) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: '',
            }));
            return;
        }

        // Ensure the input is a valid Date or ISO string
        let formattedDate;
        if (date instanceof Date && !isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } else if (typeof date === 'string' && !isNaN(new Date(date).getTime())) {
            formattedDate = new Date(date).toISOString().split('T')[0];
        } else {
            console.error("Invalid date input:", date);
            setError("Invalid date selection");
            return;
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: formattedDate,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // More comprehensive validation
        const { title, description, targetAmount, fromDate, toDate } = formData;

        // Trim and validate inputs
        if (!title.trim() || !description.trim()) {
            setError('Please fill in all fields completely');
            return;
        }

        // Enhanced number validation
        // const amount = parseFloat(targetAmount);
        // if (isNaN(amount) || amount <= 0) {
        //     setError('Please enter a valid target amount');
        //     return;
        // }

        // More robust date validation
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const today = new Date();

        // // Reset today to start of day for accurate comparison
        // today.setHours(0, 0, 0, 0);
        // from.setHours(0, 0, 0, 0);
        // to.setHours(0, 0, 0, 0);

        const calculateDurationInSeconds = (fromDate, toDate) => {
            // Ensure inputs are converted to Date objects
            const from = fromDate instanceof Date ? fromDate : new Date(fromDate);
            const to = toDate instanceof Date ? toDate : new Date(toDate);

            // Check if dates are valid
            if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                console.error('Invalid date input:', { fromDate, toDate });
                throw new Error('Invalid date selection');
            }

            // Adjust `toDate` to midnight of the next day
            const adjustedTo = new Date(to);
            adjustedTo.setDate(to.getDate() + 1); // Move to the next day
            adjustedTo.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

            // Calculate difference in milliseconds
            const differenceInTime = adjustedTo.getTime() - from.getTime();

            if (differenceInTime <= 0) {
                throw new Error('End date must be after start date');
            }

            // Convert milliseconds to seconds
            const differenceInSeconds = Math.ceil(differenceInTime / 1000);

            // Ensure minimum duration of 1 day (86400 seconds)
            return Math.max(differenceInSeconds, 86400);
        };

        const durationInSeconds = calculateDurationInSeconds(from, to);

        today.setHours(0, 0, 0, 0);
        from.setHours(0, 0, 0, 0);

        // if (from.getTime() < today.getTime() || from.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
        //     setError('Start date must be today or in the future');
        //     return;
        // }


        if (from >= to) {
            setError('From date must be before To date');
            return;
        }

        try {
            // Add a check for contract existence
            if (!contract) {
                setError('Contract not initialized. Please reconnect your wallet.');
                return;
            }

            // Convert target amount to Wei
            const targetAmountWei = ethers.parseEther(targetAmount);

            // Smart contract transaction with error handling
            const tx = await contract.createCampaign(
                formData.title,
                formData.description,
                targetAmountWei,
                durationInSeconds // Use seconds instead of days
            );

            setIsLoading(true);

            // Wait for transaction receipt
            const receipt = await tx.wait();
            const campaignId = receipt.logs[0].args[0].toString();
            // console.log("Campaign Created with ID:", campaignId);
            // dispatch(setCampaign(campaignId))

            if (receipt) {
                setIsLoading(false);
                const formDataToSend = new FormData();
                formDataToSend.append('title', title);
                formDataToSend.append('description', description);
                formDataToSend.append('targetAmount', parseFloat(targetAmount));
                formDataToSend.append('fromDate', fromDate);
                formDataToSend.append('toDate', toDate);
                formDataToSend.append('userId', currentUser.userId);
                formDataToSend.append('campaignId', campaignId);
                if (photo) {
                    formDataToSend.append('photo', photo);
                }
                // Backend campaign creation with more error handling
                // const response = await fetch('/api/campaign/create-campaign', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         ...formData,
                //         targetAmount: parseFloat(targetAmount),
                //         userId: currentUser.userId,
                //         photo
                //     })
                // });
                const response = await fetch('https://crowd-block-d-app.vercel.app/api/campaign/create-campaign', {
                    method: 'POST',
                    credentials: 'include',
                    body: formDataToSend
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Campaign creation failed');
                }
            }

            // Navigate on successful creation
            navigate('/user-profile');

        } catch (error) {
            console.error('Campaign creation error:', error.message);
            setError('Transaction rejected!');
            setIsLoading(false)
        }
    };

    const customInputTheme = {
        field: {
            input: {
                base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
                colors: {
                    gray: "border-lime-400 font-semibold bg-transparent text-white placeholder-gray-400 focus:border-lime-500 focus:ring-lime-500"
                }
            }
        }
    };

    const customTextareaTheme = {
        base: "block w-full rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
        colors: {
            gray: "font-semibold border-lime-400 bg-transparent text-white placeholder-gray-400 focus:border-lime-500 focus:ring-lime-500"
        }
    };

    const customDatePickerTheme = {
        "root": {
            "base": "relative font-semibold",
        },
        "popup": {
            "root": {
                "base": "absolute top-10 z-50 block pt-2",
                "inline": "relative top-0 z-auto",
                "inner": "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700"
            },
            "header": {
                "base": "",
                "title": "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
                "selectors": {
                    "base": "mb-2 flex justify-between",
                    "button": {
                        "base": "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                        "prev": "",
                        "next": "",
                        "view": ""
                    }
                }
            },
            "view": {
                "base": "p-1"
            },
            "footer": {
                "base": "mt-2 flex space-x-2",
                "button": {
                    "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-semibold focus:ring-4 focus:ring-lime-300",
                    "today": "bg-lime-400 text-black hover:bg-lime-800 dark:bg-lime-400 dark:hover:bg-lime-400",
                    "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                }
            }
        },
        "views": {
            "days": {
                "header": {
                    "base": "mb-1 grid grid-cols-7",
                    "title": "h-6 text-center text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400"
                },
                "items": {
                    "base": "grid w-64 grid-cols-7",
                    "item": {
                        "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        "selected": "bg-lime-400 dark:text-gray-900 hover:bg-lime-600",
                        "disabled": "text-gray-500"
                    }
                }
            },
            "months": {
                "items": {
                    "base": "grid w-64 grid-cols-4",
                    "item": {
                        "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        "selected": "bg-lime-400 text-white hover:bg-lime-600",
                        "disabled": "text-gray-500"
                    }
                }
            },
            "years": {
                "items": {
                    "base": "grid w-64 grid-cols-4",
                    "item": {
                        "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        "selected": "bg-lime-400 text-white hover:bg-lime-600",
                        "disabled": "text-gray-500"
                    }
                }
            },
            "decades": {
                "items": {
                    "base": "grid w-64 grid-cols-4",
                    "item": {
                        "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        "selected": "bg-lime-400 text-white hover:bg-lime-600",
                        "disabled": "text-gray-500"
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen m-3 gap-2">
            {/* Left Div */}
            <div className="rounded-lg md:w-1/2 w-full bg-gray-800 flex items-center justify-center order-1 md:order-first">
                <img
                    src="/src/images/CreateCampaign/img1.png"
                    alt="Campaign Creation"
                    className="max-w-full max-h-full object-contain rounded-lg"
                />
            </div>

            {/* Right Div */}
            <div className="rounded-lg md:w-1/2 w-full bg-gray-800 p-6 flex flex-col justify-center items-center order-2 md:order-last">
                <div className="w-full max-w-md">
                    <h2 className="text-4xl font-bold mb-9 text-lime-400 text-center">Fill in your Campaign details</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-700 p-6 rounded-lg shadow-xl">
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="title"
                                    value="Title"
                                    className="text-white font-semibold dark:text-white"
                                />
                            </div>
                            <TextInput
                                name="title"
                                theme={customInputTheme}
                                color="gray"
                                id="title"
                                type="text"
                                placeholder="Campaign Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="description"
                                    value="Description"
                                    className="text-white dark:text-white font-semibold"
                                />
                            </div>
                            <Textarea
                                name="description"
                                color="gray"
                                theme={customTextareaTheme}
                                id="description"
                                placeholder="describe..."
                                required
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="TargetAmount"
                                    value="Target Amount"
                                    className="text-white font-semibold dark:text-white"
                                />
                            </div>
                            <TextInput
                                name="targetAmount"
                                theme={customInputTheme}
                                color="gray"
                                id="TargetAmount"
                                type="text"
                                placeholder="(ETH)"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="FromDuration"
                                    value="From -"
                                    className="text-white font-semibold dark:text-white"
                                />
                            </div>
                            <Datepicker
                                name="fromDate"
                                theme={customDatePickerTheme}
                                className="dark border-lime-400"
                                onChange={handleDateChange('fromDate')}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="ToDuration"
                                    value="To -"
                                    className="text-white font-semibold dark:text-white"
                                />
                            </div>
                            <Datepicker
                                name="toDate"
                                theme={customDatePickerTheme}
                                className="dark border-lime-400"
                                onChange={handleDateChange('toDate')}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="file-upload" value="Upload file" />
                            </div>
                            <FileInput id="file-upload" onChange={handlePhotoChange} />
                        </div>

                        {!isConnected && (
                            <div className="flex flex-row justify-center items-center gap-3 top-4 bg-red-100 font-semibold text-red-700 px-4 py-2 rounded">
                                <HiExclamation />
                                Please connect your wallet
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <button
                            onClick={() => { setIsLoading(true) }}
                            type="submit"
                            disabled={!isConnected}
                            className={`p-2 rounded-lg m-3 font-semibold ${isConnected
                                ? 'bg-lime-400 hover:bg-lime-700 hover:text-white text-gray-900'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (<Spinner aria-label="Default status example" />) : 'Register Campaign'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
