import { Card } from 'flowbite-react'
import React from 'react'
import 'animate.css/animate.min.css'
import { motion } from 'framer-motion'
import { FaRocket, FaHandHoldingUsd, FaWallet } from 'react-icons/fa'
import SignIn from '../pages/SignIn'
import { Link } from 'react-router-dom'

export default function Hero() {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 120
            }
        }
    };

    const cardData = [
        {
            title: "Create your Campaign",
            image: "/images/createCampaign.jpeg",
            description: "Launch your funding initiative with ease and transparency.",
            icon: FaRocket,
            bgColor: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
            button: "Create",
            to: "/create-campaign"
        },
        {
            title: "Contribute to your desired Campaign",
            image: "/images/contriCampaign2.jpeg",
            description: "Support innovative projects and make a difference.",
            icon: FaHandHoldingUsd,
            bgColor: "bg-green-600",
            hoverColor: "hover:bg-green-700",
            button: "Contribute",
            to: "/contribute-campaign"
        },
        {
            title: "Withdraw Funds",
            image: "/images/withdraw.jpeg",
            description: "Securely access and manage your campaign funds.",
            icon: FaWallet,
            bgColor: "bg-purple-600",
            hoverColor: "hover:bg-purple-700",
            button: "Withdraw",
            to: ''
        }
    ];

    return (
        <>
            <div className='m-7 space-y-7 flex flex-col items-center justify-center px-4 md:px-8 lg:px-16'>
                {/* Hero Image */}
                <img
                    className='z-[-50] animate__animated animate__zoomIn animate__fast rounded-2xl w-full max-h-[87vh]'
                    src="/images/HOME.png"
                    alt="Hero Background"
                    loading="lazy"
                />

                {/* Cards Section */}
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {cardData.map((card, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className='group'
                        >
                            <Card
                                className={`
                                ${card.bgColor} 
                                ${card.hoverColor}
                                text-white 
                                transition-all 
                                duration-300 
                                transform 
                                hover:-translate-y-3 
                                hover:shadow-2xl 
                                overflow-hidden 
                                relative
                                border-none
                            `}
                            >
                                {/* Icon */}
                                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <card.icon className="text-4xl" />
                                </div>

                                {/* Title */}
                                <h5 className="text-2xl font-bold tracking-tight text-center mb-4">
                                    {card.title}
                                </h5>

                                {/* Image */}
                                <div className="relative overflow-hidden rounded-xl mb-4">
                                    <img
                                        className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110'
                                        src={card.image}
                                        alt={card.title}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity"></div>
                                </div>

                                {/* Description */}
                                <p className="font-semibold text-center font-medium text-gray-200 group-hover:text-white transition-colors">
                                    {card.description}
                                </p>

                                {/* Learn More Button */}
                                <div className="mt-4 text-center">
                                    <button className="
                                    font-semibold
                                    bg-white 
                                    text-gray-900 
                                    px-4 
                                    py-2 
                                    rounded-full 
                                    hover:bg-opacity-90 
                                    transition-all 
                                    duration-300
                                ">
                                        <Link to={card.to}>{card.button}</Link>
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </>
    )
}
