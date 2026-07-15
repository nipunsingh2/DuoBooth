# 📸 DuoBooth

> A modern, real-time remote photo booth experience built for two.

DuoBooth is an interactive web application that allows two users to join a shared room and take synchronized photo booth style pictures together, regardless of where they are in the world. With real-time WebRTC video streaming and Socket.io signaling, you can see your partner, strike a pose, and generate a beautiful composited photo strip to save and share.

## ✨ Features

- **Real-Time Video:** Low-latency peer-to-peer video streaming using WebRTC.
- **Synchronized Captures:** A shared countdown sequence ensures both users capture the moment at the exact same time.
- **Live Filters:** Instantly apply CSS image filters (Vintage, Sepia, Grayscale, etc.) to your live feed and final captures.
- **Customizable Layouts:** Choose from multiple photo strip grid layouts (e.g., 2x2, 1x4, alternating slots).
- **Beautiful Exports:** Download your final photostrip in multiple formats (PNG, JPEG, WebP, PDF) with customizable aesthetic frames (Polaroid, Minimal, Film).
- **Mobile Optimized:** Built to work flawlessly on both desktop and mobile browsers.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion (Animations)
- **State Management:** Zustand
- **Signaling & Network:** Socket.io, WebRTC
- **Exporting:** Canvas API, jsPDF, FileSaver.js

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/nipunsingh2/DuoBooth.git
cd DuoBooth
npm install
```

### 2. Start the Development Server
DuoBooth requires both the Next.js frontend and the Socket.io signaling server to be running. You can start both simultaneously using the provided `dev` script:

```bash
npm run dev
```

- The Next.js frontend will be available at `http://localhost:3000`
- The WebSocket signaling server runs on `http://localhost:3001`

*(Note: During local development, the frontend automatically defaults to connecting to `localhost:3001` for the signaling server).*

---

## 🌍 Deployment

DuoBooth requires a split deployment: the backend WebSocket server needs a persistent Node.js environment, while the frontend can be deployed to a standard Next.js hosting provider.

### 1. Deploy the Signaling Server (Render)
1. Go to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
4. Deploy the service and copy the generated Render URL (e.g., `https://duobooth-server.onrender.com`).

### 2. Deploy the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and create a new Project from your GitHub repository.
2. In the deployment settings, add the following Environment Variable:
   - **Name:** `NEXT_PUBLIC_SIGNALING_URL`
   - **Value:** *[Paste your Render URL here]*
3. Click **Deploy**.

Once finished, open your Vercel URL on any device, create a room, and share the invite link with a friend!

---

## 💡 How It Works
DuoBooth utilizes a hybrid networking approach:
1. **Socket.io** is used to coordinate state (who joined the room, grid selection, countdown triggers, phase changes).
2. **WebRTC** is used for the actual live video streaming. 
3. When a picture is taken, each client captures a high-resolution snapshot from their *local* webcam and uploads it over the Socket.io server to their partner, ensuring maximum photo quality without relying on compressed WebRTC streams.

## 📄 License
This project is open-source and available under the MIT License.
