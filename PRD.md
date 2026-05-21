# PRD: 3D Chess Web Game

**Project Name:** Chess 3D  
**Model:** Claude Sonnet 4.6 (Thinking) | Alt: Gemini 3.1 Pro (High)  
**Mode:** Plan  
**Last Updated:** 2026-05-20  

---

## 1. Project Overview

A browser-based 3D chess game with a fully immersive outdoor environment. Two players sit across a chess board placed on grass under a tree. The camera perspective dynamically switches to the active player's point of view on each turn. The entire UI follows a carved-wood aesthetic that matches the physical scene. All chess logic is handled by Chess.js. The AI opponent is powered by Stockfish running in a Web Worker.

This PRD is the single source of truth for Antigravity. Every implementation decision is declared here. Do not infer or improvise on any section marked **[EXACT]**. Do not add features not listed here.

---

## 2. Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.3.0` | UI layer, screen management |
| `react-dom` | `^18.3.0` | DOM rendering |
| `@react-three/fiber` | `^8.17.0` | React renderer for Three.js |
| `@react-three/drei` | `^9.109.0` | Three.js helpers (OrbitControls, Environment, etc.) |
| `three` | `^0.167.0` | 3D engine |
| `chess.js` | `^1.0.0` | Chess logic, move validation, game state |
| `stockfish` | `^16.0.0` | AI engine (used via Web Worker) |
| `framer-motion` | `^11.3.0` | 2D UI animations |
| `howler` | `^2.2.4` | Sound management |
| `zustand` | `^4.5.4` | Global state management |
| `vite` | `^5.4.0` | Build tool and dev server |
| `@vitejs/plugin-react` | `^4.3.1` | Vite React plugin |
| `tailwindcss` | `^3.4.7` | Utility CSS for UI layout only |

**No other packages.** Do not install anything not listed above.

---

## 3. Project File Structure

