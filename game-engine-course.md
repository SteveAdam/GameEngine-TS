# Building Your Own 2D/3D Hybrid Game Engine
### From First Principles to a Cell-Shaded, Body-Part-Damage Combat Platformer

A self-paced curriculum in the style of a structured online course (Udemy-depth execution, university-style rigor on fundamentals). You build a real engine — not a wrapper around Unity/Godot — then ship a vertical-slice game with it.

---

## 0. Course Philosophy

Most "make a game" tutorials hand you an engine. This course does the opposite: you build the engine's guts (render loop, math, ECS, physics, animation, shader pipeline) so that every system in your final game is one you understand and can debug. The payoff target is a **Katana Zero-style 2D stealth-action platformer** where hit location matters — a strike to the neck decapitates, a strike to a limb severs it, a strike near major vessels causes bleed-out, torso hits are lower-tier damage. This is a data-driven, part-based damage system + procedural sprite/gore layering problem, which is genuinely one of the more interesting intermediate/advanced game-dev topics (it's basically a mini "hit-location" simulation layered on 2D animation).

Cell shading gets folded in as a **3D lighting technique applied to select elements** (props, effects, maybe a 3D-rendered character variant) rendered inside your otherwise 2D pipeline — this is how a lot of 2.5D indie titles actually work (flat sprites + a few toon-shaded 3D accents), so it's a realistic scope, not a bolt-on.

---

## 1. Language, Engine, and Tooling Recommendation

**Recommended stack: TypeScript + WebGL2, running in the browser, built with Vite.**

Why this fits you specifically:
- You already live in TypeScript/Angular/React/Node daily — zero ramp-up on syntax, tooling, or debugging workflow. All the *new* cognitive load goes toward engine/graphics concepts instead of fighting an unfamiliar language.
- WebGL2 gives you a real GPU pipeline (vertex/fragment shaders) — required for cell shading — while still letting you do straightforward 2D sprite rendering via orthographic projection. One rendering backend covers both your 2D and 3D needs.
- Ships as a web build for free (shareable via a link, no packaging step) with an easy path to desktop later via Tauri/Electron if you want it.
- Huge ecosystem for the adjacent tools you'll want (Vite dev server with hot reload, glMatrix for vector/matrix math, easy asset pipeline).

**Alternative if you want lower-level/closer-to-metal experience:** C++ with SDL2 (windowing/input) + OpenGL (rendering). More "traditional engine programmer" resume value, harder debugging, slower iteration. I'd only suggest this if your goal is systems-programming depth over shipping speed. Say the word and I'll re-derive the whole course around this stack instead — everything below maps fairly directly.

**Tooling:**
| Purpose | Tool |
|---|---|
| Editor | VS Code (+ extensions: ESLint, WebGL GLSL Editor, Live Share optional) |
| Language | TypeScript 5.x |
| Build/dev server | Vite |
| Math library | glMatrix (vectors/matrices — you'll understand the math before you lean on it) |
| Sprite/pixel art | Aseprite (industry-standard, built for spritesheets + animation) |
| Level design | Tiled (tilemap editor, exports JSON your engine will parse) |
| Audio | Audacity (editing), free SFX from freesound.org / your own recordings |
| Version control | Git + GitHub |
| 3D reference/prototyping (optional, Module 8) | Blender, for building simple low-poly meshes to cell-shade |

---

## 2. Curriculum Structure

Each module = roughly 1–2 weeks of part-time work. Each ends in a **milestone deliverable** — a working piece of the engine, committed to your repo — and a **concept quiz** before you're "allowed" to move on (I'll quiz you in-chat as we go).

### Module 0 — Environment & Foundations Setup
Install Node, VS Code, Git, Aseprite, Tiled. Scaffold a Vite + TypeScript project. Get a blank canvas rendering at 60fps with a WebGL2 context initialized and a clear-color triangle on screen (the "hello world" of graphics programming).
**Milestone:** A colored triangle renders via raw WebGL2 calls (no libraries) in a Vite-served page.

### Module 1 — TypeScript for Engine Programming
Not "learn TS from scratch" (you know it) — this is *TS as used in engine code*: classes vs. composition, structs-of-data patterns, typed arrays (Float32Array etc. — critical for GPU data), avoiding GC pressure in hot loops, strict typing for entity/component data.
**Milestone:** A typed `Vector2` and `Vector3` class with unit tests (add, subtract, dot, normalize, length).

### Module 2 — Game Math
Coordinate systems (screen vs. world vs. clip space), vectors, matrices (translation/rotation/scale), the orthographic vs. perspective projection matrix, interpolation/easing functions, basic trig for movement and aiming.
**Milestone:** A sprite that moves smoothly along a bezier/eased path using your own math functions.

### Module 3 — The Game Loop & Core Architecture
Fixed vs. variable timestep, delta time, the update/render split, why naive `while(true)` loops break physics, intro to Entity-Component-System (ECS) as your architecture pattern instead of deep inheritance hierarchies.
**Milestone:** A minimal ECS (Entity registry + Position/Velocity components + a Movement system) driving a bouncing box at a stable fixed timestep.

