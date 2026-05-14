# Asian Cinematics Business Operating System

A full-stack enterprise SaaS platform built with the MERN stack (MongoDB, Express, React, Node.js) + TypeScript.

## Architecture

```
├── server/      # Express.js API (port 5000)
├── client/      # Customer-facing React app (port 3000)
├── admin/       # Admin dashboard React app (port 3001)
```

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Redis (IORedis), BullMQ, JWT, Socket.io, Zod, Winston
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Axios
- **Admin:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, Zustand

## Features

- E-commerce with cart, checkout, orders
- Service management & ticketing
- Site visit booking system
- Inquiry / lead management (CRM)
- Multi-role admin dashboard (super_admin, support, freelancer, employee)
- Real-time notifications (Socket.io)
- Background job processing (BullMQ)
- Analytics & reporting with CSV export
- Audit logging

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Create server/.env from server/.env.example

# Run all apps in dev mode
npm run dev
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values for MongoDB, Redis, JWT secrets, and SMTP.