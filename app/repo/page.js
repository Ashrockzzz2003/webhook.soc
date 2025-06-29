"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
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
      const getRepos = async () => {
        try {
          const response = await fetch(
            "https://amritotsavam.cb.amrita.edu/api/v1/projects",
          );
          const data = await response.json();
          const userRepos = data.projects.filter((project) =>
            project.maintainers.includes(session.userName),
          );
          setRepos(userRepos);
          setFilteredRepos(userRepos);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      getRepos();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 sm:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex-col justify-between items-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center sm:text-left">
            Your SoC Projects
          </h1>
          <p className="text-white/70 text-sm sm:text-md text-center sm:text-left">
            {`This is a list of all the repositories you are a maintainer of.
            Select the repositories you want to configure webhooks for and click
            the "Configure Webhooks" button to configure the webhooks.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 text-white rounded-full w-full sm:w-auto justify-center">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm truncate">{session.userName}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white/70 hover:text-white text-sm underline w-full sm:w-auto text-center"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Select All
            </button>
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading repositories...</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors gap-3 sm:gap-4"
              >
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedRepos.has(repo.id)}
                    onChange={() => handleRepoSelect(repo.id)}
                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 mt-1 sm:mt-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm sm:text-base truncate">
                      {repo.name}
                    </h3>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-xs sm:text-sm block truncate"
                    >
                      {repo.url}
                    </a>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                      {repo.description || "No description"}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
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

            {filteredRepos.length === 0 && (
              <div className="text-white text-center">
                No repositories found.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedRepos.size > 0 && (
        <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-1/2 right-4 sm:right-auto sm:-translate-x-1/2">
          <button
            onClick={handleConfigureWebhooks}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 duration-200 shadow-lg hover:scale-105 transform transition-transform flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>Configure Webhooks</span>
            <span className="bg-black/10 px-2 py-1 rounded-full text-xs sm:text-sm">
              {selectedRepos.size} selected
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
