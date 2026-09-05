# Land record system - backend

Express API mirroring the four-layer architecture.

## Run it

```
npm install
npm start
```

Server starts on `http://localhost:4000`.

## Routes

| Layer | Base path | Purpose |
|---|---|---|
| 1 - Data acquisition | `/api/acquisition` | Upload scans, run OCR extraction |
| 2 - AI validation | `/api/validation` | Cross-checks, chain of title, fraud scoring |
| 3 - Secure storage | `/api/storage` | Write verified records, GIS parcels, ledger |
| 4 - User interface | `/api/interface` | Dashboard summary, farmer app, bank verification |

Every mock block is marked with a `TODO` comment showing where to swap in
the real OCR engine, ML models, database, and hashing.
