import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Mood = "happy" | "focused" | "calm" | "stressed" | "energetic";

export interface UserProfile {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
  html_url: string;
  topics: string[];
}

export interface PlanetData extends Repository {
  radius: number;
  color: string;
  rotationSpeed: number;
  orbitSpeed: number;
  orbitRadius: number;
  texture: "cracked" | "smooth" | "ringed" | "gaseous";
  mood: Mood;
}

const GITHUB_API_BASE = "https://api.github.com";

async function fetchGitHub(endpoint: string, token?: string) {
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please provide a GITHUB_TOKEN.");
    }
    if (response.status === 404) {
      throw new Error("Resource not found on GitHub.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchUserProfile(username: string, token?: string): Promise<UserProfile> {
  const data = await fetchGitHub(`/users/${username}`, token);
  return {
    username: data.login,
    avatarUrl: data.avatar_url,
    name: data.name || data.login,
    bio: data.bio || "",
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

export async function fetchUserRepositories(username: string, token?: string): Promise<Repository[]> {
  // Fetch up to 100 repos, sorted by update time
  const data = await fetchGitHub(`/users/${username}/repos?sort=updated&per_page=100`, token);

  // Filter out forks if desired, but for now we keep them
  return data.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    size: repo.size,
    updated_at: repo.updated_at,
    html_url: repo.html_url,
    topics: repo.topics || [],
  }));
}

// Mood Analysis
export function analyzeMood(repo: Repository): Mood {
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);

  if (repo.stargazers_count > 50 && daysSinceUpdate < 7) return "happy";
  if (repo.size > 5000 && daysSinceUpdate > 30) return "stressed";
  if (["TypeScript", "Rust", "C++", "C"].includes(repo.language || "")) return "focused";
  if (["Go", "Python", "JavaScript", "Lua"].includes(repo.language || "")) return "calm";

  return "energetic";
}
