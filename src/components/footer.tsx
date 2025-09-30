'use client'

import { motion } from "framer-motion";
import { Logo } from "./svg";
import Link from "next/link";
import { LinkedinIcon, TwitterIcon, GithubIcon, FacebookIcon, InstagramIcon } from "lucide-react";

export const Footer = () => {

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Support", href: "/support" },
    ];

    return (
        <footer className=" text-white py-12 font-poppins border-t border-[#1E40AF]">
            <div className="w-[90%] mx-auto">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    <div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <div className="w-10 font-poppins h-10 bg-[#f97316] flex rounded-[8px] justify-center items-center text-white" >
                                <Logo />
                            </div>
                            <span className="font-semibold font-poppins">EaziMeet</span>
                        </motion.div>
                        <div className="mt-6 flex flex-col gap-4">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1, color: "#f97316" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={link.href} className="font-poppins text-[14px]">{link.name}</Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Locations</h3>
                        <p className="text-[#9CA3AF] font-bold mb-4">West Africa</p>
                        <p className="text-[#9CA3AF] text-sm">Nigeria</p>
                        <p className="text-[#9CA3AF] mt-4 text-sm">Lagos</p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Contacts</h3>
                        <p className="text-[#9CA3AF] text-sm">EaziMeet@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">
                            Our Socials
                        </h3>
                        <ul className="space-y-2 flex justify-between items-center font-poppins text-[#C5C5C5]">
                            <li><a href="#" className="hover:text-[#f97316]"><LinkedinIcon /></a></li>
                            <li><a href="#" className="hover:text-[#f97316]"><TwitterIcon /></a></li>
                            <li><a href="#" className="hover:text-[#f97316]"><GithubIcon /></a></li>
                            <li><a href="#" className="hover:text-[#f97316]"><FacebookIcon /></a></li>
                            <li><a href="#" className="hover:text-[#f97316]"><InstagramIcon /></a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 flex flex-col md:flex-row justify-between gap-4  items-center">
                    <ul className="flex gap-4 items-center font-poppins">
                        <li><a href="#" className="hover:text-[#f97316] text-[#9CA3AF] text-sm">Private Policy</a></li>
                        <li><a href="#" className="hover:text-[#f97316] text-[#9CA3AF] text-sm">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-[#f97316] text-[#9CA3AF] text-sm">Contact Us</a></li>
                    </ul>
                    <div>
                        <p className="text-[#9CA3AF] text-sm">© 2025 EaziMeet. All rights reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
