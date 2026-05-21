# Contributing

Follow these rules when contributing to Chess Under The Tree.

## Branch Strategy

- Develop all features on feature branches branched from `main`.
- Name branches logically (e.g., `feature/add-timer`, `bugfix/camera-lock`).

## Conventional Commits

Enforce Conventional Commits for all commit messages.
- `feat:` for new functionality.
- `fix:` for bug fixes.
- `chore:` for dependency updates or internal refactoring.

## Pull Request Protocol

- Open a PR targeting the `main` branch.
- Complete the PR template checklist before requesting review.
- Ensure all CI status checks pass.
- Maintain a linear commit history (squash or rebase before merging).

## Pre-Flight Checks

Before submitting a PR, verify:
- Code compiles without errors (`npm run build`).
- No new linter warnings are introduced.
- 3D models and textures are optimized for web delivery.
