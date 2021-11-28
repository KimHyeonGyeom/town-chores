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

const Comment = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    post_id : {
        type:Sequelize.BIGINT,
        allowNull: false
    },
    user_id : {
        type:Sequelize.BIGINT,
        allowNull: false
    },
    parent_comment_id : {
        type:Sequelize.BIGINT,
        allowNull: true
    },
    comment : {
        type:Sequelize.TEXT,
        allowNull: false
    },
    is_deleted : {
        type: Sequelize.VIRTUAL,
        get() {
            const rawValue = this.getDataValue('is_deleted');
            return Boolean(rawValue);
        },
    },
    is_mine : {
        type: Sequelize.VIRTUAL,
        get() {
            const rawValue = this.getDataValue('is_mine');
            return Boolean(rawValue);
        },
    },
}

export default Comment;
