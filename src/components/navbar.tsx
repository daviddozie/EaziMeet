"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MenuIcon } from "lucide-react";
import { Logo } from "./svg";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Support", href: "/support" },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full bg-[#0C192C] text-white px-6 py-4 border-b border-[#1E40AF]"
        >
            <div className="flex items-center justify-between">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <div className="w-10 font-poppins h-10 bg-orange-500 flex rounded-[8px] justify-center items-center text-white" >
                        <Logo />
                    </div>
                    <span className="font-semibold font-poppins">EaziMeet</span>
                </motion.div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
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

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center space-x-4 font-poppins">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/create"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        >
                            Create a Meeting
                        </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/login"
                            className="bg-[#1E3A8A] hover:bg-[#18327a]  text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        >
                            Login
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Hamburger */}
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white focus:outline-none text-2xl"
                >
                    {isOpen ? <X /> : <MenuIcon />}
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-40"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="fixed top-0 left-0 h-full w-64 bg-[#0C192C] z-50 flex flex-col items-start px-6 py-12 space-y-6 shadow-lg"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center space-x-2 cursor-pointer mb-15"
                            >
                                <div className="w-10 font-poppins h-10 bg-orange-500 flex rounded-[8px] justify-center items-center text-white" >
                                    <Logo />
                                </div>
                                <span className="font-semibold font-poppins">EaziMeet</span>
                            </motion.div>

                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ color: "#f97316" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={link.href} className="font-poppins text-[14px]" onClick={() => setIsOpen(false)}>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/create"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition font-poppins"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Create a Meeting
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/login"
                                     className="bg-[#1E3A8A] hover:bg-[#18327a]  text-white px-4 py-2 rounded-md text-sm font-medium transition font-poppins"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
