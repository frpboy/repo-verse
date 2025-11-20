import fs from "fs";
import path from "path";
import { fetchUserProfile, fetchUserRepositories } from "../src/lib/github";
import { generateUniverse } from "../src/lib/planet-generator";
import { generateUniverseSVG } from "../src/lib/svg-generator";

async function main() {
    try {
        // Get username from args or env, default to a popular user for demo if not provided
        const username = process.argv[2] || process.env.GITHUB_USERNAME || "torvalds";
        const token = process.env.GITHUB_TOKEN;

        console.log(`Fetching data for user: ${username}...`);

        const user = await fetchUserProfile(username, token);
        const repos = await fetchUserRepositories(username, token);

        // Sort by stars to get the most "massive" planets
        const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
        const planets = generateUniverse(topRepos);

        console.log(`Generating universe for ${username} with ${planets.length} planets...`);
        const svg = generateUniverseSVG(user, planets);

        const outputPath = path.join(process.cwd(), "public", "universe.svg");
        fs.writeFileSync(outputPath, svg);

        console.log(`Universe SVG saved to ${outputPath}`);
    } catch (error) {
        console.error("Failed to generate universe:", error);
        process.exit(1);
    }
}

main();