```
chess-3d/
├── public/
│   ├── sounds/
│   │   ├── piece-lift.mp3
│   │   ├── piece-place.mp3
│   │   ├── piece-place-heavy.mp3
│   │   ├── capture.mp3
│   │   ├── check.mp3
│   │   ├── castle.mp3
│   │   ├── clock-tick.mp3
│   │   ├── game-end.mp3
│   │   └── menu-click.mp3
│   ├── textures/
│   │   ├── grass-diffuse.jpg
│   │   ├── grass-normal.jpg
│   │   ├── wood-light.jpg
│   │   ├── wood-light-normal.jpg
│   │   ├── wood-dark.jpg
│   │   ├── wood-dark-normal.jpg
│   │   ├── board-border.jpg
│   │   ├── bark-diffuse.jpg
│   │   └── bark-normal.jpg
│   └── stockfish/
│       └── stockfish.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── store/
│   │   ├── useGameStore.js
│   │   └── useSettingsStore.js
│   ├── hooks/
│   │   ├── useChess.js
│   │   ├── useStockfish.js
│   │   ├── useSound.js
│   │   └── useCamera.js
│   ├── scene/
│   │   ├── ChessScene.jsx
│   │   ├── Environment.jsx
│   │   ├── Board.jsx
│   │   ├── Piece.jsx
│   │   ├── PieceGeometry.jsx
│   │   ├── CapturedPieces.jsx
│   │   ├── SquareHighlight.jsx
│   │   └── CameraRig.jsx
│   ├── ui/
│   │   ├── MainMenu.jsx
│   │   ├── HUD.jsx
│   │   ├── PauseMenu.jsx
│   │   ├── EndScreen.jsx
│   │   ├── ReviewMode.jsx
│   │   ├── PromotionPicker.jsx
│   │   ├── MoveHistory.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── WoodenButton.jsx
│   ├── utils/
│   │   ├── boardUtils.js
│   │   └── animationUtils.js
│   └── workers/
│       └── stockfish.worker.js
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 4. Global State

### 4.1 `useGameStore.js` (Zustand)

```
State shape:
{
  screen: 'menu' | 'game' | 'paused' | 'ended' | 'review',
  gameMode: 'vs-ai' | 'vs-friend' | null,
  aiDifficulty: 'easy' | 'medium' | 'hard' | 'master',
  chess: Chess instance (Chess.js),
  fen: string,
  turn: 'w' | 'b',
  selectedSquare: string | null,
  validMoves: string[],
  capturedByWhite: Piece[],
  capturedByBlack: Piece[],
  moveHistory: Move[],
  gameResult: null | { winner: 'w' | 'b' | 'draw', reason: string },
  reviewIndex: number,
  isAIThinking: boolean,
  promotionPending: { from: string, to: string } | null,
  cameraLocked: boolean,
  whiteTime: number,
  blackTime: number,
  timerMode: 'none' | 'blitz' | 'rapid' | 'classical',
  inCheck: boolean,
}
```

Actions:
- `startGame(mode, difficulty, timerMode)`
- `selectSquare(square)`
- `makeMove(from, to, promotion?)`
- `undoMove()`
- `offerDraw()`
- `resign()`
- `setPromotion(piece)`
- `toggleCameraLock()`
- `setScreen(screen)`
- `setReviewIndex(index)`
- `tickTimer()`
- `resetGame()`

### 4.2 `useSettingsStore.js` (Zustand)

```
State shape:
{
  soundEnabled: boolean,
  soundVolume: number (0-1),
  defaultCameraLocked: boolean,
  autoQueen: boolean,
  showCoordinates: boolean,
  playerColor: 'w' | 'b',
}
```

Actions: `updateSetting(key, value)`

---

## 5. Chess Logic (`useChess.js`)

This hook wraps Chess.js and connects it to the game store.

**Responsibilities:**
- Initialize a Chess.js instance on `startGame`
- On `selectSquare`: if a piece of the active turn color is on that square, compute legal moves using `chess.moves({ square, verbose: true })` and store them in `validMoves`
- On second click on a valid move square: call `chess.move({ from, to })`, update FEN, update turn, check for promotion, check for check/checkmate/stalemate
- After every move: update `capturedByWhite` and `capturedByBlack` by diffing starting piece counts against current board
- After every move: push to `moveHistory`
- Check detection: `chess.inCheck()` updates `inCheck` in store
- Game end detection: `chess.isGameOver()`, `chess.isCheckmate()`, `chess.isDraw()`, `chess.isStalemate()` — set `gameResult` accordingly
- Promotion: if a move results in promotion, set `promotionPending` in store. Do not call `chess.move` until the user picks a piece from `PromotionPicker`. Then call `chess.move({ from, to, promotion: piece })`

---

## 6. Stockfish Integration (`useStockfish.js` + `stockfish.worker.js`)

**Worker setup:**
- Load `public/stockfish/stockfish.js` in a Web Worker
- Communicate via `postMessage` and `onmessage`
- Worker receives: `{ cmd: 'setDifficulty', depth: number }` and `{ cmd: 'getMove', fen: string }`
- Worker sends back: `{ bestMove: 'e2e4' }` (UCI format)

**Difficulty to depth mapping [EXACT]:**
```
easy:   depth 2
medium: depth 8
hard:   depth 14
master: depth 20
```

**Minimum AI response delay [EXACT]:**
```
easy:   800ms
medium: 600ms
hard:   400ms
master: 200ms
```

Apply the delay client-side with a setTimeout so the AI never responds instantly even at low depth.

**Integration flow:**
1. After the human makes a move and it is the AI's turn, set `isAIThinking: true`
2. Post current FEN to the worker
3. When worker returns `bestMove`, parse it (e.g. `e2e4` → from `e2`, to `e4`)
4. Apply the move to Chess.js
5. Set `isAIThinking: false`
6. Trigger piece animation and sound

---

## 7. Sound System (`useSound.js`)

Use Howler.js. Load all sounds on app mount. Respect `soundEnabled` and `soundVolume` from settings store.

**Sound to trigger mapping:**

| Event | Sound File |
|---|---|
| Piece selected | `piece-lift.mp3` |
| Pawn/Bishop/Knight placed | `piece-place.mp3` |
| Rook/Queen/King placed | `piece-place-heavy.mp3` |
| Piece captured | `capture.mp3` |
| King in check | `check.mp3` |
| Castling move | `castle.mp3` |
| Timer under 10s | `clock-tick.mp3` (loop, stop when turn ends) |
| Game end | `game-end.mp3` |
| Any menu button click | `menu-click.mp3` |

---

## 8. 3D Scene

### 8.1 `ChessScene.jsx`

Top-level R3F Canvas component. Sets up:
- `shadows` enabled on Canvas
- `camera` initial position: `[0, 8, 10]` (white player POV start)
- `gl` antialias true
- Renders: `Environment`, `Board`, `CapturedPieces`, `CameraRig`
- All pieces rendered inside `Board`

### 8.2 `CameraRig.jsx`

Controls the camera position and rotation using Three.js `useFrame` with lerp.

**States:**

```
White POV (turn = 'w', locked = false):
  position: [0, 5, 9]
  target: [0, 0, 0]
  fov: 55

Black POV (turn = 'b', locked = false):
  position: [0, 5, -9]
  target: [0, 0, 0]
  fov: 55

Top Lock:
  position: [0, 14, 0]
  target: [0, 0, 0]
  fov: 50
