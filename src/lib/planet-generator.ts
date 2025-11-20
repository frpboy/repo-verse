import { Repository, PlanetData, analyzeMood } from "./github";

export function generatePlanetData(repo: Repository, index: number): PlanetData {
    const mood = analyzeMood(repo);

    // Calculate radius based on size (logarithmic scale to handle large variance)
    // Base radius 20px, max 60px
    const radius = Math.max(20, Math.min(60, 20 + Math.log(repo.size || 1) * 3));

    // Calculate orbit radius based on index (sorted by size usually)
    // Base orbit 120px, step 60px per planet to ensure clearance
    const orbitRadius = 120 + (index * 60);

    // Rotation speed based on commits/activity (simulated by stars for now)
    // More stars = faster rotation
    const rotationSpeed = Math.max(5, 30 - (repo.stargazers_count / 10));

    // Orbit speed based on distance (Kepler's laws-ish, but stylized)
    // Further planets orbit slower
    const orbitSpeed = 20 + (orbitRadius / 10);

    // Color based on language
    const colors: Record<string, string> = {
        TypeScript: "#3178C6",
        JavaScript: "#F7DF1E",
        Python: "#3776AB",
        Go: "#00ADD8",
        Rust: "#DEA584",
        "C#": "#178600",
        HTML: "#E34F26",
        CSS: "#1572B6",
        Unknown: "#808080"
    };
    const color = colors[repo.language || "Unknown"] || colors.Unknown;

    // Texture based on issues/forks (simulated)
    let texture: PlanetData["texture"] = "smooth";
    if (repo.forks_count > 50) texture = "ringed";
    else if (repo.size > 10000) texture = "cracked";
    else if (repo.stargazers_count > 200) texture = "gaseous";

    return {
        ...repo,
        radius,
        color,
        rotationSpeed,
        orbitSpeed,
        orbitRadius,
        texture,
        mood,
    };
}

export function generateUniverse(repos: Repository[]): PlanetData[] {
    return repos.map((repo, index) => generatePlanetData(repo, index));
}
