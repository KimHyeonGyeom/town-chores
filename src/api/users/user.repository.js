import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';

export class UserRepository {

    /**
     * 유저 정보 조회
     * @param {object} raw {id : 소셜 아이디, transaction : 트랜잭션}
     */
    async findBySocialId(raw){
        try {
            return await sequelize.models.users.findOne({
                where: {
                    social_id: raw.id
                },transaction : raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 유저 정보 조회
     * @param {object} raw   {id : 유저 아이디, transaction : 트랜잭션}
     */
   async findById(raw){
        try{
            return await sequelize.models.users.findOne({
                attributes: [
                    'id','role','nickname','profile_image_url','device_token'],
                where: {
                    id : raw.id
                },
             transaction : raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }

    /**
     * 유저 정보 조회
     * @param{object} raw {nickname : 닉네임, transaction : 트랜잭션}
     */
    async findByNickName(raw){
        try {
            return sequelize.models.users.findOne({
                where: {
                    nickname: raw.nickname
                },transaction : raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 유저 레코드 수 조회
     * @param {object} raw {nickname : 닉네임, transaction : 트랜잭션}
     */
    async countByNickName(raw){
        try {
            return await sequelize.models.users.count({
                where: {
                    nickname: raw.nickname
                },transaction : raw.transaction
            })
        }catch(err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 유저 생성
     * @param {object} raw {role : 역할, nicnkname : 닉네임, social_id : 소셜 아이디, social_type : 소셜 타입, latitude : 위도, longitude : 경도,transaction : 트랜잭션}
     */
    async create(raw) {
        try{
            return await sequelize.models.users.create({
                role : raw.role,
                nickname : raw.nickname,
                social_id : raw.social_id,
                social_type : raw.social_type,
                latitude : raw.latitude,
                longitude : raw.longitude
            },{transaction: raw.transaction});
        }
        catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 유저 디바이스 토큰 수정
     * @param {object} raw {device_token : 디바이스 토큰, social_id : 소셜 아이디,transaction : 트랜잭션}
     */
    async updateDeviceToken(raw) {
        try {
            return await sequelize.models.users.update({
                device_token: raw.device_token,
            }, {
                where: {
                    social_id: raw.social_id
                },
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }
    /**
     * 유저 프로필 이미지 수정
     * @param {object} raw {profile_image_url : 프로필 이미지 경로, id : 유저 아이디, transaction : 트랜잭션}
     */
    async update(raw){
        try{
            return await sequelize.models.users.update({
                profile_image_url : raw.image[0].location
            },{
                where : {
                    id : raw.user_id
                },
                transaction: raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
}
