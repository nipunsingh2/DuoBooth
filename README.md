# DuoBooth

A modern, real-time remote photo booth experience built for two.

DuoBooth is an interactive web application that allows two users to join a shared room and take synchronized photo booth style pictures together, regardless of where they are in the world. 

**Live Demo:** [https://duo-booth.vercel.app/]

## Features

- **Real-Time Video:** Low-latency peer-to-peer video streaming using WebRTC.
- **Synchronized Captures:** A shared countdown sequence ensures both users capture the moment at the exact same time.
- **Live Filters:** Instantly apply CSS image filters (Vintage, Sepia, Grayscale, etc.) to your live feed and final captures.
- **Customizable Layouts:** Choose from multiple photo strip grid layouts (e.g., 2x2, 1x4, alternating slots).
- **High Quality Exports:** Download your final photostrip in multiple formats (PNG, JPEG, WebP, PDF) with customizable frames (Polaroid, Minimal, Film).
- **Cross-Platform:** Built to work flawlessly on both desktop and mobile browsers.

## Security & Privacy

DuoBooth is designed with privacy in mind by minimizing data retention and utilizing secure protocols:

- **Peer-to-Peer Video:** Video streaming is handled via WebRTC. Video and audio data flows directly between you and your partner, encrypted end-to-end, and never passes through or is stored on our servers.
- **Ephemeral Signaling:** The backend Node.js/Socket.io server acts strictly as a signaling relay. It connects users via short-lived WebSocket connections and immediately drops all room data when users disconnect.
- **Local Rendering:** Final image composition and PDF generation occurs entirely on the client-side within the user's browser. No photos are uploaded or saved to any remote database.
- **Strict Network Limits:** Data payloads are strictly capped at the WebSocket layer (10MB maximum buffer) to prevent memory exhaustion and abuse.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion
- **State Management:** Zustand
- **Signaling & Network:** Socket.io, WebRTC
- **Exporting:** Canvas API, jsPDF, FileSaver.js

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
git clone https://github.com/nipunsingh2/DuoBooth.git
cd DuoBooth
npm install
```

### Start the Development Server
DuoBooth requires both the Next.js frontend and the Socket.io signaling server to be running. You can start both simultaneously using the provided `dev` script:

```bash
npm run dev
```

- The frontend will be available at `http://localhost:3000`
- The signaling server runs on `http://localhost:3001`

## License
This project is open-source and available under the MIT License.
