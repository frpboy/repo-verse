"use client";

import { useEffect, useState, useRef } from "react";
import { UserProfile, PlanetData } from "@/lib/github";
import { Sun } from "./Sun";
import { Planet } from "./Planet";

interface UniverseProps {
    user: UserProfile;
    planets: PlanetData[];
}

export function Universe({ user, planets }: UniverseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-black stars-bg"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-black pointer-events-none" />

            {/* The Developer Sun */}
            <Sun user={user} />

            {/* The Planets */}
            {planets.map((planet) => (
                <Planet
                    key={planet.id}
                    data={planet}
                    cx={cx}
                    cy={cy}
                />
            ))}

            {/* UI Overlay (Optional Controls) */}
            <div className="absolute bottom-8 left-8 text-white/50 text-xs">
                <p>RepoVerse v1.0 • {planets.length} Planets orbiting</p>
            </div>
        </div>
    );
}
