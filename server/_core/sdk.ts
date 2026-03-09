import { AXIOS_TIMEOUT_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes";
// Utility function
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
const GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
const GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;

class OAuthService {
  constructor(private client: ReturnType<typeof axios.create>) {
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }

  async getTokenByCode(
    code: string,
    redirectUri: string
  ): Promise<ExchangeTokenResponse> {
    const payload: ExchangeTokenRequest = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri,
    };

    const { data } = await this.client.post<ExchangeTokenResponse>(
      EXCHANGE_TOKEN_PATH,
      payload
    );

    return data;
  }

  async getUserInfoByToken(
    token: ExchangeTokenResponse
  ): Promise<GetUserInfoResponse> {
    const { data } = await this.client.post<GetUserInfoResponse>(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken,
      }
    );

    return data;
  }
}

const createOAuthHttpClient = (): AxiosInstance =>
  axios.create({
    baseURL: ENV.oAuthServerUrl,
    timeout: AXIOS_TIMEOUT_MS,
  });

class SDKServer {
  private readonly client: AxiosInstance;
  private readonly oauthService: OAuthService;

  constructor(client: AxiosInstance = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }

  private deriveLoginMethod(
    platforms: unknown,
    fallback: string | null | undefined
  ): string | null {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set<string>(
      platforms.filter((p): p is string => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (
      set.has("REGISTERED_PLATFORM_MICROSOFT") ||
      set.has("REGISTERED_PLATFORM_AZURE")
    )
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    if (set.has("REGISTERED_PLATFORM_WECHAT")) return "wechat";
    return null;
  }

  /**
   * Exchange authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, redirectUri);
   */
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<ExchangeTokenResponse> {
    return this.oauthService.getTokenByCode(code, redirectUri);
  }

  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(
    token: ExchangeTokenResponse
  ): Promise<GetUserInfoResponse> {
    return this.oauthService.getUserInfoByToken(token);
  }

  /**
   * Create a session token for a user
   */
  async createSessionToken(
    openId: string,
    options: {
      name: string;
      expiresInMs: number;
    }
  ): Promise<string> {
    const secret = new TextEncoder().encode(ENV.jwtSecret);
    const now = Math.floor(Date.now() / 1000);

    const token = await new SignJWT({
      openId,
      name: options.name,
      appId: ENV.appId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime(now + Math.floor(options.expiresInMs / 1000))
      .sign(secret);

    return token;
  }

  /**
   * Verify and decode a JWT session token
   */
  async verifySessionToken(token: string): Promise<SessionPayload> {
    const secret = new TextEncoder().encode(ENV.jwtSecret);
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as SessionPayload;
  }

  /**
   * Authenticate a request using session cookie
   */
  async authenticateRequest(req: Request): Promise<User | null> {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;

    const cookies = parseCookieHeader(cookieHeader);
    const sessionToken = cookies["manus-session"];

    if (!sessionToken) return null;

    try {
      const payload = await this.verifySessionToken(sessionToken);
      const user = await db.getUserByOpenId(payload.openId);
      return user || null;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        console.warn("[Auth] Invalid session token");
      } else {
        console.error("[Auth] Session verification failed:", error);
      }
      return null;
    }
  }

  /**
   * Get user information using JWT (for GetUserInfoWithJwt flow)
   */
  async getUserInfoWithJwt(
    request: GetUserInfoWithJwtRequest
  ): Promise<GetUserInfoWithJwtResponse> {
    const { data } = await this.client.post<GetUserInfoWithJwtResponse>(
      GET_USER_INFO_WITH_JWT_PATH,
      request
    );
    return data;
  }
}

export const sdk = new SDKServer();
