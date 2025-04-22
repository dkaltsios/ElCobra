# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

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
