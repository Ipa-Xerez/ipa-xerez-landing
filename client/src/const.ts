export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = (returnPath?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  if (!oauthPortalUrl || !appId) {
    console.error("[getLoginUrl] Missing OAuth config:", { oauthPortalUrl, appId });
    alert("Error: Configuración de OAuth no disponible. Por favor, contacta al administrador.");
    return "#";
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  
  // State contiene: { origin, returnPath } (JSON + base64)
  // El servidor extrae origin para validar OAuth y redirigir correctamente
  const state = btoa(JSON.stringify({
    origin: window.location.origin,
    returnPath: returnPath || "/"
  }));

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  console.log("[getLoginUrl] Generated URL:", url.toString());
  return url.toString();
};
