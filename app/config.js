const config = {
    // API Endpoints
    api: {
        projectsUrl: "https://amritotsavam.cb.amrita.edu/api/v1/projects",
        webhookUrl: "https://amritotsavam.cb.amrita.edu/api/webhook",
    },

    // GitHub API settings
    github: {
        apiVersion: "2022-11-28",
    },

    // Webhook configuration
    webhook: {
        events: ["pull_request", "issues", "issue_comment", "ping"],
        contentType: "json",
        insecureSSL: "0",
        active: true,
    },
};

export default config; 