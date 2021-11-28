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

const Push = {

    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment : '유저 아이디'
    },

    comment_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        comment : '댓글 아이디'
    },
    post_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        comment : '게시글 아이디'
    },

    reference_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment : '관계 유저 아이디'
    },

    title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment : '제목'
    },

    content: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment : '내용'
    },

    msg_division: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment : '메시지 구분 (1 : 댓글)',
        get() {
            const rawValue = this.getDataValue('msg_division');
            return Number(rawValue);
        },
    },

    is_read :{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment : '푸시알림 읽기 여부',
        defaultValue : false
    }
}

export default Push;