```

**Transition:**
- Lerp factor: `0.035` per frame (smooth over ~1.2 seconds at 60fps)
- Path: the camera moves in an arc, not a straight line. Interpolate a midpoint at `[0, 10, 0]` when switching between white and black POV. Use a quadratic bezier curve in 3D space sampled each frame based on lerp progress `t`.
- During transition: board interaction is disabled. Re-enable when lerp is within 0.01 of target.

**Implementation [EXACT]:**
```javascript
// In useFrame, compute t as lerp progress from 0 to 1
// Sample bezier: P = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
// P0 = previous camera position
// P1 = midpoint [0, 12, 0]
// P2 = target camera position
// Update camera.position and camera.lookAt(target) each frame
```

### 8.3 `Environment.jsx`

**Grass plane:**
- `PlaneGeometry` 60x60, rotated -90 degrees on X axis
- Apply `grass-diffuse.jpg` texture with `wrapS = wrapT = RepeatWrapping`, repeat 20x20
- Apply `grass-normal.jpg` as normal map
- `MeshStandardMaterial` with `roughness: 0.9`, `metalness: 0`
- Vertex shader wind animation: offset Y position of each vertex by `sin(position.x * 0.5 + time * 1.5) * 0.02`. Use `ShaderMaterial` or `onBeforeCompile` injection.

**Tree trunk:**
- Position: `[-9, 0, -4]`
- Geometry: `CylinderGeometry(0.8, 1.1, 10, 12)` for trunk base
- Additional `CylinderGeometry(0.5, 0.8, 6, 12)` offset slightly for upper trunk
- Merge geometries or render as two meshes
- Material: `MeshStandardMaterial` with `bark-diffuse.jpg` texture and `bark-normal.jpg` normal map
- Roots: 3x `TorusGeometry` segments deformed and placed at base, same bark material

**Lighting:**
- `DirectionalLight` at `[8, 12, 6]`, intensity `2.5`, color `#FFF5E0`, `castShadow: true`
  - Shadow map size: `2048 x 2048`
  - Shadow camera: near `0.5`, far `50`, left/right/top/bottom `±15`
- `AmbientLight` intensity `0.4`, color `#C8D8FF`
- `HemisphereLight` skyColor `#87CEEB`, groundColor `#4a7c2f`, intensity `0.6`
- Dappled light effect: 4x `SpotLight` at `[x, 15, z]` positions `[-3,15,-2]`, `[2,15,1]`, `[-1,15,3]`, `[4,15,-3]`, each with low intensity `0.3`, soft penumbra `0.8`, angle `0.15`, targeting ground plane. These simulate light through leaves.

### 8.4 `Board.jsx`

**Board geometry:**
- 8x8 grid of squares, each `1x1` unit
- Total board: 8x8 world units centered at origin `[0, 0, 0]`
- Each square: `BoxGeometry(1, 0.1, 1)`
- Light squares: `MeshStandardMaterial` with `wood-light.jpg` texture, `roughness: 0.4`, `metalness: 0.05`
- Dark squares: `MeshStandardMaterial` with `wood-dark.jpg` texture, `roughness: 0.5`, `metalness: 0.05`
- Board surface Y position: `0.05` (top of box)

**Board border:**
- Single `BoxGeometry(10, 0.25, 10)` box positioned so top aligns with square tops
- Inner hole: use `CSG subtraction` or overlay the 8x8 grid on top — render border as a surrounding frame using 4 separate `BoxGeometry` beams (top, bottom, left, right rails)
- Material: `board-border.jpg` texture, `roughness: 0.3`, `metalness: 0.1`
- Border thickness: 1 unit on each side

**Coordinates on border:**
- If `showCoordinates` setting is true
- Render rank numbers 1-8 on left border and file letters a-h on bottom border
- Use `Text` component from `@react-three/drei`
- Font size: `0.25`, color `#8B4513`, position slightly above border surface

**Square interaction:**
- Each square has an invisible `PlaneGeometry(1,1)` clickable mesh at Y `0.15`
- `onClick`: call `selectSquare(squareName)` in store
- `onPointerOver`: set hover state for cursor change
- Pass square name (e.g. `'e4'`) computed from grid index using `boardUtils.indexToSquare(col, row)`

### 8.5 `SquareHighlight.jsx`

Rendered as children of each square when it is in a highlighted state.

**States:**

| State | Visual |
|---|---|
| Selected piece square | Warm amber ring, `0.7` opacity, pulsing scale animation |
| Valid move (empty square) | Small carved dot, `RingGeometry(0.1, 0.15, 16)` at center of square, color `#D4A017` |
| Valid capture square | Larger ring `RingGeometry(0.35, 0.45, 32)` plus dot, color `#C0392B` opacity `0.7` |
| King in check | Full square overlay `PlaneGeometry(0.95, 0.95)`, color `#8B0000`, opacity `0.5`, pulsing opacity animation |
| Last move from | Subtle `#6B8E23` tint overlay |
| Last move to | Slightly stronger `#6B8E23` tint overlay |

