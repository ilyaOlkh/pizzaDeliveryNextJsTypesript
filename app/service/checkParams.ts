import { UserJwtPayload, JwtPayload } from "jsonwebtoken";

export function checkSortDir(value: string): 'asc' | 'desc' {
    if (value !== 'asc' && value !== 'desc')
        return 'desc'
    else
        return value
}

export function UserJwtPayloadCast(payload: JwtPayload): UserJwtPayload {
    const errors: string[] = [];

    if (typeof payload !== 'object' || payload === null) {
        throw new Error('Payload is not an object or is null');
    }

    if (typeof payload.customer_id !== 'number') {
        errors.push('customer_id must be a number');
    }
    if (typeof payload.first_name !== 'string') {
        errors.push('first_name must be a string');
    }
    if (typeof payload.last_name !== 'string') {
        errors.push('last_name must be a string');
    }
    if (typeof payload.phone !== 'string') {
        errors.push('phone must be a string');
    }
    if (typeof payload.email !== 'string') {
        errors.push('email must be a string');
    }
    if (typeof payload.street !== 'string') {
        errors.push('street must be a string');
    }
    if (typeof payload.house !== 'string') {
        errors.push('house must be a string');
    }
    if (typeof payload.entrance !== 'string' && payload.entrance !== null) {
        errors.push('entrance must be a string or null');
    }
    if (typeof payload.floor !== 'number' && payload.floor !== null) {
        errors.push('floor must be a number or null');
    }
    if (typeof payload.apartment !== 'number' && payload.apartment !== null) {
        errors.push('apartment must be a number or null');
    }
    if (typeof payload.intercom_code !== 'string' && payload.intercom_code !== null) {
        errors.push('intercom_code must be a string or null');
    }
    if (typeof payload.discount !== 'number') {
        errors.push('discount must be a number');
    }
    if (typeof payload.role !== 'string' && payload.role !== null) {
        errors.push('role must be a string or null');
    }

    if (errors.length > 0) {
        throw new Error('Invalid token payload structure: ' + errors.join(', '));
    }

    return payload as UserJwtPayload;
}