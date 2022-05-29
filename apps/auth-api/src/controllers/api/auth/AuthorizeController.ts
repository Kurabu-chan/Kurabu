import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { QueryParams } from "@tsed/platform-params";
import { Get } from "@tsed/schema";
import { AuthorizationSession } from "../../../types/JWTKinds";
import { domain } from "../../../config/envs";
import { Base64EncodingProvider } from "../../../providers/Encoding/Base64EncodingProvider";
import { UTF8EncodingProvider } from "../../../providers/Encoding/UTF8EncodingProvider";
import { JWTProvider } from "../../../providers/JWTProvider";
import { GetClientQueryFailureResult, GetClientQueryHandler, GetClientQueryResult } from "../../../queries/clients/GetClientQuery";
import { AuthorizeModel } from "./AuthorizeModel";

@Controller("/authorize")
export class AuthorizeController {
    constructor(
        @Inject(GetClientQueryHandler)
        private readonly createClientCommandHandler: GetClientQueryHandler,
        @Inject(JWTProvider)
        private readonly jwtProvider: JWTProvider,
        @Inject(Base64EncodingProvider)
        private readonly base64EncodingProvider: Base64EncodingProvider,
        @Inject(UTF8EncodingProvider)
        private readonly utf8EncodingProvider: UTF8EncodingProvider
    ) {

    }

    @Get("/")
    async get(@QueryParams() model: AuthorizeModel) {
        const client = await this.createClientCommandHandler.handle({
            clientId: model.clientId
        });

        // check if client actually exists
        if (!client.success) {
            throw new NotFound((client as GetClientQueryFailureResult).message);
        }

        const utf8decodedUri = await this.utf8EncodingProvider.decode(model.redirectUri);
        const base64Uri = await this.base64EncodingProvider.encode(utf8decodedUri);

        // check if redirectUri is valid
        if (!(client as GetClientQueryResult).data.redirectUris.includes(base64Uri)) {
            throw new NotFound("Redirect uri not found");
        }

        const jwt = this.jwtProvider.issueJWT({
            clientId: model.clientId,
            redirectUri: model.redirectUri,
            state: model.state,
        } as AuthorizationSession, "10min",
            new URL(model.redirectUri).hostname,
            domain);

        const loginUrl = `https://${domain}/login?session=${jwt}`;
        const registerUrl = `https://${domain}/register?session=${jwt}`;
        return {
            login: loginUrl,
            register: registerUrl
        };
    }
}

