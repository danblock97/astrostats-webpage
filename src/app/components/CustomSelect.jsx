"use client";
import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ value, onChange, options, placeholder = "Select an option", colorScheme = "indigo" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    const handleToggle = () => {
        if (!isOpen) {
            // Check space below
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                // If space below is less than 300px, open upwards
                setOpenUp(spaceBelow < 300);
            }
        }
        setIsOpen(!isOpen);
    };

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const ringColor = colorScheme === "pink" ? "focus:ring-pink-500/60" : "focus:ring-indigo-500/60";
    const hoverBg = colorScheme === "pink" ? "hover:bg-pink-500/10 hover:text-pink-300" : "hover:bg-indigo-500/10 hover:text-indigo-300";

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center justify-between rounded-xl border border-white/10 bg-black/50 pl-4 pr-3 py-3 text-white focus:outline-none focus:ring-2 ${ringColor} transition-all cursor-pointer text-left`}
            >
                <span className={selectedOption ? "text-white" : "text-white/40"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`h-5 w-5 text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute z-50 w-full rounded-xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden animate-in fade-in duration-200 ${openUp
                    ? "bottom-full mb-2 slide-in-from-bottom-2"
                    : "mt-2 slide-in-from-top-2"
                    }`}>
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full px-4 py-2 text-sm text-left rounded-lg transition-colors ${value === option.value
                                    ? "bg-white/10 text-white font-medium"
                                    : `text-white/70 ${hoverBg}`
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
