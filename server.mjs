// server.mjs (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Servir archivos estáticos del build de Vite
app.use(express.static(path.join(__dirname, "dist")));

// Fallback SPA (React Router)
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Importante: 0.0.0.0 y PORT del entorno
app.listen(port, "0.0.0.0", () => {
  console.log(`hourglow-pro sirviendo dist en http://localhost:${port}`);
});
