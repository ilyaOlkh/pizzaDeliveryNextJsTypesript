import * as jwt from 'jsonwebtoken'
import { IUser } from './user'

declare module 'jsonwebtoken' {
    export interface UserJwtPayload extends jwt.JwtPayload, IUser { }
}