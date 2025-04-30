import crypto from "crypto";

export const DOKU_CONFIG = {
  CLIENT_ID: process.env.DOKU_CLIENT_ID || "",
  SECRET_KEY: process.env.DOKU_SECRET_KEY || "",
  BASE_URL:
    process.env.NODE_ENV == "production"
      ? "https://api.doku.com"
      : "https://api-sandbox.doku.com",
};

export function getRequestDate(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Computes the signature for a Doku API request or callback.
 *
 * This function computes the signature as per the Doku API documentation.
 * The signature is computed using the Client-Id, Request-Id, Request-Timestamp,
 * Request-Target, and body digest.
 *
 * @param path - The request path, which is used in the signature computation.
 * @param body - The request body, which is used to compute the digest.
 * @param requestId - The request ID, which is used in the signature computation.
 * @param requestDate - The request date, which is used in the signature computation.
 * @returns The computed signature.
 */
export function generateSignature(
  path: string,
  body: object,
  requestId: string,
  requestDate: string
): string {
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("base64");

  const signatureRaw = [
    `Client-Id:${DOKU_CONFIG.CLIENT_ID}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestDate}`,
    `Request-Target:${path}`,
    `Digest:${digest}`,
  ].join("\n");

  return crypto
    .createHmac("sha256", DOKU_CONFIG.SECRET_KEY)
    .update(signatureRaw)
    .digest("base64");
}

/**
 * Verifies the signature of a Doku callback request to ensure its authenticity.
 *
 * @param headers - The headers from the incoming request, which include the
 *                  Client-Id, Request-Id, Request-Timestamp, and Signature.
 * @param rawBody - The raw JSON body of the request, which is used to compute the digest.
 * @param path - The request path, which is used in the signature computation.
 * @returns A boolean indicating whether the provided signature is valid.
 */
export function verifyCallbackSignature(
  headers: Headers,
  rawBody: string,
  path: string
): boolean {
  const clientId = headers.get("Client-Id") || "";
  const requestId = headers.get("Request-Id") || "";
  const timestamp = headers.get("Request-Timestamp") || "";
  const signature = headers.get("Signature") || "";

  const digest = crypto.createHash("sha256").update(rawBody).digest("base64");

  const signatureRaw = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${path}`,
    `Digest:${digest}`,
  ].join("\n");

  const expectedSignature = crypto
    .createHmac("sha256", DOKU_CONFIG.SECRET_KEY)
    .update(signatureRaw)
    .digest("base64");

  const valid = signature === `HMACSHA256=${expectedSignature}`;

  return valid;
}
