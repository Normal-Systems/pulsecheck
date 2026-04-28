'use strict';

const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Database Setup
const db = new Database(':memory:');
db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    interval_minutes INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(monitor_id) REFERENCES monitors(id)
  );
  INSERT OR IGNORE INTO monitors (id, name, url, interval_minutes) VALUES
    (1, 'PulseCheck Self', 'https://pulsecheck.maelhann.com/health', 5),
    (2, 'Google', 'https://www.google.com', 5),
    (3, 'GitHub', 'https://github.com', 5);
`);

async function checkMonitor(monitor) {
  const start = Date.now();
  let status = 'down', statusCode = null, responseTime = null;
  try {
    const res = await fetch(monitor.url, { timeout: 10000 });
    statusCode = res.status;
    responseTime = Date.now() - start;
    status = res.ok ? 'up' : 'degraded';
  } catch (err) {
    responseTime = Date.now() - start;
    status = 'down';
  }
  db.prepare('INSERT INTO checks (monitor_id, status, status_code, response_time_ms) VALUES (?, ?, ?, ?)').run(monitor.id, status, statusCode, responseTime);
  return { status, statusCode, responseTime };
}

async function runAllChecks() {
  const monitors = db.prepare('SELECT * FROM monitors').all();
  for (const monitor of monitors) { await checkMonitor(monitor); }
}

cron.schedule('* * * * *', runAllChecks);
runAllChecks().catch(console.error);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pulsecheck', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.get('/api/monitors', (req, res) => {
  const monitors = db.prepare(`
    SELECT m.*, c.status as last_status, c.status_code as last_status_code,
      c.response_time_ms as last_response_time, c.checked_at as last_checked_at
    FROM monitors m
    LEFT JOIN checks c ON c.id = (SELECT id FROM checks WHERE monitor_id = m.id ORDER BY checked_at DESC LIMIT 1)
    ORDER BY m.created_at ASC
  `).all();
  res.json({ monitors });
});

app.get('/api/monitors/:id/history', (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const monitor = db.prepare('SELECT * FROM monitors WHERE id = ?').get(id);
  if (!monitor) return res.status(404).json({ error: 'Monitor not found' });
  const history = db.prepare('SELECT * FROM checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ?').all(id, limit);
  const upCount = history.filter(c => c.status === 'up').length;
  const uptime = history.length ? ((upCount / history.length) * 100).toFixed(2) : '100.00';
  res.json({ monitor, history, uptime_percent: parseFloat(uptime) });
});

app.post('/api/monitors', (req, res) => {
  const { name, url, interval_minutes = 5 } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'name and url are required' });
  const result = db.prepare('INSERT INTO monitors (name, url, interval_minutes) VALUES (?, ?, ?)').run(name, url, interval_minutes);
  const monitor = db.prepare('SELECT * FROM monitors WHERE id = ?').get(result.lastInsertRowid);
  checkMonitor(monitor).catch(console.error);
  res.status(201).json({ monitor });
});

app.delete('/api/monitors/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM checks WHERE monitor_id = ?').run(id);
  const result = db.prepare('DELETE FROM monitors WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Monitor not found' });
  res.json({ deleted: true });
});

app.get('/api/status', (req, res) => {
  const monitors = db.prepare(`
    SELECT m.id, m.name, m.url, c.status as last_status,
      c.response_time_ms as last_response_time, c.checked_at as last_checked_at
    FROM monitors m
    LEFT JOIN checks c ON c.id = (SELECT id FROM checks WHERE monitor_id = m.id ORDER BY checked_at DESC LIMIT 1)
  `).all();
  const totalChecks = db.prepare('SELECT COUNT(*) as cnt FROM checks').get().cnt;
  const upChecks = db.prepare("SELECT COUNT(*) as cnt FROM checks WHERE status = 'up'").get().cnt;
  const overallUptime = totalChecks ? ((upChecks / totalChecks) * 100).toFixed(2) : '100.00';
  res.json({
    overall_uptime_percent: parseFloat(overallUptime),
    total_monitors: monitors.length,
    monitors_up: monitors.filter(m => m.last_status === 'up').length,
    monitors_down: monitors.filter(m => m.last_status === 'down').length,
    monitors,
    generated_at: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('PulseCheck running on port ' + PORT);
});
