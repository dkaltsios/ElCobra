# 🐍 ElCobra – Battlesnake JavaScript Starter Project

An official Battlesnake written in JavaScript. Get started at [play.battlesnake.com](https://play.battlesnake.com).

![Battlesnake Logo](https://media.battlesnake.com/social/StarterSnakeGitHubRepos_JavaScript.png)

ElCobra is a Battlesnake project built with modern best practices including code linting, formatting, and cloud deployment using Railway.

## 🛠 Technologies Used

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Railway](https://railway.app/) for deployment
- Code quality tools:
  - [Prettier](https://prettier.io/) for automatic formatting
  - [EditorConfig](https://editorconfig.org/) for consistent styling
  - [ESLint](https://eslint.org/) with:
    - `eslint-config-prettier`
    - `eslint-plugin-sonarjs`
    - `eslint-plugin-unicorn`
    - `eslint-plugin-eslint-comments`

## 🚀 Deployment

This Battlesnake is deployed using [Railway](https://railway.app/). No local server setup is required.

### 🔗 Live Endpoint

After deployment, Railway provides a public URL for your Battlesnake. Use this URL when registering your snake on [play.battlesnake.com](https://play.battlesnake.com).

### 🧭 Deploy Instructions

1. Go to [Railway](https://railway.app/) and create a new project.
2. Connect your GitHub repository (`dkaltsios/ElCobra`).
3. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Deploy the project.
5. Copy the generated public URL and use it on the Battlesnake website.

## 🧹 Code Quality

This project uses Prettier and ESLint to maintain clean and consistent code.

### Format Code

```bash
npx prettier --write .
```

### Lint Code

```bash
npx eslint .

```
📘 Next Steps

- Edit snakeMovement.js to customize your Battlesnake’s strategy.
- Follow the Quickstart Guide to iterate and test your Battlesnake.
- Battle it out in the arena!


