import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { processFacebookWebhookEvent, verifyWebhookSignature } from "../services/facebookWebhookService";

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

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Facebook Webhook endpoint
  app.post("/api/webhooks/facebook", express.json(), async (req, res) => {
    try {
      const signature = req.headers["x-hub-signature-256"] as string;
      const appSecret = process.env.FACEBOOK_APP_SECRET;

      if (appSecret && signature) {
        const body = JSON.stringify(req.body);
        const isValid = verifyWebhookSignature(body, signature, appSecret);
        if (!isValid) {
          console.warn("[Facebook Webhook] Invalid signature");
          return res.status(403).json({ error: "Invalid signature" });
        }
      }

      await processFacebookWebhookEvent(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[Facebook Webhook] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/webhooks/facebook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("[Facebook Webhook] Verified");
      res.status(200).send(challenge);
    } else {
      console.warn("[Facebook Webhook] Verification failed");
      res.status(403).json({ error: "Forbidden" });
    }
  });

  // tRPC API
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

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
