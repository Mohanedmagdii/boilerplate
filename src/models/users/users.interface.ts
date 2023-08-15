import { Types } from 'mongoose';

export interface UsersInterface extends _UsersInterface {
    _id?: string;
}

export interface _UsersInterface {
    status?: boolean,
    firstName?: string,
    lastName?: string,
    fullName: string,
    username?: string,
    email?: string,
    image?: string,
    password?: string,
    active?: boolean,
    provider?: UserProvidersType,
    google?: {
        id?: string,
        token?: string
    },
    facebook?: {
        id?: string,
        token?: string
    },
    phone?: string,
    statusText?: string,
    isVerified?: boolean,
    resetPasswordToken?: number,
    verificationPin?: number,
    verifiedBadge?: boolean,
    profileCreated?: boolean,
    tokens?: string[],
    role?: Types.ObjectId,
    views?: number,
    is_deleted?: boolean,
    deleteReason?: string
}

export enum UserProvidersType {
    GOOGLE = "google",
    FACEBOOK = 'facebook'
}