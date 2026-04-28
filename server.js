'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// GET /api/status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    monitors: [
      {
        name: 'Homepage',
        url: 'https://example.com',
        status: 'up',
        uptime: '99.98%'
      },
      {
        name: 'API',
        url: 'https://api.example.com',
        status: 'up',
        uptime: '99.85%'
      },
      {
        name: 'Dashboard',
        url: 'https://app.example.com',
        status: 'degraded',
        uptime: '97.20%'
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