All highlights rendered at Y `0.12` (just above square surface). Use `transparent: true` on all materials.

### 8.6 `PieceGeometry.jsx`

Generate all chess piece geometries procedurally using Three.js `LatheGeometry`. No external 3D model files.

**Piece profiles (control points for LatheGeometry) [EXACT]:**

```javascript
const profiles = {
  pawn: [
    [0,0],[0.3,0],[0.3,0.15],[0.15,0.25],
    [0.2,0.5],[0.15,0.6],[0.25,0.7],[0.25,0.9],[0,0.9]
  ],
  rook: [
    [0,0],[0.35,0],[0.35,0.15],[0.2,0.2],
    [0.22,0.7],[0.28,0.8],[0.28,1.0],[0,1.0]
  ],
  knight: null, // use BoxGeometry + SphereGeometry composite (see below)
  bishop: [
    [0,0],[0.32,0],[0.32,0.15],[0.18,0.25],
    [0.14,0.6],[0.2,0.8],[0.12,1.0],[0.08,1.1],[0,1.2]
  ],
  queen: [
    [0,0],[0.38,0],[0.38,0.15],[0.2,0.25],
    [0.16,0.5],[0.22,0.65],[0.3,0.7],[0.18,0.9],
    [0.14,1.1],[0.2,1.2],[0,1.2]
  ],
  king: [
    [0,0],[0.38,0],[0.38,0.15],[0.2,0.25],
    [0.16,0.5],[0.22,0.65],[0.3,0.7],[0.18,0.9],
    [0.14,1.1],[0.22,1.15],[0.22,1.3],[0.07,1.3],[0.07,1.5],[0,1.5]
  ],
}
```

Each profile is passed to `new THREE.LatheGeometry(points, 16)` where points are `Vector2` objects.

**Knight special case:**
- Body: `CylinderGeometry(0.15, 0.3, 0.6, 8)` as base
- Head: `SphereGeometry(0.22, 8, 8)` offset `[0.12, 0.6, 0.1]`
- Snout: `BoxGeometry(0.2, 0.15, 0.25)` offset `[0.25, 0.55, 0.1]`
- Merge these into a single geometry using `BufferGeometryUtils.mergeGeometries`

**Piece scale per type [EXACT]:**
```javascript
const pieceScale = {
  pawn:   [0.4, 0.4, 0.4],
  rook:   [0.45, 0.45, 0.45],
  knight: [0.45, 0.45, 0.45],
  bishop: [0.4, 0.42, 0.4],
  queen:  [0.45, 0.48, 0.45],
  king:   [0.47, 0.52, 0.47],
}
```

### 8.7 `Piece.jsx`

Renders a single chess piece.

**Props:** `{ square, type, color, isSelected, isCapturing }`

**Materials:**
- White pieces: `MeshStandardMaterial`, `wood-light.jpg` texture, `roughness: 0.3`, `metalness: 0.1`, `envMapIntensity: 0.8`
- Black pieces: `MeshStandardMaterial`, `wood-dark.jpg` texture, `roughness: 0.4`, `metalness: 0.1`, `envMapIntensity: 0.8`

**Position:**
- Computed from square name via `boardUtils.squareToPosition(square)` → returns `[x, 0.15, z]`
- X range: -3.5 to 3.5 (col 0-7)
- Z range: -3.5 to 3.5 (row 0-7)

**Animations (useSpring from framer-motion or Three.js lerp in useFrame):**

| Event | Animation |
|---|---|
| Move | Lift to Y `0.8`, translate X/Z to target, lower to Y `0.15`. Duration 400ms total. |
| Capture | Piece topples: rotate 90 degrees on X axis over 200ms, then slide to captured area over 400ms |
| Selected | Gentle bob: Y oscillates `±0.08` at 1.5Hz using `sin(time)` in `useFrame` |
| Check (king) | King shakes: translate X `±0.1` three times over 300ms |
| Promotion | Scale from `1` to `0` in 150ms, swap geometry, scale from `0` to `1` in 150ms |

**castShadow and receiveShadow:** true on all piece meshes.

### 8.8 `CapturedPieces.jsx`

Renders captured pieces on the grass beside the board.

**Layout:**
- White's captured pieces (taken by black): left side of board, X range `[-8, -5.5]`, Z range `[-3.5, 3.5]`
- Black's captured pieces (taken by white): right side of board, X range `[5.5, 8]`, Z range `[-3.5, 3.5]`
- Y position: `0.05` (sitting on grass)
- Arrange in rows of 5, column-first
- Scale: `0.6` of normal piece scale (visually smaller, set aside)
- Material opacity: `0.85` (slightly faded to distinguish from active pieces)
- No shadows cast (performance), but `receiveShadow: true`

