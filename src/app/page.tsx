"use client";

import { useState } from "react";
import { Universe } from "@/components/Universe";
import { fetchUserProfile, fetchUserRepositories, UserProfile, PlanetData } from "@/lib/github";
import { generateUniverse } from "@/lib/planet-generator";
import { Search, Rocket, Key } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launched, setLaunched] = useState(false);

  async function handleLaunch(e: React.FormEvent) {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUserProfile(username, token);
      const repos = await fetchUserRepositories(username, token);

      // Sort by stars for better visualization
      const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 20);
      const planetData = generateUniverse(topRepos);

      setUser(userData);
      setPlanets(planetData);
      setLaunched(true);
    } catch (err: any) {
      setError(err.message || "Failed to launch universe. Check username or token.");
    } finally {
      setLoading(false);
    }
  }

  if (launched && user) {
    return (
      <main className="w-full h-screen overflow-hidden bg-black">
        <Universe user={user} planets={planets} />

        {/* Back to Mission Control */}
        <button
          onClick={() => setLaunched(false)}
          className="absolute top-8 left-8 z-50 px-4 py-2 text-xs font-bold text-white uppercase tracking-widest border border-white/20 rounded-full hover:bg-white/10 transition-colors"
        >
          ← Abort Mission
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-screen bg-black stars-bg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-black to-black pointer-events-none" />

      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            RepoVerse
          </h1>
          <p className="text-gray-400 text-sm">Visualize your GitHub Universe</p>
        </div>

        <form onSubmit={handleLaunch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pilot Identity</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHub Username"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Key className="w-3 h-3" /> Access Token <span className="text-gray-700 font-normal normal-case">(Optional)</span>
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
            <p className="text-[10px] text-gray-600">
              Required for high rate limits. Token is never stored.
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-200 bg-red-900/20 border border-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full group relative flex items-center justify-center gap-2 py-4 bg-white text-black font-bold rounded-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {loading ? (
              <span className="animate-pulse">Igniting Thrusters...</span>
            ) : (
              <>
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Launch Universe
              </>
            )}
          </button>
        </form>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-xs">
        Built with Next.js, Tailwind, & Framer Motion
      </div>
    </main>
  );
}
