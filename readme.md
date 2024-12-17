# Catch the Moons Game 🔵

A fast-paced, interactive web game where players need to catch glowing moons before they disappear. Features a beautiful space background, smooth animations, and sound effects.

## 🎮 Game Features

- **Dynamic Gameplay**: Circles appear randomly and must be clicked before they disappear
- **Progressive Difficulty**: Game speed increases with level progression
- **Scoring System**: Points are awarded based on current level
- **Combo System**: Build combos by catching circles consecutively
- **Space Background**: Beautiful animated background with stars, asteroids, and shooting stars
- **Sound Effects**: Satisfying audio feedback when catching circles
- **Responsive Design**: Playable on both desktop and mobile devices

## 🛠️ Technical Features

- Built with React and modern hooks
- Framer Motion for smooth animations
- Web Audio API for sound effects
- Tailwind CSS for styling
- Lucide React icons

## 🚀 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 📦 Dependencies

- react
- framer-motion
- lucide-react
- tailwindcss

## 🎯 How to Play

1. Click the "Start" button to begin the game
2. Click on circles before they disappear
3. Each successful catch increases your score
4. Missing a circle ends the game
5. Try to beat your high score!

## 🎮 Game Controls

- **Start Button**: Begins a new game
- **Pause Button**: Pauses/resumes the current game
- **Restart Button**: Restarts the current game
- **Reset Button**: Resets the game state completely

## ⚙️ Game Mechanics

### Scoring
- Base score per circle = 10 points × current level
- Score multiplies with level progression
- High score is saved and displayed

### Leveling System
- Game starts at level 1
- Level increases every 10 successful catches
- Each level increases game speed
- Maximum level cap: 1000

### Circle Generation
- Circles appear at random positions
- Circle size varies randomly (20-50px)
- Generation rate increases with level

## 🎨 Visual Effects

### Circles
- Radial gradient coloring
- Pulse animation
- Glow effect
- Hover and click animations

### Background
- Twinkling stars
- Floating asteroids
- Shooting stars
- Dynamic animations

## 🔊 Audio System

- Web Audio API implementation
- Constant frequency sound (600Hz)
- Short duration effects (0.1s)
- Volume control with gain node

## 🔧 Customization

You can customize various aspects of the game by modifying the following:

### Visual Customization
```javascript
// In GameCircle component
const circleStyle = {
  background: 'radial-gradient(circle at 30% 30%, #93C5FD, #3B82F6)',
  boxShadow: '0 0 20px #93C5FD, 0 0 40px #3B82F6, 0 0 60px #2563EB'
};
```

### Game Parameters
```javascript
const INITIAL_LEVEL = 1;
const POINTS_PER_CIRCLE = 10;
const CIRCLE_LIFETIME = 2000; // milliseconds
const COMBO_THRESHOLD = 10;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.