---

## 9. UI Components

All UI is rendered as HTML overlay on top of the R3F Canvas using absolute positioning. The Canvas takes full viewport. UI is layered with `position: absolute`, `z-index` managed per layer.

### 9.1 Wooden Aesthetic System

**CSS variables [EXACT]:**
```css
:root {
  --wood-dark:       #3B1F0A;
  --wood-medium:     #6B3A1F;
  --wood-light:      #A0522D;
  --wood-highlight:  #C8864A;
  --wood-grain-url:  url('/textures/wood-dark.jpg');
  --text-carved:     #F5DEB3;
  --text-dim:        #C4A882;
  --shadow-deep:     0 8px 24px rgba(0,0,0,0.7);
  --shadow-button:   0 4px 12px rgba(0,0,0,0.5);
  --font-display:    'Cinzel', serif;
  --font-body:       'Crimson Text', serif;
  --border-radius:   6px;
}
```

**Import Google Fonts in `index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

**WoodenPanel base class:**
```css
.wooden-panel {
  background-image: var(--wood-grain-url);
  background-size: cover;
  background-color: var(--wood-dark);
  border: 3px solid var(--wood-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-deep), inset 0 1px 0 rgba(255,255,255,0.1);
  padding: 24px;
  color: var(--text-carved);
  font-family: var(--font-display);
}
```

### 9.2 `WoodenButton.jsx`

**Props:** `{ label, onClick, variant: 'primary' | 'secondary' | 'danger', disabled }`

**Normal state:**
- Background: `var(--wood-medium)` with grain texture overlay
- Border: `2px solid var(--wood-highlight)`
- Box shadow: `0 4px 0 var(--wood-dark), 0 6px 12px rgba(0,0,0,0.4)`
- Text: `var(--text-carved)`, font `Cinzel`, font-weight 600
- Padding: `10px 24px`
- Cursor: pointer

**Hover state:**
- Background lightens to `var(--wood-light)`
- Box shadow: `0 4px 0 var(--wood-dark), 0 8px 16px rgba(0,0,0,0.5)`
- Transform: `translateY(-1px)`

**Active/Pressed state:**
- Box shadow: `0 1px 0 var(--wood-dark)` (collapses, looks pressed down)
- Transform: `translateY(3px)`

**Danger variant:** Border and highlight use `#8B2020` tones.

**Transition:** all `0.12s ease`

Play the `menu-click.mp3` sound in the `onClick` handler before calling the passed `onClick` prop.

### 9.3 `MainMenu.jsx`

**Layout:**
- Full screen with R3F scene visible behind
- Dark vignette overlay: radial gradient `rgba(0,0,0,0.5)` edges to transparent center
- Wooden panel centered, width `420px`, animated in with Framer Motion: `y: 80 → 0`, `opacity: 0 → 1`, duration `0.6s`, ease `easeOut`

**Panel contents:**
1. Title: "CHESS" in Cinzel 48px, letter-spacing `0.15em`, text-shadow `2px 2px 4px rgba(0,0,0,0.8)`
2. Thin horizontal rule styled as a rope/leather divider (CSS border with `var(--wood-light)`)
3. Buttons stacked with `16px` gap:
   - "Play vs AI" → opens difficulty sub-panel
   - "Play vs Friend" → calls `startGame('vs-friend', null, timerMode)`
   - "Settings" → opens settings panel

**Difficulty sub-panel:**
- Slides down below "Play vs AI" button with Framer Motion expand animation
- Timer mode selector: None / Blitz (5+0) / Rapid (10+0) / Classical (30+0)
- 4 difficulty buttons: Easy / Medium / Hard / Master
- "Back" button at bottom
- Clicking a difficulty calls `startGame('vs-ai', difficulty, timerMode)`

### 9.4 `HUD.jsx`

Rendered during `screen === 'game'`. Fully overlay, pointer-events only on interactive elements.

**Top bar (full width, 64px tall):**
- Left section: Black player label + timer (if enabled)
- Right section: White player label + timer (if enabled)
- Center: Pause button (wooden icon button, `⏸` icon)
- Timer display: wooden panel style, monospace font, `MM:SS`
- Timer pulses red when under 30 seconds

**Bottom bar (full width, 56px tall):**
- Left: Turn indicator — wooden sign reading "WHITE'S MOVE" or "BLACK'S MOVE", switches with Framer Motion fade
- Center: Camera lock toggle button — wooden toggle, icon switches between 👁 (dynamic) and 🔒 (locked)
- Right: Undo button (vs-friend only), wooden button "↩ Take Back"

