import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

export function sign(payload, options) {
    return jwt.sign(payload, jwtSecret, {
        algorithm: 'HS256',
        //expiresIn: '1d',
        ...options,
    });
}

export function verify(token, options) {
    return jwt.verify(token, jwtSecret, options);
}
