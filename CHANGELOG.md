# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [v2.0.4] - 2025-06-22

### Fixed
- Applied security and dependency updates originally proposed by Dependabot:
  - Manually bumped `eslint-plugin-jest` from `v28.14.0` to `v29.0.1`.
  - Manually upgraded `jest` from `v29.7.0` to `v30.0.2`.
- Changes applied through a hotfix branch to avoid direct Dependabot merges into `main`, ensuring alignment with Git Flow practices and preventing divergence between `main` and `develop`.
- Changed the deploy to railway action to be applied only on push to `main`.

## [v2.0.3] - 2025-06-22

### Fixed
- Updated GitHub Actions deployment workflow:
  - Removed deprecated `--token` flag from Railway CLI usage.
  - Replaced it with environment-based authentication using `RAILWAY_TOKEN`, restoring successful CI deployment.
- Fixed a Dependabot compatibility issue:
  - Added `overrides` block in `package.json` to force use of `brace-expansion@^2.0.2`, resolving a security vulnerability that Dependabot could not automatically fix.

## [v2.0.2] - 2025-06-17

## Fixed
- Removed automated changelog generation files and configurations.
- Switched to manual changelog process to ensure compliance with Keep a Changelog format and Semantic Versioning.

---

## [v2.0.1] - 2025-06-17

## Fixed
- Changed the Railway GitHub Action to use the correct key and service name.
- Changed the CHANGELOG file generator to use the correct key.

---

## [v2.0.0] - 2025-06-17

## Added
- Added GitHub Actions workflow to automate changelog on tag
- Implemented a royale game mode
- Configure Battlesnake to utilize A* algorithm for pathfinding purposes
- Ensure that both large and small map sizes are supported

---

## [v1.3.2] - 2025-06-15

### Fixed
- Changed the Railway GitHub Action to install the correct railway dependency.

## [v1.3.1] - 2025-06-15

### Fixed
- Removed `npm run build` step from GitHub Actions deploy workflow to fix deployment failure on Railway due to missing build script.

## [v1.3.0] - 2025-06-15

### Changed
- Relocated `dependabot.yml` configuration file to `.github/` directory to comply with GitHub's standard structure.
- Updated Dependabot settings to enable automated **security** and **vulnerability** updates for `npm` and `GitHub Actions`.
- Configured Dependabot to **disable pull requests** while still enabling alerts and internal tracking.
- Updated README.md file
- Updated `package.json` to include JSDoc as a dev dependency and added a script for generating docs.


### Added
- Added JSDoc comments to Battlesnake source files to improve code documentation.
- Introduced `jsdoc.config.json` for configuring JSDoc generation.
- Added JSDoc generation script (`npm run jsdocs`) in `package.json`.
- Generated HTML documentation output stored in the `out/` directory and committed to the repository.
- Added `dependabot.yml` configuration file to `.github/workflows` directory for dependabot alerts and automation.
- Created GitHub Actions workflows for:
  - Running Jest tests on pull requests to `main` and `develop` branches.
  - Running ESLint and Prettier lint checks on pull requests to `main` and `develop`.
  - Checking test coverage threshold (≥ 50%) on pull requests to `main` and `develop`.
  - Deploying the application to Railway on pushes to the `main` branch.
- Implemented a `Hunt Smaller Snakes` logic to improve snake's attacking capabilities using Test Driven Development

---

## [v1.2.0] - 2025-05-20

### Added
- Implemented a one-move lookahead strategy using `simulateMove` and `evaluateGameState` to improve decision-making.
- Integrated the new lookahead logic into the snake's `move` function to evaluate and score each possible move.
- Restored the `printBoard` function for visualizing the game board during move decisions (for debugging purposes).

---

## [v1.1.0] - 2025-05-20

### Added
- Implemented flood-fill algorithm for board analysis to improve safe-move selection.
- Created and run test files for all files in `/collision` and `/movement` folders
- Implemented a heuristic evaluation method to assess game states and improve move decisions.
- Created sample unit tests for avoidCollisionsWithOtherSnakes logic to verify correct behavior.
- Configured eslint-plugin-jest to lint test files for consistency and quality.
- Set up Jest for unit testing and added configuration to support testing best practices.
- Refactored `snakeMovement.js` into modular files under `/snake` directory.
- Enhanced collision avoidance logic to allow moving into other snakes’ tail segments if those snakes will not eat food on the next move, improving movement flexibility and reducing unnecessary blockages.

### Changed
- Updated `avoidCollisionsWithOtherSnakes` function to implement this tail-moving logic.

### Fixed
- Hotfix: Changed snake color to improve visibility on the game board.


---

## [v1.0.0] - 2025-04-22

### Added
- User story issue template (`.github/ISSUE_TEMPLATE/user-story-template.md`) .
- Pull request template (`.github/pull_request_template.md`) for consistent pull request descriptions.
- Task issue template (`.github/ISSUE_TEMPLATE/task-template.md`) for smaller development tasks.
- Implemented Manhattan distance logic to prioritize the closest food.
- Initial head-to-head collision logic to avoid unsafe contested moves.
- Created a GitHub project board .
- Set up `.editorconfig` with team-defined code style rules.
- Installed and configured Prettier for consistent code formatting across the project.
- Added `.prettierrc.json` for Prettier configuration and `.prettierignore` for excluding files from formatting.
- ESLint configuration with recommended rule sets
- Installed and integrated plugins:
  - eslint-plugin-eslint-comments
  - eslint-plugin-unicorn
  - eslint-plugin-sonarjs
  - eslint-config-prettier
- Custom ESLint rules for consistency (e.g., enforcing semicolons)

### Changed
- Applied Prettier formatting across the entire codebase to ensure consistency.
- Linted the entire codebase for style and code quality
- Disabled conflicting rules to ensure compatibility with Prettier

---

## [0.1.0] - 2025-04-03

### Added
- Initial project setup with Node.js and Express.
- Battlesnake starter project files included as the project foundation.
- Core server logic: `index.js`, `server.js`
- Snake movement logic in `snakeMovement.js`
- Package management files: `package.json`, `package-lock.json`
- Project icon: `generated-icon.png`
- Collision avoidance logic for:
  - Wall boundaries
  - Self-collision
  - Other snake collision

### Changed
- Customized the snake’s appearance via `/start` endpoint (color, head type, tail type).
- Updated `README.md` with project description, setup instructions, and usage notes.

---