**AI thinking indicator:**
- Replaces "BLACK'S MOVE" / "WHITE'S MOVE" with a wooden hourglass icon + "Thinking..." text
- Hourglass animates (CSS rotation loop)

**Move history panel:**
- Right edge of screen, wooden panel, initially collapsed (24px wide tab showing "▶")
- Click tab to expand to 220px wide, sliding with Framer Motion
- Content: scrollable list of moves in standard algebraic notation
- Current move highlighted with `var(--wood-highlight)` background
- Two columns: White moves left, Black moves right
- Each row alternates between `var(--wood-dark)` and slightly lighter background

**Material advantage indicator:**
- Small section below each timer
- Shows `+N` where N is material difference. Positive = that player is ahead.
- Material values: Queen=9, Rook=5, Bishop=3, Knight=3, Pawn=1

### 9.5 `PauseMenu.jsx`

**Trigger:** Pause button click or `Escape` key.

**Background:**
- R3F scene blurs (CSS `backdrop-filter: blur(4px)` on overlay div)
- Dark overlay: `rgba(0, 0, 0, 0.6)`

**Panel:**
- Centered, width `360px`
- Title: "PAUSED"
- Buttons: Resume / Offer Draw / Resign / Settings / Main Menu

**Destructive action confirmation:**
- Resign and Main Menu show an inline confirmation: "Are you sure? [Confirm] [Cancel]" replaces the button row
- Framer Motion slide-down for confirmation row

**Offer Draw:**
- In vs-friend mode: shows a message "Draw offered. Waiting..." and the other player gets an accept/decline prompt
- In vs-AI mode: AI always accepts if it is losing by more than `+3` material, otherwise declines

### 9.6 `PromotionPicker.jsx`

**Trigger:** `promotionPending !== null` in store.

**Layout:**
- Wooden tray slides up from bottom of screen, height `180px`, full width
- Centered row of 4 wooden squares, each `120x120px`
- Each square contains the 3D piece rendered with `Canvas` inside (small embedded R3F canvas showing just the piece)
- Piece labels below: "QUEEN", "ROOK", "BISHOP", "KNIGHT"
- Hover: square lifts slightly, glows amber
- Click: dispatches `setPromotion(piece)`, tray slides back down

**Auto-queen bypass:** if `settings.autoQueen === true`, skip the picker entirely and auto-promote to queen.

### 9.7 `EndScreen.jsx`

**Trigger:** `screen === 'ended'`

**Panel:**
- Centered, width `460px`
- Slides in from top with Framer Motion

**Content:**
1. Result header: "CHECKMATE" / "DRAW" / "STALEMATE" / "RESIGNATION" in Cinzel 36px
2. Winner line: "White Wins" / "Black Wins" / "Draw" in 24px
3. Thin divider
4. Stats row:
   - Total moves (from `moveHistory.length`)
   - Time elapsed (total clock time used)
   - Material score at end
5. Buttons row: "Rematch" / "Review Game" / "Main Menu"

**Visual:**
- Winner side: warm golden ambient glow around the panel `box-shadow: 0 0 40px rgba(212, 160, 23, 0.4)`
- Draw: neutral silver glow `box-shadow: 0 0 40px rgba(180, 180, 180, 0.3)`

### 9.8 `ReviewMode.jsx`

**Trigger:** "Review Game" button from EndScreen.

**State change:** `screen` → `'review'`, `cameraLocked` → `true`, `reviewIndex` → `0`

**UI:**
- Bottom bar only: `◀◀ Start` / `◀ Prev` / move counter "Move 12 / 40" / `▶ Next` / `▶▶ End`
- Move history panel forced open on left side
- Exit button top-right: "✕ Exit Review"

**Behavior:**
- Stepping forward/backward replays `moveHistory` entries one by one
- On step, animate the piece move as normal
- Highlight the move in the move history panel
- No piece interaction allowed (board clickable area disabled)

### 9.9 `SettingsPanel.jsx`

**Accessible from:** MainMenu and PauseMenu.

**Layout:**
- Wooden panel, width `380px`
- Title: "SETTINGS"
- Sections:

| Setting | Control |
|---|---|
| Sound | Wooden toggle switch (ON/OFF) |
| Volume | Wooden slider (0-100) |
| Default Camera | Toggle: Dynamic / Top Lock |
| Auto-Queen | Toggle: ON / OFF |
| Show Coordinates | Toggle: ON / OFF |
| Player Color (vs AI) | Toggle: White / Black |

- "Close" button at bottom

---

## 10. Board Interaction Logic

**Square coordinate system:**
- Board centered at world origin
- Square `a1` = col 0, row 0 → world position `[-3.5, 0.15, 3.5]`
- Square `h8` = col 7, row 7 → world position `[3.5, 0.15, -3.5]`
- Formula: `x = col - 3.5`, `z = 3.5 - row`

