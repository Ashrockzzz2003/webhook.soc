# Setup Webhooks

This app configures webhooks to sync the repositories of maintainers of Amrita Summer Of Code to track the progress through `amsoc.vercel.app`.

## Tech Stack

- Next.js 15.3.3
- React 19
- NextAuth.js
- TypeScript
- TailwindCSS

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
```

To get your GitHub OAuth credentials:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following details:
   - Application name: "Amrita SoC Webhooks" (or your preferred name)
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a new Client Secret

For more details, see [GitHub's OAuth App documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

- `/app` - Main application code
  - `/api` - API routes
  - `/repo` - Repository-related components
  - `/_util` - Utility functions
  - `/_fonts` - Font files
- `/public` - Static assets
