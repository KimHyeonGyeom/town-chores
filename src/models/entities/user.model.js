import {Sequelize} from "sequelize";
import {isEmpty} from "../../lib/utils.js";

/**
  type : 데이터의 타입을 적어준다.
  allowNull : Null 값을 허용하는지, 안하는지 여부.
  unique : 고유의 값을 갖게 하는지.
  defaultValue : 기본값 설정이다. 여기선 생성 날짜를 입력하지 않으면 현재 시간을 저장하도록 한다.
  timestamp : createdAt과 updatedAt 컬럼을 자동 생성하고 입력한다.
  underscored : '_(언더바)'를 허용할건지 말건지.
**/

const User =
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type:Sequelize.STRING(20),
            allowNull: false
        },
        nickname: {
            type:Sequelize.STRING(20),
            allowNull: false, // Null 값을 허용하는지, 안하는지 여부.
            unique: true,
        },
        social_id: {
            type:Sequelize.STRING(200),
            allowNull: false, // Null 값을 허용하는지, 안하는지 여부.
            unique: true,
        },
        social_type: {
            type:Sequelize.CHAR(1),
            allowNull: false, // Null 값을 허용하는지, 안하는지 여부.
        },
        mobile_number: {
            type: Sequelize.STRING(11)
        },
        latitude: {
            type: Sequelize.DECIMAL(18,10),
            allowNull: true
        },
        longitude: {
            type: Sequelize.DECIMAL(18,10),
            allowNull: true
        },
        profile_image_url:{
            type: Sequelize.STRING(500),
            allowNull: true,
            get(){
                if(isEmpty(this.getDataValue('profile_image_url'))){
                    return process.env.DEFAULT_IMAGE_URL;
                }else
                    return this.getDataValue('profile_image_url');
            }
        },
        device_token : {
            type:Sequelize.STRING(1000),
            allowNull: true, // Null 값을 허용하는지, 안하는지 여부.
            unique: true,
        },
        is_deleted : {
            type: Sequelize.VIRTUAL,
            get() {
                const rawValue = this.getDataValue('is_deleted');
                return Boolean(rawValue);
            },
        },
    };

export default User;