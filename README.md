This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

`short-next --typescript --eslint --src-dir`

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Or, run the production server:

```bash
npm run build
npm run start
```

Before running the server, you need to set the environment variables in `.env.local` file.

some example:

```env
# .env.local
SEQUELIZE_URI=sqlite:database.sqlite
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

Requirements specification is in [REQUIREMENTS.md](./REQUIREMENTS.md).

### Folder Structure

```bash
.
├── __tests__  // unit tests
├── src
│   ├── components  // React components
│   ├── graphql  // GraphQL schema and resolvers
│   ├── models  // Sequelize database models and GraphQL types
│   ├── pages  // Next.js pages
│   │   ├── api/graphql  // GraphQL API
│   │   ├── [shortLinkSlug].tsx  // Redirect page
│   ├── services  // Services for dependency injection
│   ├── utils  // Utilities most for front-end
