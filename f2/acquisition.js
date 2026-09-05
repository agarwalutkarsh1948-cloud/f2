// routes/acquisition.js
// Layer 1 - Data acquisition
// Accepts scanned records (paper deeds, old maps, survey sheets) and runs OCR.

const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// In-memory queue standing in for a real job store (e.g. a Postgres table or SQS)
const uploadQueue = [];

// POST /api/acquisition/upload
// Accepts a scanned document (deed, survey sheet, old map) for OCR processing.
router.post('/upload', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document file provided' });
  }

  const record = {
    id: `DOC-${Date.now()}`,
    filename: req.file.originalname,
    sizeBytes: req.file.size,
    documentType: req.body.documentType || 'unspecified', // deed | survey_sheet | old_map
    status: 'queued_for_ocr',
    uploadedAt: new Date().toISOString(),
  };

  uploadQueue.push(record);

  // TODO: hand record.id + file buffer to the OCR worker (see /extract below)
  res.status(202).json({ message: 'Document received and queued for OCR', record });
});

// POST /api/acquisition/extract
// Runs OCR + field extraction on a queued document.
// Swap the mock block for a real OCR engine (e.g. Tesseract, Google Vision, or a fine-tuned model).
router.post('/extract', (req, res) => {
  const { documentId } = req.body;
  const record = uploadQueue.find((d) => d.id === documentId);
  if (!record) {
    return res.status(404).json({ error: `No queued document with id ${documentId}` });
  }

  // --- mock OCR output; replace with real OCR + NLP field parsing ---
  const extracted = {
    khasraNo: 'KH-2291',
    gataNo: 'GT-118',
    ownerName: 'R. Sharma',
    village: 'Rajpur',
    areaHectares: 1.42,
    confidence: 0.94,
  };

  record.status = 'extracted';
  res.json({ documentId, extracted, confidence: extracted.confidence });
});

// GET /api/acquisition/queue
// Lists documents awaiting or currently in OCR processing.
router.get('/queue', (req, res) => {
  res.json({ count: uploadQueue.length, queue: uploadQueue });
});

module.exports = router;
