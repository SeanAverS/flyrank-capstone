# FlyRank Capstone 

An application optimized using AI-assisted  workflows.

## Tech Stack
- **Framework:** Next.js 
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Setup
```bash
npm install
npm run dev
```

## FE-07 Tool Contract: `suggestPedalPreset`

### Overview
Generates custom audio effects configurations based on a requested user guitar tone or musical genre.

### 1. Tool Name
* `suggestPedalPreset`

### 2. Input Schema (Zod)
* `styleName` (string): The name of the tone or genre (e.g., "Ambient Shoegaze", "Indie Rock").
* `boostEngaged` (boolean): Whether the `Chrono Boost` boost pedal is turned on.
* `gainLevel` (number, min: 0, max: 1): Gain knob value.
* `filterEngaged` (boolean): Whether the `Neon Pulse` pedal is turned on.
* `cutoffFreq` (number, min: 0, max: 1): Cutoff frequency knob value.
* `delayEngaged` (boolean): Whether the `Echo Cavern` pedal is turned on.
* `delayTime` (number, min: 0, max: 1): Delay time knob value.

### 3. Return Shape
```json
{
  "success": true,
  "preset": {
    "styleName": "Indie Rock",
    "boostEngaged": true,
    "gainLevel": 0.6,
    "filterEngaged": true,
    "cutoffFreq": 0.5,
    "delayEngaged": true,
    "delayTime": 0.4
  }
}