**`boardUtils.squareToPosition(square)`:**
```javascript
const file = square.charCodeAt(0) - 97  // 'a' = 0
const rank = parseInt(square[1]) - 1    // '1' = 0
return [file - 3.5, 0.15, 3.5 - rank]
```

**`boardUtils.indexToSquare(col, row)`:**
```javascript
const file = String.fromCharCode(97 + col)
const rank = row + 1
return `${file}${rank}`
```

**Click handling sequence:**
1. User clicks a square
2. If `isTransitioning` (camera lerping) → ignore click
3. If `isAIThinking` → ignore click
4. If `promotionPending` → ignore click
5. If no `selectedSquare`: check if clicked square has a piece of active color → set `selectedSquare`, compute `validMoves`, play `piece-lift.mp3`
6. If `selectedSquare` is set:
   a. If clicked square is in `validMoves` → make move, clear selection
   b. If clicked square is a different piece of active color → switch selection
   c. Otherwise → clear selection

---

## 11. Timer System

**Managed in `useGameStore`.**

**Timer modes and starting times [EXACT]:**
```
none:      no timer
blitz:     5 minutes = 300s per player
rapid:     10 minutes = 600s per player
classical: 30 minutes = 1800s per player
```

**Tick:**
- Use `setInterval` with 1000ms interval only during `screen === 'game'` and not during AI thinking
- Tick the active player's timer: `whiteTime--` or `blackTime--`
- On turn change, switch which timer ticks
- If a timer reaches 0: game ends immediately, opponent wins by timeout → set `gameResult`
- When timer under 10 seconds: start looping `clock-tick.mp3`

**Display:** format seconds as `MM:SS` using zero-padded values.

---

## 12. Screen Flow

```
App start
  └─> MainMenu (screen = 'menu')
        ├─> startGame() → screen = 'game'
        │     ├─> Pause button → screen = 'paused'
        │     │     ├─> Resume → screen = 'game'
        │     │     ├─> Main Menu → screen = 'menu'
        │     │     └─> Resign → gameResult set → screen = 'ended'
        │     └─> Game over → screen = 'ended'
        │           ├─> Rematch → startGame() → screen = 'game'
        │           ├─> Review Game → screen = 'review'
        │           │     └─> Exit Review → screen = 'menu'
        │           └─> Main Menu → screen = 'menu'
        └─> Settings (overlay on menu)
```

---

## 13. Performance Requirements

- Target: 60fps on a mid-range laptop GPU
- Shadow map size capped at `2048 x 2048`
- Grass wind shader must be vertex-only, no fragment-heavy calculations
- Captured piece meshes: no shadows cast (set `castShadow: false`)
- Piece geometries: cache all `LatheGeometry` instances in a module-level map, do not regenerate per render
- Do not use `useFrame` polling for UI state. Use Zustand subscriptions.
- All `useFrame` hooks must include early-return guards when scene is paused

---

## 14. Responsive Behavior

- Minimum supported viewport: `1280 x 720`
- UI panels must not overflow on `1280px` width
- No mobile support required in this version
- Canvas always fills full viewport with `width: 100vw; height: 100vh`

---

## 15. Implementation Order (Phases)

Antigravity must follow this phase order. Do not skip phases or implement features out of order.

### Phase 1 — Project Scaffold
- Init Vite + React project
- Install all packages from Section 2
- Create full file structure from Section 3
- Set up Tailwind
- Set up Zustand stores (useGameStore, useSettingsStore) with all state shapes and actions defined but not yet wired to UI
- Set up `index.css` with all CSS variables from Section 9.1
- Import Cinzel and Crimson Text fonts

**Verification:** `npm run dev` loads a blank page without errors.

### Phase 2 — 3D Scene Foundation
- Implement `ChessScene.jsx` with R3F Canvas
- Implement `Environment.jsx`: grass plane with texture, tree trunk, all lights
- Implement `Board.jsx`: 8x8 squares with correct colors and materials, border
- Implement `CameraRig.jsx`: static white POV position only (no animation yet)
- Render board in scene with no pieces

**Verification:** Board visible in browser with grass and tree trunk, correct lighting.

### Phase 3 — Chess Pieces
- Implement `PieceGeometry.jsx` with all LatheGeometry profiles and knight composite
- Implement `Piece.jsx` rendering a single piece with correct material
- Render all 32 starting position pieces on the board from Chess.js initial FEN
- Implement `boardUtils.js` coordinate functions

**Verification:** All 32 pieces visible in correct starting positions.

### Phase 4 — Chess Logic and Interaction
- Implement `useChess.js`
- Wire square click handlers in `Board.jsx`
- Implement `SquareHighlight.jsx` for selected, valid move, capture, last move highlights
- Implement piece selection, move making, turn switching
- Implement check/checkmate/stalemate/draw detection