### Module 4 — Rendering Fundamentals
WebGL2 pipeline deep dive: vertex buffers, shaders (GLSL basics), the vertex → fragment pipeline, batching sprites into a single draw call (sprite batcher — this matters a lot for performance later), texture loading and sampling.
**Milestone:** A sprite batcher rendering 500+ independently-positioned sprites in one draw call.

### Module 5 — Sprites & Animation From Scratch
Spritesheet/texture-atlas format, frame-based animation state machines (idle/run/jump/attack transitions), building your own sprites in Aseprite (we'll cover pixel-art basics — silhouette readability, limited palettes, walk-cycle timing), importing and slicing sheets programmatically.
**Milestone:** A character with idle/run/jump animations driven by a state machine, sprites hand-made by you in Aseprite.

### Module 6 — Input, Physics & Platformer Feel
Keyboard/gamepad input abstraction, AABB collision detection, tile-based collision against a Tiled map, and — important for a game like Katana Zero — "game feel" tuning: coyote time, jump buffering, variable jump height, acceleration curves.
**Milestone:** A fully controllable character running/jumping through a Tiled-authored test level with tight, responsive movement.

### Module 7 — Engine Core Systems
Scene graph / parenting transforms, camera system (follow, bounds clamping, screen shake as a camera effect), asset manager (loading/caching textures, sounds, JSON), audio system (SFX + music layering), a basic in-engine debug overlay (FPS, entity count, hitbox visualization).
**Milestone:** A "engine dashboard" debug view toggleable at runtime, camera smoothly following the player through a level larger than the screen.

### Module 8 — Entering 3D: Shaders & Cell Shading
Bridging 2D and 3D in one renderer: rendering a simple 3D mesh (loaded from Blender export) alongside your 2D sprites, normals and basic Lambert lighting, then **toon/cell shading**: quantized lighting bands via shader, rim lighting for that "inked" look, and an outline pass (either inverted-hull or post-process edge detection) for the classic cell-shaded silhouette.
**Milestone:** A 3D cell-shaded prop or effect (e.g., a rotating weapon pickup, or a stylized blood-splash mesh) rendered correctly inside your 2D scene, lit and outlined.

### Module 9 — Combat System Architecture
Hitboxes vs. hurtboxes, attack state machines (windup/active/recovery frames — the exact thing that makes Katana Zero's combat feel precise), frame data design, and critically: a **body-region model** — defining named hurtbox regions per character (head/neck, torso, left/right arm, left/right leg) that attacks can independently target based on overlap.
**Milestone:** A dummy enemy with distinct, independently-detectable hurtbox regions, visualized in your debug overlay, with an attack that logs *which* region it hit.

### Module 10 — Damage-Location & Gore Systems
This is the module that makes your combat game *your* combat game. We design a data-driven "wound table": each body region maps to a damage type and severity (neck → decapitation, limb → severance, torso → standard/bleed, near major vessels → hemorrhage/bleed-out-over-time). We build:
- A part-based sprite swap system (base body + detachable limb/head sprites that can be individually "removed" and replaced with a stump + a spawned separate physics-driven sprite for the severed part)
- A lightweight 2D particle system for blood spray/pooling, tuned per hit type
- A status-effect system for bleed-out (damage-over-time from severed vessels)
- Screen/gameplay feedback (hit-stop/freeze-frame, camera punch) tied to hit severity — this is what sells impact in games like this
**Milestone:** Striking the dummy enemy in different regions produces visibly distinct outcomes (clean hit / limb comes off and physics-tumbles away / decapitation / bleed status effect ticking).

### Module 11 — Level Design Tools & Pipeline
Deeper Tiled integration: multiple layers (background/collision/foreground), object layers for spawn points and triggers, parallax backgrounds, and a simple level-loading/streaming approach so levels aren't all in memory at once.
**Milestone:** A two-screen level with parallax, enemy spawn markers read from Tiled object data, and a trigger (e.g., a door that opens).

### Module 12 — Juice & Polish
Screen shake, hit-stop, particle trails on movement, dynamic lighting for mood (torch flicker, neon signage — very Katana Zero), music/SFX layering tied to combat state, UI (health bar, minimalist HUD).
**Milestone:** The Module 6 test level, replayed, now *feels* like a real game — juice pass applied to movement, hits, and environment.

### Module 13 — Capstone: The Vertical Slice
Combine everything into one short, playable level: stealth/positioning approach into a room, 2–3 enemies with the full body-region damage system, at least one 3D cell-shaded set-piece element, music, and a win-state.
**Milestone:** A shippable-quality 60–120 second gameplay slice you can record and show.

### Module 14 — Performance & Shipping
Profiling draw calls and frame time, texture atlas optimization, build packaging (Vite production build), and optionally wrapping the web build for desktop (Tauri).
**Milestone:** Production build running at a stable 60fps, packaged for distribution.

---

## 3. How We'll Run This

For each module I'll:
1. Teach the concepts (explanations, diagrams where useful, real code)
2. Quiz you on the core ideas before we move to implementation (like a Udemy "check your understanding" or a Harvard CS50-style problem set gate)
3. Walk you through building the milestone, with you writing the code
4. Review/debug together

I'll start with a short **Module 0/1 readiness quiz** now — this checks the baseline concepts (delta time, coordinate systems, OOP vs ECS thinking) before we touch a single line of engine code, so we don't build on shaky ground.
