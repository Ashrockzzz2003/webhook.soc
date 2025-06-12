"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import reposData from "../_util/data/repos.json";
import { useRouter } from "next/navigation";

export default function Repositories() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Filter projects where user is a maintainer
      const userRepos = reposData.projects.filter((project) =>
        project.maintainers.includes(session.userName),
      );
      setRepos(userRepos);
      setFilteredRepos(userRepos);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    // Filter repos based on search query
    const filtered = repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
    setFilteredRepos(filtered);
  }, [searchQuery, repos]);

  const handleRepoSelect = (repoId) => {
    setSelectedRepos((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(repoId)) {
        newSelected.delete(repoId);
      } else {
        newSelected.add(repoId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredRepos.map((repo) => repo.id));
    setSelectedRepos(allIds);
  };

  const handleClearSelection = () => {
    setSelectedRepos(new Set());
  };

  const handleConfigureWebhooks = async () => {
    const selectedRepoIds = Array.from(selectedRepos);
    router.push(`/repo/configure?repos=${selectedRepoIds.join(",")}`);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-center text-lg">
          Please sign in to view your repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex-col justify-between items-center mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-white">Your SoC Projects</h1>
          <p className="text-white/70 text-md">
            This is a list of all the repositories you are a maintainer of.
            Select the repositories you want to configure webhooks for and click
            the "Configure Webhooks" button to configure the webhooks.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 text-white rounded-full">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{session.userName}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white/70 hover:text-white text-sm underline"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading repositories...</div>
        ) : (
          <div className="space-y-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedRepos.has(repo.id)}
                    onChange={() => handleRepoSelect(repo.id)}
                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />
                  <div>
                    <h3 className="text-white font-medium">{repo.name}</h3>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm"
                    >
                      {repo.url}
                    </a>
                    <p className="text-gray-400 text-sm">
                      {repo.description || "No description"}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {repo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRepos.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={handleConfigureWebhooks}
            className="px-8 py-4 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 duration-200 shadow-lg hover:scale-105 transform transition-transform flex items-center gap-2"
          >
            <span>Configure Webhooks</span>
            <span className="bg-black/10 px-2 py-1 rounded-full text-sm">
              {selectedRepos.size} selected
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
