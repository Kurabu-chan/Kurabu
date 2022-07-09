import { Controller, Inject } from "@tsed/di";
import { Unauthorized, TemporaryRedirect, UnprocessableEntity, InternalServerError } from "@tsed/exceptions";
import { $log } from "@tsed/logger";
import { BodyParams } from "@tsed/platform-params";
import { Post, } from "@tsed/schema";
import { SendVerificationEmailCommandErrorResult, SendVerificationEmailCommandHandler } from "../../../commands/auth/SendVerificationEmailCommand";
import { GetClientQueryHandler, GetClientQueryResult } from "../../../queries/clients/GetClientQuery";
import { Base64EncodingProvider } from "../../../providers/Encoding/Base64EncodingProvider";
import { UTF8EncodingProvider } from "../../../providers/Encoding/UTF8EncodingProvider";
import { JWTProvider } from "../../../providers/JWTProvider";
import { noVerifyRegistrationExpirationClearNotation, RegisterQueryFailureResult, RegisterQueryHandler } from "../../../queries/auth/RegisterQueryHandler";
import { domain } from "../../../config/envs";
import { RegisterCommandErrorResult, RegisterCommandHandler, RegisterCommandResult } from "../../../commands/auth/RegisterCommand";
import { AuthorizationSession, parseAuthorizationSession, VerificationSession } from "../../../types/JWTKinds";
import { RegisterModel } from "./RegisterModel";

@Controller("/register")
export class RegisterController {
    constructor(
        @Inject(RegisterQueryHandler)
        private readonly registerQueryHandler: RegisterQueryHandler,
        @Inject(RegisterCommandHandler)
        private readonly registerCommandHandler: RegisterCommandHandler,
        @Inject(JWTProvider)
        private readonly jwtProvider: JWTProvider,
        @Inject(GetClientQueryHandler)
        private readonly getClientQueryHandler: GetClientQueryHandler,
        @Inject(UTF8EncodingProvider)
        private readonly utf8EncodingProvider: UTF8EncodingProvider,
        @Inject(Base64EncodingProvider)
        private readonly base64EncodingProvider: Base64EncodingProvider,
        @Inject(SendVerificationEmailCommandHandler)
        private readonly sendVerificationEmailCommandHandler: SendVerificationEmailCommandHandler
    ) {

    }

    @Post("/")
    async post(@BodyParams() model: RegisterModel) {
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

        const register = await this.registerQueryHandler.handle({
            email: model.email,
            pass: model.pass
        });

        if (!register.success) {
            return new UnprocessableEntity((register as RegisterQueryFailureResult).message);
        }

        const registerCommandResult = await this.registerCommandHandler.handle({
            email: model.email,
            pass: model.pass
        });

        if (!registerCommandResult.success) {
            return new InternalServerError(
                (registerCommandResult as RegisterCommandErrorResult).message);
        }

        const userId = (registerCommandResult as RegisterCommandResult).userId;

        // Send verification email
        const sendVerificationEmailCommandResult = await this.sendVerificationEmailCommandHandler
            .handle({
                email: model.email,
                userId
            });

        if (!sendVerificationEmailCommandResult.success) {
            return new InternalServerError(
                (sendVerificationEmailCommandResult as SendVerificationEmailCommandErrorResult)
                    .message);
        }

        // Create new session with new information
        const newSession = this.jwtProvider.issueJWT({
            clientId: session.clientId,
            redirectUri: session.redirectUri,
            state: session.state,
            userId,
            verified: false
        } as VerificationSession,
            noVerifyRegistrationExpirationClearNotation,
            new URL(session.redirectUri).hostname,
            domain
        );

        const verifyUrl = `https://${domain}/verify?session=${newSession}`;
        return new TemporaryRedirect(verifyUrl);
    }
}

