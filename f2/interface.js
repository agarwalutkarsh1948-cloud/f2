// routes/interface.js
// Layer 4 - User interface
// Read-oriented endpoints for the three consumers of a verified record:
// the officer dashboard, the farmer mobile app, and bank verification calls.

const express = require('express');
const router = express.Router();

// GET /api/interface/dashboard/summary
// Powers the officer dashboard's stat strip and recent-records table.
router.get('/dashboard/summary', (req, res) => {
  res.json({
    digitizedToday: 1284,
    flaggedErrors: 37,
    verified: 942,
    pendingReview: 305,
    recentRecords: [
      { khasraNo: 'KH-2291', owner: 'R. Sharma', village: 'Rajpur', status: 'verified' },
      { khasraNo: 'KH-2292', owner: 'A. Bisht', village: 'Doiwala', status: 'pending' },
      { khasraNo: 'KH-2293', owner: 'S. Rawat', village: 'Vikasnagar', status: 'flagged' },
    ],
  });
});

// GET /api/interface/farmer/records/:khasraNo
// What the farmer mobile app shows for a single parcel - status only,
// no internal validation detail.
router.get('/farmer/records/:khasraNo', (req, res) => {
  res.json({
    khasraNo: req.params.khasraNo,
    owner: 'R. Sharma',
    status: 'verified',
    lastUpdated: new Date().toISOString(),
    notifications: ['Your record was verified on 2026-08-30'],
  });
});

// POST /api/interface/bank/verify
// Bank API: confirms ownership and returns a collateral-eligibility flag
// for a loan application, without exposing the full record.
router.post('/bank/verify', (req, res) => {
  const { khasraNo, claimedOwnerName } = req.body;
  if (!khasraNo || !claimedOwnerName) {
    return res.status(400).json({ error: 'khasraNo and claimedOwnerName are required' });
  }

  // TODO: look up the real record and compare names/status
  const ownershipMatches = claimedOwnerName.toLowerCase().includes('sharma');

  res.json({
    khasraNo,
    ownershipVerified: ownershipMatches,
    recordStatus: 'verified',
    collateralEligible: ownershipMatches,
  });
});

module.exports = router;
