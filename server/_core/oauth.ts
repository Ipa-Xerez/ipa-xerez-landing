import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function parseState(state: string): { origin: string; returnPath: string } {
  try {
    console.log("[OAuth] Raw state:", state);
    const decoded = Buffer.from(state, 'base64').toString('utf-8');
    console.log("[OAuth] Decoded state:", decoded);
    const parsed = JSON.parse(decoded);
    console.log("[OAuth] Parsed state object:", parsed);
    return {
      origin: parsed.origin || "http://localhost:3000",
      returnPath: parsed.returnPath || "/",
    };
  } catch (e) {
    console.error("[OAuth] Error parsing state:", e);
    console.error("[OAuth] State value was:", state);
    // Fallback: intenta extraer origin del header Host
    return {
      origin: "http://localhost:3000",
      returnPath: "/",
    };
  }
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      console.error("[OAuth] Missing code or state");
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      console.log("[OAuth] Processing callback...");
      console.log("[OAuth] Code:", code.substring(0, 20) + "...");
      console.log("[OAuth] State length:", state.length);
      
      // Decodificar state para obtener origin y returnPath
      const { origin, returnPath } = parseState(state);
      const redirectUri = `${origin}/api/oauth/callback`;
      
      console.log("[OAuth] Final redirect URL will be:", `${origin}${returnPath}`);

      // Intercambiar código por token usando el redirectUri correcto
      let userInfo: any;
      try {
        console.log("[OAuth] Calling exchangeCodeForToken with:", { redirectUri, codeLength: code.length });
        const tokenResponse = await sdk.exchangeCodeForToken(code, redirectUri);
        console.log("[OAuth] Token exchange successful");
        
        console.log("[OAuth] Getting user info...");
        userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
        console.log("[OAuth] User info retrieved:", { openId: userInfo.openId, email: userInfo.email });

        if (!userInfo.openId) {
          console.error("[OAuth] No openId in user info");
          res.status(400).json({ error: "openId missing from user info" });
          return;
        }
      } catch (tokenError) {
        console.error("[OAuth] Token exchange or user info failed:", tokenError);
        throw tokenError;
      }

      console.log("[OAuth] User info:", { openId: userInfo.openId, email: userInfo.email });

      // Guardar o actualizar usuario en base de datos
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      // Crear token de sesión
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Establecer cookie de sesión
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Determinar la ruta de redirección
      // Si el usuario es administrador, redirigir a /admin
      const ADMIN_EMAIL = "ipaagrupacionxerez@gmail.com";
      const finalReturnPath = userInfo.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "/admin" : returnPath;
      const finalRedirectUrl = `${origin}${finalReturnPath}`;
      console.log("[OAuth] Redirecting to:", finalRedirectUrl);
      res.redirect(302, finalRedirectUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed:", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
