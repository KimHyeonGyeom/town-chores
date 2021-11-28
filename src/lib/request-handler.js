import sequelize from "./database.js";
import {Sequelize} from "sequelize";


export const wrap = (handler) => async (req, res, next) => {
    try {

        //TODO 클라이언트 요청 마다 트랜잭션을 생성 후 라우터로 전달하도록 했는데, Controller -> Repository -> ResponseSucceed(commit) 트랜잭션 이동을 직접 해줘야 하는 문제가 있음.. 개선이 필요
        req.transaction = await  sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ});

        const response = await handler(req, res, next);

        /**  트랜잭션 커밋  */
        await req.transaction.commit();

       /**  응답 성공  */
        res.json({
            success: true,
            response: response
        });
        next();

    } catch (err) {
        next(err);
    }
};