**Verification:** Full chess game playable via hot-seat. Checkmate correctly ends game.

### Phase 5 — Piece Animations
- Add move animation (lift, translate, lower) to `Piece.jsx`
- Add capture animation (topple + slide to side)
- Add selection bob animation
- Add check shake animation on king
- Implement `CapturedPieces.jsx`

**Verification:** Pieces animate smoothly. Captured pieces appear on grass sides.

### Phase 6 — Camera System
- Implement full bezier arc camera transition in `CameraRig.jsx`
- Implement camera lock toggle
- Connect to `cameraLocked` and `turn` in store
- Disable board interaction during transition

**Verification:** Camera smoothly arcs between player POVs on each turn. Lock button switches to top view.

### Phase 7 — UI Layer
- Implement all wooden aesthetic CSS classes
- Implement `WoodenButton.jsx`
- Implement `MainMenu.jsx` with difficulty and timer sub-panels
- Implement `HUD.jsx` with all elements
- Implement `PauseMenu.jsx`
- Implement `EndScreen.jsx`
- Implement `SettingsPanel.jsx`
- Implement `MoveHistory.jsx`
- Wire all screen transitions via store

**Verification:** Full UI flow from menu → game → pause → end → menu. All wooden aesthetic applied.

### Phase 8 — Promotion
- Implement `PromotionPicker.jsx`
- Wire promotion detection in `useChess.js`
- Implement piece swap animation on promotion

**Verification:** Pawn reaching back rank opens picker. Promotion applies correctly.

### Phase 9 — Sound
- Implement `useSound.js` with Howler.js
- Place placeholder sound files in `public/sounds/` (use any valid MP3)
- Wire all sound triggers per Section 7
- Wire volume and mute to settings store

**Verification:** Sounds play on piece place, capture, check, menu click.

### Phase 10 — Timer
- Implement timer tick logic in store
- Implement timer display in HUD
- Implement timeout game-end condition
- Implement clock-tick sound loop for last 10 seconds

**Verification:** Timer counts down. Reaching zero ends game.

### Phase 11 — Stockfish AI
- Set up `stockfish.worker.js`
- Implement `useStockfish.js`
- Wire AI to game flow: AI responds after human move when `gameMode === 'vs-ai'`
- Implement thinking indicator in HUD
- Test all four difficulty levels

**Verification:** AI makes legal moves at all difficulties. AI does not block the main thread.

### Phase 12 — Review Mode
- Implement `ReviewMode.jsx`
- Wire step forward/backward through `moveHistory`
- Animate piece moves during stepping

**Verification:** Full game can be reviewed move by move after it ends.

### Phase 13 — Polish Pass
- Dappled light spotlights
- Grass wind vertex shader
- Piece material env map and gloss
- Board coordinate labels
- Material advantage display in HUD
- All Framer Motion enter/exit animations on panels
- Draw offer logic in vs-AI and vs-friend modes
- Undo button for vs-friend mode

**Verification:** Visual and interaction quality pass. No console errors. 60fps maintained.

---

## 16. Known Constraints and Rules

- Do not use any `<form>` elements. All interactions via `onClick` / `onChange`.
- Do not add packages not listed in Section 2.
- Do not change the file structure from Section 3.
- Do not implement online multiplayer. Local hot-seat only for vs-friend.
- Sound files must be referenced as paths from `public/sounds/`. Howler handles loading.
- Stockfish must run entirely in a Web Worker. Never import Stockfish on the main thread.
- All Three.js object creation (geometries, materials) must happen outside of `useFrame`.
- Zustand store actions must be the only way to mutate game state. No local `useState` for game data.
- CSS for UI elements goes in `index.css` or component-level CSS modules. Do not use inline styles except for dynamic values (position offsets, opacity from animation state).

---

## 17. What Done Looks Like

The project is complete when:

1. Full chess game is playable vs AI at all four difficulties
2. Full chess game is playable vs a local friend (hot-seat)
3. Camera switches POV per turn with arc animation
4. Camera can be locked to top view via HUD button
5. All captured pieces appear on the grass sides
6. Promotion picker works correctly
7. Check triggers king glow, shake, and sound
8. Checkmate/stalemate/draw detected and end screen shown
9. Timer modes work and timeout ends the game
10. Full game can be reviewed after it ends
11. Undo works in vs-friend mode
12. All UI follows the wooden aesthetic with correct fonts and colors
13. All sounds trigger at correct events, volume controllable
14. Settings panel persists preferences across screen changes
15. Zero console errors in browser dev tools
16. Stable 60fps on a mid-range GPU at 1280x720 or higher
