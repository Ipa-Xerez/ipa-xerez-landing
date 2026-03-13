import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import multer from "multer";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerLocalAuthRoutes } from "./localAuth";
import { registerOAuthRoutes } from "./oauth";
import { serveStatic, setupVite } from "./vite";

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function initializeMembers() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const { getDb } = await import("../db");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const jsonPath = path.join(__dirname, "../../socios_ipa_xerez.json");
    
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, "utf-8");
      const members = JSON.parse(jsonData);
      const db = await getDb();
      
      if (db) {
        const { ipaMembers } = await import("../../drizzle/schema");
        let imported = 0;
        
        for (const member of members) {
          try {
            await db.insert(ipaMembers).values({
              memberNumber: member.memberNumber,
              fullName: member.fullName,
              status: "active",
            });
            imported++;
          } catch (e) {
            // Skip duplicates
          }
        }
        
        if (imported > 0) {
          console.log(`[Init] Imported ${imported} members from JSON`);
        }
      }
    }
  } catch (error) {
    console.warn("[Init] Could not initialize members:", error);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Initialize members on startup
  await initializeMembers();
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Image upload endpoint using Forge API
  app.post("/api/upload-image", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
      const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

      if (!forgeApiUrl || !forgeApiKey) {
        console.error("[Upload] Missing Forge API credentials");
        return res.status(500).json({ error: "Upload service not configured" });
      }

      // Create FormData for Forge API
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);

      const uploadResponse = await fetch(`${forgeApiUrl}/v1/files/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${forgeApiKey}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        console.error("[Upload] Forge API error:", error);
        return res.status(500).json({ error: "Upload to Forge failed" });
      }

      const uploadData = await uploadResponse.json();
      const url = uploadData.url || uploadData.file_url;

      console.log("[Upload] File uploaded to Forge:", req.file.originalname, "URL:", url);
      res.json({ url });
    } catch (error) {
      console.error("[Upload] Error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // tRPC API
  registerLocalAuthRoutes(app);
  console.log("✅ LocalAuth registrado correctamente");
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 10000;

server.listen(port, "0.0.0.0", () => {
console.log("Server running on port" + port);
});

}

startServer().catch(console.error);
