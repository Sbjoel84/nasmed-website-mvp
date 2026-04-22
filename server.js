import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve built static files
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback — send index.html for every unmatched route (Express 4 + 5 compatible)
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`NASMED running on port ${PORT}`));
