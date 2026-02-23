import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

// Helpers
function getBody(req: Request) {
  return (req.body ?? {}) as { email?: string; password?: string };
}

export function registerLocalAuthRoutes(app: Express) {
  // Necesitas JSON body
  // (si ya lo tienes en index.ts, no lo dupliques)
  // app.use(express.json());

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = getBody(req);

      const adminEmail = process.env.ADMIN_EMAIL ?? "";
      const adminPassword = process.env.ADMIN_PASSWORD ?? "";

      if (!email || !password) {
        res.status(400).json({ error: "email y password son requeridos" });
        return;
      }

      if (email !== adminEmail || password !== adminPassword) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      // Creamos un usuario admin “local” (openId fijo)
      const openId = "local-admin";

      await db.upsertUser({
        openId,
        name: "Admin",
        email,
        loginMethod: "local",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name: "Admin",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true });
    } catch (e) {
      console.error("[LocalAuth] login error", e);
      res.status(500).json({ error: "Login error" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // “me” lo resolvemos vía tRPC (/api/trpc/auth.me), NO hace falta ruta express extra
}
