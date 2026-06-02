/**
 * VTurb Analytics HTTP client.
 *
 * Auth: 2 headers — X-Api-Token + X-Api-Version. POST endpoints use JSON body,
 * GET endpoints use query params. Retries 429 with exponential backoff.
 */

export const BASE_URL = "https://analytics.vturb.net";
export const API_VERSION = "v1";
export const TOKEN_ENV = "VTURB_API_TOKEN";

export class VturbError extends Error {
  public readonly status: number;
  public readonly details: Record<string, unknown>;

  constructor(
    message: string,
    status = 0,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "VturbError";
    this.status = status;
    this.details = details;
  }
}

function getToken(): string {
  const t = process.env[TOKEN_ENV];
  if (!t) {
    throw new VturbError(
      `Missing ${TOKEN_ENV}. Generate one at https://app.vturb.com/settings/analytics-api`,
      401,
    );
  }
  return t;
}

function strip<T extends Record<string, unknown>>(
  obj: T | undefined,
): Record<string, unknown> | undefined {
  if (!obj) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

async function safeJson(resp: Response): Promise<unknown> {
  try {
    return await resp.json();
  } catch {
    return { error: (await resp.text()).slice(0, 500) };
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export async function vturbRequest(
  method: "GET" | "POST",
  path: string,
  options: {
    params?: Record<string, unknown>;
    jsonBody?: Record<string, unknown>;
  } = {},
): Promise<unknown> {
  const token = getToken();
  const params = strip(options.params);
  const jsonBody = strip(options.jsonBody);

  let url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (params && method === "GET") {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) qs.append(k, String(v));
    url += `?${qs.toString()}`;
  }

  const headers: Record<string, string> = {
    "X-Api-Token": token,
    "X-Api-Version": API_VERSION,
    Accept: "application/json",
    "User-Agent": "vturb-mcp/0.1.0 (typescript)",
  };
  if (method === "POST") headers["Content-Type"] = "application/json";

  let lastResp: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await fetch(url, {
      method,
      headers,
      body:
        method === "POST" && jsonBody ? JSON.stringify(jsonBody) : undefined,
    });
    lastResp = resp;

    if (resp.ok) {
      const text = await resp.text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    }

    if (resp.status === 429) {
      const payload = (await safeJson(resp)) as Record<string, unknown>;
      if (attempt < 2) {
        await sleep(Math.pow(2, attempt + 1) * 1000);
        continue;
      }
      const msg =
        typeof payload.error === "string" ? payload.error : "Rate limited";
      throw new VturbError(
        msg,
        429,
        (payload.details as Record<string, unknown>) ?? {},
      );
    }

    const payload = (await safeJson(resp)) as Record<string, unknown>;
    const msg =
      (typeof payload.error === "string" && payload.error) ||
      (typeof payload.message === "string" && payload.message) ||
      `HTTP ${resp.status}`;
    throw new VturbError(msg, resp.status, payload);
  }

  throw new VturbError(
    `Max retries exceeded (${lastResp?.status ?? "no response"})`,
    lastResp?.status ?? 0,
  );
}

export async function vturbGet(
  path: string,
  params?: Record<string, unknown>,
): Promise<unknown> {
  return vturbRequest("GET", path, { params });
}

export async function vturbPost(
  path: string,
  jsonBody?: Record<string, unknown>,
): Promise<unknown> {
  return vturbRequest("POST", path, { jsonBody });
}
