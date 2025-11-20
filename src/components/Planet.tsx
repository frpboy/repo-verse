"use client";

import { motion } from "framer-motion";
import { PlanetData } from "@/lib/github";
import { useState } from "react";
import { cn } from "@/lib/github";

interface PlanetProps {
    data: PlanetData;
    cx: number; // Center X of the universe
    cy: number; // Center Y of the universe
}

export function Planet({ data, cx, cy }: PlanetProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Mood-based styles
    const moodGlow = {
        happy: "drop-shadow(0 0 15px var(--color-mood-happy))",
        focused: "drop-shadow(0 0 10px var(--color-mood-focused))",
        calm: "drop-shadow(0 0 12px var(--color-mood-calm))",
        stressed: "drop-shadow(0 0 8px var(--color-mood-stressed))",
        energetic: "drop-shadow(0 0 20px var(--color-mood-energetic))",
    };

    const moodBorder = {
        happy: "2px solid var(--color-mood-happy)",
        focused: "2px dashed var(--color-mood-focused)",
        calm: "1px solid var(--color-mood-calm)",
        stressed: "3px double var(--color-mood-stressed)",
        energetic: "2px solid var(--color-mood-energetic)",
    };

    return (
        <>
            {/* Orbit Path */}
            <circle
                cx={cx}
                cy={cy}
                r={data.orbitRadius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                className="pointer-events-none"
            />

            {/* Planet Container (Orbiting) */}
            <motion.div
                className="absolute flex items-center justify-center"
                style={{
                    width: data.radius * 2,
                    height: data.radius * 2,
                    left: cx - data.radius,
                    top: cy - data.radius,
                }}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: data.orbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* Counter-rotate to keep planet upright relative to screen if needed, 
            but here we want the planet to rotate around the sun AND itself. 
            Actually, the div above rotates around its center. 
            To orbit around the sun, we need a different structure. 
            
            Correct approach for orbit:
            Rotate a container centered at sun, then place planet at radius.
        */}
            </motion.div>

            {/* 
        Better Orbit Implementation:
        We rotate a large container centered at (cx, cy) with size 0.
        The planet is offset by orbitRadius.
      */}
            <motion.div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                    width: "100%",
                    height: "100%",
                    transformOrigin: `${cx}px ${cy}px`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: data.orbitSpeed, repeat: Infinity, ease: "linear" }}
            >
                <motion.div
                    className="absolute cursor-pointer pointer-events-auto group"
                    style={{
                        left: cx + data.orbitRadius - data.radius,
                        top: cy - data.radius,
                        width: data.radius * 2,
                        height: data.radius * 2,
                    }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                >
                    {/* The Planet Visual */}
                    <div
                        className={cn(
                            "w-full h-full rounded-full transition-all duration-300",
                            data.texture === "gaseous" && "blur-[1px]",
                            data.texture === "ringed" && "ring-4 ring-opacity-30 ring-white"
                        )}
                        style={{
                            backgroundColor: data.color,
                            filter: isHovered ? moodGlow[data.mood] : undefined,
                            border: isHovered ? moodBorder[data.mood] : "none",
                            boxShadow: `inset -${data.radius / 3}px -${data.radius / 3}px ${data.radius}px rgba(0,0,0,0.5)`
                        }}
                    >
                        {/* Texture Overlays */}
                        {data.texture === "cracked" && (
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply">
                                <path d="M20,20 L40,40 M60,20 L50,50 M20,80 L50,50 M80,80 L60,60" stroke="black" strokeWidth="2" fill="none" />
                            </svg>
                        )}

                        {/* Self Rotation */}
                        <motion.div
                            className="absolute inset-0 rounded-full opacity-30 bg-gradient-to-tr from-transparent to-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: data.rotationSpeed, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Label / Tooltip */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 20 : 10 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/80 border border-white/20 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none"
                    >
                        <div className="font-bold">{data.name}</div>
                        <div className="text-[10px] text-gray-300">{data.language} • {data.mood}</div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
}
