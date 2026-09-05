// server.js
// Entry point for the Land Record Digitization & Validation System API.
// Routes are organized to mirror the four-layer architecture:
//   Layer 1 - Data acquisition   (/api/acquisition)
//   Layer 2 - AI validation      (/api/validation)
//   Layer 3 - Secure storage     (/api/storage)
//   Layer 4 - User interface     (/api/interface)

const express = require('express');
const cors = require('cors');

const acquisitionRoutes = require('./routes/acquisition');
const validationRoutes = require('./routes/validation');
const storageRoutes = require('./routes/storage');
const interfaceRoutes = require('./routes/interface');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'land-record-system', time: new Date().toISOString() });
});

app.use('/api/acquisition', acquisitionRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/interface', interfaceRoutes);

// Central error handler - keeps every route's try/catch simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Land record system API listening on port ${PORT}`);
});
