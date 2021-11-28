import {Sequelize} from "sequelize";

/**
 type : 데이터의 타입을 적어준다.
 allowNull : Null 값을 허용하는지, 안하는지 여부.
 unique : 고유의 값을 갖게 하는지.
 defaultValue : 기본값 설정이다. 여기선 생성 날짜를 입력하지 않으면 현재 시간을 저장하도록 한다.
 timestamp : createdAt과 updatedAt 컬럼을 자동 생성하고 입력한다.
 underscored : '_(언더바)'를 허용할건지 말건지.

 Sequelize.STRING(10), Sequelize.TEXT, Sequelize.DECIMAL(18,10), Sequelize.CHAR(1), Sequelize.INTEGER,
 **/

const Blame = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id :{
        type:Sequelize.BIGINT,
        allowNull: false,
        comment : '신고를 한 유저 아이디'
    },
    target_type:{
        type:Sequelize.BOOLEAN,
        comment : '1 : 게시물, 2 : 댓글, 3: 유저'
    },
    target_id :{
        type:Sequelize.BIGINT,
        allowNull: false,
        comment : '신고한 게시물, 댓글, 유저 아이디'
    },
    target_user_id:{
        type:Sequelize.BIGINT,
        comment : '신고를 당한 회원 아이디'
    },
}

export default Blame;