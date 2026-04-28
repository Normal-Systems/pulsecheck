# PulseCheck ❤️

> Know before your customers do. Uptime monitoring in 60 seconds.

PulseCheck is a lightweight SaaS uptime monitoring service. It pings your endpoints every minute and alerts you when something goes down. It provides a public status page for your customers.

## What is PulseCheck?

PulseCheck continuously monitors your web services and APIs, alerting you the moment a service becomes unavailable or degrades. It features:

- **60-second checks** — rapid detection of outages
- **Instant alerts** — via email, SMS, Slack, or PagerDuty
- **Public status pages** — keep customers informed automatically

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 8080 by default. Visit [http://localhost:8080](http://localhost:8080).

## API Endpoints

### `GET /api/health`

Returns service health status.

**Response:**
```json
{ "ok": true }
```

### `GET /api/status`

Returns current monitor statuses.

**Response:**
```json
{
  "status": "operational",
  "monitors": [
    { "name": "Homepage",  "url": "https://example.com",     "status": "up",       "uptime": "99.98%" },
    { "name": "API",       "url": "https://api.example.com", "status": "up",       "uptime": "99.85%" },
    { "name": "Dashboard", "url": "https://app.example.com", "status": "degraded", "uptime": "97.20%" }
  ]
}
```

## Docker

Build and run with Docker:

```bash
# Build the image
docker build -t pulsecheck .

# Run the container
docker run -p 8080:8080 pulsecheck

# Run with a custom port
docker run -p 3000:3000 -e PORT=3000 pulsecheck
```

## Environment Variables

| Variable | Default | Description          |
|----------|---------|----------------------|
| `PORT`   | `8080`  | Port to listen on    |

## Seeding Firestore

To seed the Firestore `monitors` collection with demo data:

```bash
# Install firebase-admin first
npm install firebase-admin

# Run the seed script
node scripts/seed-firestore.js
```

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 4
- **Frontend:** Vanilla HTML/CSS/JS (zero dependencies)
- **Database:** Google Cloud Firestore
- **Container:** Docker (node:20-alpine)

## Project Structure

```
pulsecheck/
├── server.js          # Express app entry point
├── package.json       # Node.js project manifest
├── Dockerfile         # Container build instructions
├── README.md          # This file
├── public/
│   └── index.html     # Landing page (served as static file)
└── scripts/
    └── seed-firestore.js  # Seeds Firestore with demo data
```

## License

MIT © 2025 PulseCheck
