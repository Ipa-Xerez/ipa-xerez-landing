import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Required in ESM to recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      template = template.replace(
        src="/src/main.tsx",
        src="/src/main.tsx?v=${nanoid()}"
      );

      const page = await vite.transformIndexHtml(url, template);

      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  /**
   * In production Render runs:
   *   /opt/render/project/src/dist/index.js
   *
   * This file compiles to:
   *   /opt/render/project/src/dist/_core/vite.js
   *
   * So __dirname becomes:
   *   /opt/render/project/src/dist/_core
   *
   * The Vite build output is:
   *   /opt/render/project/src/dist/public
   *
   * Therefore we resolve ../public
   */

  const distPath = path.resolve(__dirname, "..", "public");
  const indexHtml = path.resolve(distPath, "index.html");

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(indexHtml);
  });
}
