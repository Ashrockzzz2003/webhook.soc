"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfigureWebhooksContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [webhookStatus, setWebhookStatus] = useState({});
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);

  useEffect(() => {
    if (session) {
      const getRepos = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "https://amritotsavam.cb.amrita.edu/api/v1/projects",
          );
          const data = await response.json();
          const repoIds = searchParams.get("repos")?.split(",") || [];
          const repos = data.projects.filter((repo) =>
            repoIds.includes(repo.id),
          );
          setSelectedRepos(repos);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      getRepos();
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
            events: ["pull_request.edited", "pull_request.closed", "issues.labeled", "issues.unlabeled", "issues.assigned", "issues.unassigned", "issue_comment.created", "ping"],
            config: {
              url: "https://amritotsavam.cb.amrita.edu/webhook",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-white text-center sm:text-left">
            Configure Webhooks
          </h1>
          <div className="flex items-center gap-3 px-3 sm:px-4 py-2 bg-white/10 text-white rounded-full self-center sm:self-auto w-fit mx-auto sm:mx-0">
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs sm:text-sm truncate max-w-[100px]">
              {session.userName}
            </span>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-white mb-1 sm:mb-2 break-words">
                  {currentRepo.name}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base break-words">
                  {currentRepo.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-0">
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

            <div className="mt-4 sm:mt-6">
              {status ? (
                <div
                  className={`p-3 sm:p-4 rounded-lg ${status.success ? "bg-green-500/20" : "bg-red-500/20"}`}
                >
                  <div className="flex items-center gap-2">
                    {status.success ? (
                      <>
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-green-500"
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
                        <span className="text-green-500 text-sm sm:text-base">
                          Webhook configured successfully!
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
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
                        <span className="text-red-500 text-sm sm:text-base">
                          Failed to configure webhook: {status.error}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConfigureWebhook(currentRepo)}
                  className="w-full px-4 sm:px-6 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 duration-200 text-sm sm:text-base"
                >
                  Configure Webhook
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <span className="text-white text-sm sm:text-base">
              Repository {currentRepoIndex + 1} of {selectedRepos.length}
            </span>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 duration-200 text-sm sm:text-base"
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

export default function ConfigureWebhooks() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <p className="text-white text-center text-lg">Loading...</p>
        </div>
      }
    >
      <ConfigureWebhooksContent />
    </Suspense>
  );
}
