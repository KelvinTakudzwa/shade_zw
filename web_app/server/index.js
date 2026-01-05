import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files from the React App
// The "dist" folder is created by 'npm run build'
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes (Optional placeholder)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Catch-all handler: For any request that doesn't match an API route
// or static file, send back the React index.html.
// This supports client-side routing (React Router).
// Note: using regex /.*/ or /:splat*/ avoids Express 5 wildcard issues
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
