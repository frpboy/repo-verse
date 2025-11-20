"use client";

import { motion } from "framer-motion";
import { UserProfile } from "@/lib/github";

interface SunProps {
    user: UserProfile;
}

export function Sun({ user }: SunProps) {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-full bg-yellow-500 blur-xl opacity-50"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* The Sun Core */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 shadow-[0_0_50px_rgba(255,200,0,0.6)] flex items-center justify-center overflow-hidden border-4 border-yellow-200/50">
                <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent pointer-events-none" />
            </div>

            {/* Label */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-center">
                <h1 className="text-white font-bold text-lg drop-shadow-md whitespace-nowrap">{user.name}</h1>
                <p className="text-yellow-200/80 text-xs">@{user.username}</p>
            </div>
        </div>
    );
}
