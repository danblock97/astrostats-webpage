"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const MobileSidebar = ({ isOpen, onClose, links }) => {
    // Local state to track expanded menus (like "Support")
    const [expandedMenus, setExpandedMenus] = useState({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = (title) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    if (!mounted) return null;

    // Use Portal to render outside of the parent Navbar's stacking context
    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <div
                className={`fixed right-0 top-0 z-[101] h-full w-64 transform bg-[#121212] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-slate-200 hover:text-white hover:bg-white/10"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
                    <ul className="space-y-4">
                        {links.map((link, index) => {
                            const isExpanded = expandedMenus[link.title];

                            if (link.children) {
                                return (
                                    <li key={index} className="flex flex-col">
                                        <button
                                            onClick={() => toggleMenu(link.title)}
                                            className="flex items-center justify-between py-2 text-[#adb7be] hover:text-white text-lg font-medium"
                                        >
                                            {link.title}
                                            {isExpanded ? (
                                                <ChevronUpIcon className="h-5 w-5" />
                                            ) : (
                                                <ChevronDownIcon className="h-5 w-5" />
                                            )}
                                        </button>

                                        {/* Nested Sub-menu */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <ul className="pl-4 space-y-2 border-l border-white/10 ml-2">
                                                {link.children.map((child, cIndex) => (
                                                    <li key={cIndex}>
                                                        <Link
                                                            href={child.path}
                                                            onClick={onClose}
                                                            className="block py-2 text-[#adb7be] hover:text-white text-base"
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                );
                            }

                            return (
                                <li key={index}>
                                    {link.path.startsWith("http") ? (
                                        <a
                                            href={link.path}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={onClose}
                                            className="block py-2 text-[#adb7be] hover:text-white text-lg font-medium"
                                        >
                                            {link.title}
                                        </a>
                                    ) : (
                                        <div onClick={onClose}>
                                            <Link
                                                href={link.path}
                                                className="block py-2 text-[#adb7be] hover:text-white text-lg font-medium"
                                            >
                                                {link.title}
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>,
        document.body
    );
};

export default MobileSidebar;
