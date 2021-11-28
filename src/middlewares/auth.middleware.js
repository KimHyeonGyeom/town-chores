import {ForbiddenException, UnauthorizedException} from '../common/exceptions/index.js';
import {verify} from '../lib/jwt.js';
import {isEmpty} from "../lib/utils.js";

export const verifyJWT = (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (isEmpty(req.session.key)) {
        throw new UnauthorizedException('세션이 없습니다. 로그인을 진행해주세요.', "");
    }

    if (bearerToken) {
        try {
            const token = bearerToken.replace(/^Bearer /, '');
            const decoded = verify(token);

            if (decoded.user_id !== req.session.key) {
                throw new ForbiddenException('인증 정보와 세션 정보가 다릅니다. (403)');
            }

            req.token_user_id = decoded.user_id;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError')
                throw new UnauthorizedException('토큰만료');

            throw new UnauthorizedException();
        }
    } else {
        throw new UnauthorizedException('인증이 필요합니다.');
    }
};
