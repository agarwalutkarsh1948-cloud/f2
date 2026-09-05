// routes/storage.js
// Layer 3 - Secure storage
// Persists verified records: relational store, GIS layer, and an
// append-only ledger for tamper evidence.

const express = require('express');
const router = express.Router();

// In-memory stand-ins for PostgreSQL + a hash-chained ledger table
const records = [];
const ledger = [];

function hashOf(payload) {
  // Placeholder hash - swap for crypto.createHash('sha256') in production
  return `hash_${Buffer.from(JSON.stringify(payload)).toString('base64').slice(0, 24)}`;
}

// POST /api/storage/records
// Writes a verified record to the structured store and appends a
// tamper-evident entry to the ledger.
router.post('/records', (req, res) => {
  const { record, geometry } = req.body;
  if (!record) {
    return res.status(400).json({ error: 'A verified record object is required' });
  }

  const stored = {
    id: `REC-${records.length + 1}`,
    ...record,
    geometry: geometry || null, // GeoJSON parcel boundary, if provided
    storedAt: new Date().toISOString(),
  };
  records.push(stored);

  const previousHash = ledger.length ? ledger[ledger.length - 1].hash : 'genesis';
  const entry = {
    seq: ledger.length + 1,
    recordId: stored.id,
    previousHash,
    hash: hashOf({ stored, previousHash }),
    timestamp: stored.storedAt,
  };
  ledger.push(entry);

  res.status(201).json({ record: stored, ledgerEntry: entry });
});

// GET /api/storage/records/:id
router.get('/records/:id', (req, res) => {
  const record = records.find((r) => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.json(record);
});

// GET /api/storage/parcels
// Returns stored records as a GeoJSON FeatureCollection for the GIS map view.
router.get('/parcels', (req, res) => {
  const features = records
    .filter((r) => r.geometry)
    .map((r) => ({ type: 'Feature', geometry: r.geometry, properties: { id: r.id, owner: r.ownerName } }));
  res.json({ type: 'FeatureCollection', features });
});

// GET /api/storage/ledger
// Returns the ledger so the chain of hashes can be independently verified.
router.get('/ledger', (req, res) => {
  res.json({ length: ledger.length, ledger });
});

module.exports = router;
