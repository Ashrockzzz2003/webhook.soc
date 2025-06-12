"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import reposData from "../../_util/data/repos.json";

export default function ConfigureWebhooks() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [webhookStatus, setWebhookStatus] = useState({});
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);

  useEffect(() => {
    if (session) {
      const repoIds = searchParams.get("repos")?.split(",") || [];
      const repos = reposData.projects.filter((repo) =>
        repoIds.includes(repo.id),
      );
      setSelectedRepos(repos);
      setLoading(false);
    }
  }, [session, searchParams]);

  const handleConfigureWebhook = async (repo) => {
    try {
      // TODO: Replace with actual GitHub API call
      const response = await fetch(
        `https://api.github.com/repos/${session.userName}/${repo.url.split("/").slice(-2)[1]}/hooks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({
            name: "web",
            active: true,
            events: ["pull_request", "issue_comment"],
            config: {
              url: "https://example.com/webhook",
              content_type: "json",
              insecure_ssl: "0",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to configure webhook: ${response.statusText}`);
      }

      setWebhookStatus((prev) => ({
        ...prev,
        [repo.id]: { success: true },
      }));
    } catch (error) {
      setWebhookStatus((prev) => ({
        ...prev,
        [repo.id]: { success: false, error: error.message },
      }));
    }
  };

  const handleNext = () => {
    if (currentRepoIndex < selectedRepos.length - 1) {
      setCurrentRepoIndex((prev) => prev + 1);
    } else {
      router.push("/repo");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-center text-lg">
          Please sign in to configure webhooks.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-center text-lg">
          Loading repositories...
        </p>
      </div>
    );
  }

  const currentRepo = selectedRepos[currentRepoIndex];
  const status = webhookStatus[currentRepo?.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Configure Webhooks</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 text-white rounded-full">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{session.userName}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {currentRepo.name}
                </h2>
                <p className="text-gray-400">{currentRepo.description}</p>
              </div>
              <div className="flex gap-2">
                {currentRepo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {status ? (
                <div
                  className={`p-4 rounded-lg ${status.success ? "bg-green-500/20" : "bg-red-500/20"}`}
                >
                  <div className="flex items-center gap-2">
                    {status.success ? (
                      <>
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-green-500">
                          Webhook configured successfully!
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span className="text-red-500">
                          Failed to configure webhook: {status.error}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConfigureWebhook(currentRepo)}
                  className="w-full px-6 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 duration-200"
                >
                  Configure Webhook
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white">
              Repository {currentRepoIndex + 1} of {selectedRepos.length}
            </span>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 duration-200"
            >
              {currentRepoIndex < selectedRepos.length - 1
                ? "Next Repository"
                : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
