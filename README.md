# MIND MAP- A MEMORY MATCH GAME
A simple, browser-based memory match game built with React and styled using Tailwind CSS. This game challenges players to find all matching pairs of cards in the fewest moves possible, with their best score being saved for future play.

## 📦 Setup
Before you begin, make sure you have **Node.js**, **npm** is installed

1. **Clone the Repository**
```bash
    git clone https://github.com/VishalVishwakarma553/MindMap.git
    cd MindMap
```

2. **Install Dependencies**
```bash
    npm install
```

3. **Start the dev server**
```bash
    npm run dev
```


## Controls

- **Clicking Cards:** Use your mouse or finger to click a card to flip it over. Click a second card to see if it's a match.
- **New Game:** Click the New Game button to reset the board, your moves, and the timer, and start a new game.
- **Pause/Resume:** Click the Pause button to temporarily stop the timer and disable card clicks. The button will change to Resume to allow you to continue where you left off.

## Features

- A standard memory match game where you flip two cards at a time to find pairs.
- The game's layout and card grid are designed to adapt to different screen sizes, from mobile phones to desktops.
- Keep an eye on your performance with a real-time move counter and a game timer.
- A simple leaderboard which content based on localstorage is included to demonstrate how a multiplayer ranking system could be implemented and it wil show the player who has scored maximum score