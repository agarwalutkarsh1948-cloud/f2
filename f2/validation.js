// routes/validation.js
// Layer 2 - AI validation engine
// Cross-checks extracted records against each other and flags problems.

const express = require('express');
const router = express.Router();

// POST /api/validation/cross-check
// Compares a newly extracted record against the existing dataset for
// duplicates, missing fields, and internal inconsistencies.
router.post('/cross-check', (req, res) => {
  const { record } = req.body;
  if (!record) {
    return res.status(400).json({ error: 'A record object is required' });
  }

  // TODO: replace with a real duplicate-detection + consistency-check model
  const issues = [];
  if (!record.ownerName) issues.push('missing_owner_name');
  if (!record.khasraNo) issues.push('missing_khasra_no');

  res.json({
    recordId: record.id || null,
    duplicateOf: null,
    issues,
    status: issues.length ? 'needs_review' : 'consistent',
  });
});

// POST /api/validation/chain-of-title
// Reconstructs the ownership history for a parcel and flags gaps or
// suspicious transfer timelines.
router.post('/chain-of-title', (req, res) => {
  const { khasraNo } = req.body;
  if (!khasraNo) {
    return res.status(400).json({ error: 'khasraNo is required' });
  }

  // TODO: query the historical transfer records table instead of mocking
  const history = [
    { owner: 'G. Sharma', from: '1994-03-01', to: '2011-07-14' },
    { owner: 'R. Sharma', from: '2011-07-14', to: null },
  ];

  res.json({ khasraNo, history, gapsFound: 0, timelineValid: true });
});

// POST /api/validation/fraud-check
// Scores a record for anomalies (forged signatures, altered figures,
// mismatched stamps) and returns a risk score.
router.post('/fraud-check', (req, res) => {
  const { record } = req.body;
  if (!record) {
    return res.status(400).json({ error: 'A record object is required' });
  }

  // TODO: replace with a trained anomaly-detection model
  const riskScore = Math.round(Math.random() * 20); // low by default in this mock

  res.json({
    recordId: record.id || null,
    riskScore,
    riskLevel: riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low',
    signalsChecked: ['signature_pattern', 'stamp_match', 'figure_consistency'],
  });
});

module.exports = router;
