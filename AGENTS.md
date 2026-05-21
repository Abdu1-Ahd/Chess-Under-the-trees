# AGENTS.md

## Global Rules for Antigravity

- Follow PRD.md as the single source of truth. Never deviate from it.
- Never install packages not listed in PRD Section 2.
- Never use form elements. All interactions via onClick and onChange.
- Never import Stockfish on the main thread. Worker only.
- Never create Three.js geometries or materials inside useFrame or render functions.
- Never use localStorage or sessionStorage.
- Zustand store is the only place game state lives. No useState for game data.
- Spawn no more than 2 parallel subagents at any time.
- After each phase from PRD Section 15, stop and run the verification step before proceeding.
