# PulseCheck

Uptime monitoring SaaS — know before your customers do.

## Features
- Monitor HTTP endpoints every minute
- Live status dashboard
- Uptime percentage tracking
- Response time tracking
- REST API for programmatic access

## API Endpoints
- `GET /health` — Health check
- `GET /api/monitors` — List all monitors
- `GET /api/monitors/:id/history` — Get check history
- `POST /api/monitors` — Add a monitor
- `DELETE /api/monitors/:id` — Remove a monitor
- `GET /api/status` — Status page summary

## Running Locally
```bash
npm install
npm start
```

## Deployment
Deployed to Google Cloud Run at https://pulsecheck.maelhann.com
