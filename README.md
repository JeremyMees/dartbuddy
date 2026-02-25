# DartBuddy

DartBuddy is a darts scoring and game management application. It lets you create players, set up games, and track every throw across a full match — from individual darts to sets and legs.

## Features

### Player Management

Create and manage players with a first name, last name, and nickname. Player profiles persist across games and accumulate statistics over time.

### Game Setup

Configure games before they start:

- **Start score** — typically 501, but freely adjustable
- **Out type** — Double out, Master out, or Straight out
- **Legs to win** — number of legs required to win a set
- **Sets to win** — number of sets required to win the match

### Game Structure

Matches follow the standard darts format:

```
Game → Sets → Legs → Turns → Throws
```

Each turn records the player's starting score, total scored, remaining score, and whether the turn was a bust. Individual throws store the exact board segment hit (e.g. `D20`, `T19`, `25`) and the points scored.

### Live Scoring

During a game the app tracks:

- Current score per player
- Active player indicator
- Bust detection based on the configured out type (e.g. finishing on a single when double out is required counts as a bust)
- Three-dart average per player
- Sets and legs won per player

### Checkout Suggestions

A path finder utility suggests possible checkout routes for the remaining score, helping players plan their finish.

## Game History

Completed games are stored with a completion timestamp, end reason (completed, manual, or timed out), and the winner. Full turn and throw history is retained for review and statistics.

## Tech Stack

- **Nuxt 4** — full-stack Vue framework
- **Nitro** — server engine for API routes and backend logic
- **Prisma** — database ORM with PostgreSQL
- **Tailwind CSS + shadcn/ui** — styling and UI components
