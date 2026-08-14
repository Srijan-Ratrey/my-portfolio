---
title: Battleship over WebSocket
order: 2
blurb: Two-player Battleship on Cloudflare Workers and Durable Objects — one room is one Durable Object that holds both fleets, runs every rule, and persists state, so a dropped connection resumes where it paused. Playable right now, against a friend by invite link or against the server's own bot.
detail: "The server is authoritative: a shot returns hit, miss or sunk for that one cell, and neither player is sent the other's layout until the game is over. The computer opponent runs server-side as a player with no socket and is a pure function over its own tracking grid — there is no parameter through which the opposing fleet could arrive, so the suite plays 80 games and fails if one ever finishes in under 20 shots. Hard hunts on parity and needs about 52 shots to Easy's 95. There are no accounts, and rooms have no timeout — they hibernate and evict naturally."
stack:
  - Cloudflare Workers
  - Durable Objects
  - WebSockets
  - SQLite
  - Vanilla JS
links:
  - label: Play
    href: https://battleship.sr5.workers.dev
  - label: Repo
    href: https://github.com/Srijan-Ratrey/battleship
  - label: How it works
    href: https://github.com/Srijan-Ratrey/battleship/blob/main/HOW-IT-WORKS.md
---
