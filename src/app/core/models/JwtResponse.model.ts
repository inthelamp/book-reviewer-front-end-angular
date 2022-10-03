import { User } from "./User.model";

export interface JwtResponse {
    user: {
        id: string,
        username: string,
        role: string,
        status: string,
        access_token: string,
        token_expires: Date,
    }
}