import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://testingapi.alrowadit.com';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy Route for Medical API
  // This helps bypass CORS issues and keeps keys secure (if needed)
  app.all("/api/proxy/*", async (req, res) => {
    try {
      const endpoint = req.params[0];
      const targetUrl = `${API_BASE_URL}/${endpoint}`;
      
      console.log(`Proxying ${req.method} request to: ${targetUrl}`);

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
        // Don't throw on non-2xx status codes, we want to return the error from the API
        validateStatus: () => true,
      });

      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error("Proxy Error:", error.message);
      res.status(500).json({ 
        message: "The medical API is currently unreachable through the server proxy. Please check the network configuration.",
        error: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();