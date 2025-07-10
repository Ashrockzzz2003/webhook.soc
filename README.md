# Setup Webhooks

This web app enables maintainers of [Amrita Summer of Code - ASoC 2025](https://amsoc.vercel.app) projects to easily configure GitHub webhooks for their repositories to sync repository activity to track project progress throughout the Summer of Code program.

## Features

-   **GitHub OAuth Authentication**: Secure sign-in with GitHub credentials
-   **Project Repository Discovery**: Automatically fetches ASoC projects you maintain
-   **Batch Webhook Configuration**: Select and configure webhooks for multiple repositories at once
-   **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

-   **Frontend**: Next.js 15.3.3 with React 19.0.0
-   **Authentication**: NextAuth.js v4.24.10
-   **Styling**: TailwindCSS v4 with PostCSS
-   **Language**: TypeScript 5.8.3
-   **Development**: ESLint for code quality

## Getting Started

### Prerequisites

-   Node.js (21+ recommended)
-   npm or yarn
-   GitHub account with maintainer access to ASoC repositories

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd setup-webhooks
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

Create a `.env` file in the root directory:

```env
# GitHub OAuth Application
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### GitHub OAuth Setup

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure the application:
    - **Application name**: "ASoC Webhook Setup" (or preferred name)
    - **Homepage URL**: `http://localhost:3000`
    - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Register the application and copy the credentials

For detailed guidance, see [GitHub's OAuth documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

### Development

1. **Start the development server**:

```bash
npm run dev
```

2. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

-   `npm run dev` - Start development server with Turbopack
-   `npm run build` - Build the application for production
-   `npm run start` - Start the production server
-   `npm run lint` - Run ESLint for code linting

## How It Works

1. **Authentication**: Users sign in with their GitHub account
2. **Project Discovery**: The app fetches ASoC projects from the Amrita API where the user is listed as a maintainer
3. **Repository Selection**: Users can search, filter, and select repositories for webhook configuration
4. **Webhook Setup**: The app configures webhooks to monitor:
    - Pull requests
    - Issues and issue comments
    - Repository activity (ping events)

## Project Structure

```
/app
├── /api
│   └── /auth/[...nextauth]/   # NextAuth.js configuration
├── /repo                      # Repository management pages
│   ├── page.js               # Repository listing and selection
│   └── /configure            # Webhook configuration
├── /_util                     # Utility functions and components
├── /_fonts                    # Custom Gilroy font family
├── config.js                  # API endpoints and webhook settings
├── layout.js                  # Root layout component
└── page.js                    # Landing page with authentication

/public                        # Static assets and icons
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is part of the Amrita Summer of Code 2025 initiative.
