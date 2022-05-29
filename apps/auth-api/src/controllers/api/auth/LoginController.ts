import { Controller, Inject } from "@tsed/di";
import { Unauthorized, TemporaryRedirect } from "@tsed/exceptions";
import { $log } from "@tsed/logger";
import { BodyParams } from "@tsed/platform-params";
import { Post,  } from "@tsed/schema";
import { GetClientQueryHandler, GetClientQueryResult } from "../../../queries/clients/GetClientQuery";
import { Base64EncodingProvider } from "../../../providers/Encoding/Base64EncodingProvider";
import { UTF8EncodingProvider } from "../../../providers/Encoding/UTF8EncodingProvider";
import { JWTProvider } from "../../../providers/JWTProvider";
import { LoginQueryFailureResult, LoginQueryHandler, LoginQueryResult } from "../../../queries/auth/LoginQueryHandler";
import { domain } from "../../../config/envs";
import { AuthorizationCode, AuthorizationSession, parseAuthorizationSession } from "../../../types/JWTKinds";
import { LoginModel } from "./LoginModel";

@Controller("/login")
export class LoginController {
    constructor(
        @Inject(LoginQueryHandler)
        private readonly loginQueryHandler: LoginQueryHandler,
        @Inject(JWTProvider)
        private readonly jwtProvider: JWTProvider,
        @Inject(GetClientQueryHandler)
        private readonly getClientQueryHandler: GetClientQueryHandler,
        @Inject(UTF8EncodingProvider)
        private readonly utf8EncodingProvider: UTF8EncodingProvider,
        @Inject(Base64EncodingProvider)
        private readonly base64EncodingProvider: Base64EncodingProvider,
    ) {

    }

    @Post("/")
    async post(@BodyParams() model: LoginModel) {
        const sessionValue = this.jwtProvider.verifyJWT(model.session);

        const session: AuthorizationSession = parseAuthorizationSession(sessionValue);

        const client = await this.getClientQueryHandler.handle({
            clientId: session.clientId
        });

        if (!client.success) {
            $log.error("Client for which session was issued no longer exists");
            return new Unauthorized("Invalid session");
        }

        const redirectBase64 = await this.base64EncodingProvider
            .encode(await this.utf8EncodingProvider
                .decode(session.redirectUri));

        if (!(client as GetClientQueryResult).data.redirectUris.includes(redirectBase64)) {
            $log.error("Client doesn't have redirect uri that is present in session.");
            return new Unauthorized("Invalid session");
        }

        const login = await this.loginQueryHandler.handle({
            email: model.email,
            pass: model.pass
        });

        if (!login.success) {
            return new Unauthorized((login as LoginQueryFailureResult).message);
        }

        const authorizationCode = this.jwtProvider.issueJWT({
            clientId: session.clientId,
            redirectUri: session.redirectUri,
            state: session.state,
            userId: (login as LoginQueryResult).data.userId,
        } as AuthorizationCode, "10min",
            new URL(session.redirectUri).hostname,
            domain);

        const uri = new URL(session.redirectUri);
        uri.searchParams.append("authorization_code", authorizationCode);
        uri.searchParams.append("state", session.state);

        return new TemporaryRedirect(uri.toString());
    }
}

