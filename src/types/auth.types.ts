export interface AppleIdTokenPayload {
  sub: string;
  email?: string;
}

export interface AppleFormProfile {
  name?: { firstName?: string; lastName?: string };
}

export interface TokenGenerationResult {
  token: string;
  expiresIn: number;
  tokenId: string;
  sessionId: string;
}
