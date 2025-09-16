# Ticketing Frontend (React + TypeScript)

This is the **frontend application** for the Ticketing System.  
It provides a responsive UI for **customers, agents, and admins** to manage support tickets in real time.

---

## Features
- React 18 + TypeScript + Vite
- Redux Toolkit for state management
- MUI for styling (light/dark themes)
- Role-based login (demo credentials included)
- Real-time updates via WebSocket (STOMP)
- Ticket management:
  - List, filter, paginate, sort
  - Ticket details with editable fields
  - Conversation thread with chat-style messages
  - Ticket creation form

  ## Setup & Run

### 1. Run the backend first
From the `ticketing-ws-server` folder:
```bash
npm install
npm run dev



# Ticketing WebSocket Backend

This project is a simple **backend server** for the Ticketing Frontend.  

STOMP WebSocket at `ws://localhost:8080/ws`
- Auto-seeds demo tickets at startup (`SEED_ON_START=true`)
- Broadcasts random ticket status changes/messages every 15s

## Setup & Run

### Prerequisites
- Node.js **>=18**
- npm **>=9**

### Local development
```bash
npm install
npm run dev