import { z } from "zod";

const authorizationCodeShape = z.object({
    clientId: z.string(),
    redirectUri: z.string(),
    state: z.string(),
    userId: z.string(),
});

export function parseAuthorizationCode(data: any): AuthorizationCode {
    return authorizationCodeShape.parse(data);
}

export type AuthorizationCode = z.infer<typeof authorizationCodeShape>;


const authorizationSessionShape = z.object({
    clientId: z.string(),
    redirectUri: z.string(),
    state: z.string(),
});

export function parseAuthorizationSession(data: any): AuthorizationSession {
    return authorizationSessionShape.parse(data);
}

export type AuthorizationSession = z.infer<typeof authorizationSessionShape>;
