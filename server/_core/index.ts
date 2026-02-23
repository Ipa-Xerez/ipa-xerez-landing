import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerLocalAuthRoutes } from "./localAuth";
import { serveStatic, setupVite } from "./vite";

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

  const port = parseInt(process.env.PORT || "3000");

server.listen(port, "0.0.0.0", () => {
  console.log(Server running on port ${port});
});
}

startServer().catch(console.error);
