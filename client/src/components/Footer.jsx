"use client";

import { Footer } from "flowbite-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Component() {
    return (
        <Footer container className="bg-gray-800 px-4 md:px-8 lg:px-16">
            <div className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    {/* Logo */}
                    <div className="flex items-center justify-center w-full md:w-auto">
                        <img
                            className='h-[40px] w-[95px] object-contain'
                            src="/src/images/logo-new.png"
                            alt="Company Logo"
                        />
                    </div>

                    {/* Navigation Links */}
                    <Footer.LinkGroup className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
                        <Footer.Link href="#">
                            <div className="font-semibold text-lime-400 hover:text-lime-300 transition-colors">
                                About
                            </div>
                        </Footer.Link>
                        <Footer.Link href="#">
                            <div className="font-semibold text-lime-400 hover:text-lime-300 transition-colors">
                                Privacy & Policy
                            </div>
                        </Footer.Link>
                        <Footer.Link href="#">
                            <div className="font-semibold text-lime-400 hover:text-lime-300 transition-colors">
                                Licensing
                            </div>
                        </Footer.Link>
                        <Footer.Link href="#">
                            <div className="font-semibold text-lime-400 hover:text-lime-300 transition-colors">
                                Contact
                            </div>
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>

                {/* Divider */}
                <Footer.Divider className="my-4 border-gray-600" />

                {/* Social Media and Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Copyright */}
                    <div className="text-sm text-gray-400 text-center w-full md:text-left md:w-auto">
                        © {new Date().getFullYear()} BC-FC. All Rights Reserved.
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4 justify-center w-full md:w-auto">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-lime-400 transition-colors"
                        >
                            <FaFacebook size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-lime-400 transition-colors"
                        >
                            <FaTwitter size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-lime-400 transition-colors"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-lime-400 transition-colors"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </Footer>
    );
}