export type ResponseMessage = {
    status: string;
    message: unknown;
};

export type ErrorResponse = {
    error: string;
    message?: string;
};

export type tokenResponse = {
    token_type: "Bearer";
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

export type RequestResponse<T> = {
    response:
        | {
              response: T;
              tokens: tokenResponse;
          }
        | ErrorResponse;
};