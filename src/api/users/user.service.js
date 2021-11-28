import * as jwt from "../../lib/jwt.js";
import {BadRequestException, NotFoundException} from '../../common/exceptions/index.js';
import {constants} from "../../common/consts.js";
import {isEmpty} from "../../lib/utils.js";
import {UserRepository} from "./user.repository.js";
import {PushRepository} from "../push/push.repository.js";

export class UserService {

    constructor(userRepository, pushRepository ) {
        /** @type {UserRepository} */
        this.userRepository = userRepository
        /** @type {PushRepository} */
        this.pushRepository = pushRepository
    }

    /**
     * 내정보 조회
     * @param {object} raw - {user_id : 유저 아이디, transaction : 트랜잭션 }
     */
    async getCurrentUser(raw) {
        return await this.userRepository.findById({
            id: raw.user_id,
            transaction: raw.transaction
        });
    }


    /**
     * 유저 프로필 수정
     * @param {object} raw - {user_id : 유저 아이디, image : 프로필 이미지, transaction : 트랜잭션 }
     */
    async updateUser(raw) {

        //유저 프로필 수정
        if (!isEmpty(raw.image))
            await this.userRepository.update({
                user_id : raw.user_id,
                image : raw.image,
                transaction : raw.transaction
            });

        //수정 후 유저 조회 반환
        return await this.userRepository.findById({
            id: raw.user_id,
            transaction: raw.transaction
        });
    }

    /**
     * 회원가입
     * @param {object} raw {nickname : 닉네임, social_id : 소셜 아이디, social_type : 소셜 타입, latitude : 위도, longitude : 경도, transaction : 트랜잭션}
     */
    async signUp(raw) {

        //닉네임 정규식 체크
       if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(raw.nickname)) {
           throw new BadRequestException(__("ERROR_USER_NICKNAME_REGEX"), __("ERROR_USER_NICKNAME_REGEX"),__("CLIENT_MESSAGE_TOAST_TYPE"));
       }

        //닉네임 중복 체크
        const hasNickname = await this.userRepository.countByNickName({
            nickname: raw.nickname,
            transaction: raw.transaction
        });
        if (hasNickname) {
            throw new BadRequestException(__("ERROR_NICKNAME_NOT_FOUND_MESSAGE"));
        }

        //유정 정보 생성
        return this.userRepository.create({
            role: 'user',
            nickname: raw.nickname,
            social_id: raw.social_id,
            social_type: raw.social_type,
            latitude: raw.latitude,
            longitude: raw.longitude,
            transaction: raw.transaction
        });
    }

    /**
     * 로그인
     * @param {object} raw {social_id : 소셜 아이디, device_token : 디바이스 토큰}
     */
    async login(raw) {
        let user;

        //유저 정보 조회
        user = await this.userRepository.findBySocialId({
            id: raw.social_id,
            transaction: raw.transaction
        });
        if (!user) {
            throw new NotFoundException(__("ERROR_USER_NOT_FOUND_MESSAGE"));
        }

        //저장된 디바이스 토큰이 다르면 새로운 토큰으로 변경
        if (user.device_token !== raw.device_token) {
            await this.userRepository.updateDeviceToken(raw);
            user = await this.userRepository.findBySocialId({
                id: raw.social_id,
                transaction: raw.transaction
            });
        }

        //토큰 생성
        const token = jwt.sign({
            user_id: user.id,
        });


        return [token, user]
    }

    /**
     * 푸시 알람 조회
     * @param {object} raw - {user_id : 유저 아이디, transaction : 트랜잭션 }
     */
    async getPushes (raw){
       return await this.pushRepository.findAllByUserId({
            user_id : raw.user_id,
            size : raw.size,
            page : raw.page,
            transaction : raw.transaction
        })
    }
}
