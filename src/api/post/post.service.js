import {BadRequestException, NotFoundException} from '../../common/exceptions/index.js';
import {isEmpty, pushAlarm, textLengthOverCut} from "../../lib/utils.js";
import {constants} from "../../common/consts.js";
import {PostRepository} from "./post.repository.js";
import {ImageRepository} from "../image/image.repository.js";
import {HashtagRepository} from "../hashtag/hashtag.repository.js";
import {LikeRepository} from "../like/like.repository.js";
import {UserRepository} from "../users/user.repository.js";

export class PostService {

    constructor(postRepository, imageRepository,hashtagRepository,likeRepository,userRepository ) {
        /** @type {PostRepository} */
        this.postRepository =  postRepository
        /** @type {ImageRepository} */
        this.imageRepository = imageRepository
        /** @type {HashtagRepository} */
        this.hashtagRepository = hashtagRepository
        /** @type {LikeRepository} */
        this.likeRepository = likeRepository
        /** @type {UserRepository} */
        this.userRepository = userRepository
    }

    /**
     * 게시글 등록 (해시 태그, 이미지)
     * @param {object} raw - {user_id : 유저 아이디, title : 제목, content : 내용, latitude : 위도, longitude : 경도, area : 지역, file : 이미지, hashtags : 해시태그, transaction : 트랜잭션}
     */
    async addPost(raw){
        let imageList = [];
        let hashtagList = [];

        //게시글 DB 저장
        const post = await this.postRepository.create(raw);

        //게시글 이미지 DB 저장
        if(!isEmpty(raw.files)) {
            for (const {location: location} of raw.files) {
                imageList.push({
                    post_id: post.id,
                    user_id: raw.user_id,
                    image_name_url: location
                })
            }

            await this.imageRepository.bulkCreate({
                imageList: imageList,
                transaction: raw.transaction
            });
        }

        //해시태그 저장
        if(!isEmpty(raw.hashtags)){
            for(const keyword of raw.hashtags){
                hashtagList.push({
                    post_id : post.id,
                    keyword : keyword,
                })
            }
            await this.hashtagRepository.bulkCreate({
                hashtagList : hashtagList,
                transaction : raw.transaction
            });
        }

        return post;
    }
   /**
    * 게시글 수정 (해시 태그, 이미지)
    * @param {object} raw - {user_id : 유저 아이디, title : 제목, content : 내용, latitude : 위도, longitude : 경도, area : 지역, file : 이미지, hashtags : 해시태그, transaction : 트랜잭션}
    */
    async update(raw){
        let imageList = [];
        let hashtagList = [];

        //게시글 조회
        const post = await this.postRepository.findById({
            post_id : raw.post_id,
            user_id : raw.user_id,
            transaction : raw.transaction
        });
        if(!post){
            throw new NotFoundException(__("ERROR_POST_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        //제목, 내용 수정
        await this.postRepository.update({
            post_id : raw.post_id,
            title: raw.title,
            content: raw.content,
            transaction : raw.transaction
        });

       //이미지 삭제 처리
       if (!isEmpty(raw.existing_images)) {
           for (const image of raw.existing_images) {
               const {id} = JSON.parse(image);
               await this.imageRepository.deleteById({
                   id: id,
                   transaction: raw.transaction
               });
           }
       }

        //게시글 이미지 DB 저장
        if(!isEmpty(raw.files)){
        for(const {location : location } of raw.files){
            imageList.push({
                post_id : raw.post_id,
                user_id : raw.user_id,
                image_name_url : location
            })
        }

            await this.imageRepository.bulkCreate({
                imageList  : imageList,
                transaction : raw.transaction
            });
        }


        if(!isEmpty(raw.hashtags)){
            //해시태그 기존 데이터 삭제 후 저장
            await this.hashtagRepository.deletePostById({
                post_id : raw.post_id,
                transaction : raw.transaction
        });

            for(const keyword of raw.hashtags){
                hashtagList.push({
                    post_id : post.id,
                    keyword : keyword,
                })
            }
            await this.hashtagRepository.bulkCreate({
                hashtagList : hashtagList,
                transaction : raw.transaction
            });
        }

        const newPost = await this.postRepository.findById({
            post_id :  raw.post_id,
            user_id : raw.user_id,
            transaction : raw.transaction
        });
        if(!newPost){
            throw new NotFoundException(__("ERROR_POST_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        return newPost;
    }

    /**
     * 게시글 조회
     * @param {object} raw - {post_id : 게시글 아이디, user_id :  유저 아이디 , transaction : 트랜잭션}
     */
    async getPost(raw){
        const post =  await this.postRepository.findById({
            user_id : raw.user_id,
            post_id :  raw.post_id,
            transaction : raw.transaction
        });
        if(!post){
            throw new NotFoundException(__("ERROR_POST_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }
        return  post
    }

   /**
    * 게시글 리스트 조회
    * @param {object} raw - {  latitude : 위도, longitude : 경도, area : 지역, size: 레코드 수, page: 페이지 번호, transaction :  트랜잭션}
    */
   async getAllPosts(raw){
      return await this.postRepository.findByAll(raw)
    }

    /**
     * 게시글 삭제
     * @param {object} raw - {  latitude : 위도, longitude : 경도, area : 지역, size: 레코드 수, page: 페이지 번호, transaction :  트랜잭션}
     */
    async deletePost(raw){
        await this.postRepository.deletePostId(raw);
    }

    /**
     * 게시글 좋아요
     * @param {object} raw - {  user_id : 유저 아이디, post_id : 게시글 아이디, transaction :  트랜잭션}
     */
    async addLike(raw){

        //좋아요를 누른 유저 정보 조회
        const user = await this.userRepository.findById({
            id : raw.user_id,
            transaction : raw.transaction
        });
        if(!user){
            throw new NotFoundException(__("ERROR_USER_NOT_FOUND_MESSAGE"), __("ERROR_USER_NOT_FOUND_CLIENT_MESSAGE"));
        }

        //좋아요를 받은 게시물 유저 정보 조회
        const post_user = await this.userRepository.findById({
            id : raw.post_user_id,
            transaction : raw.transaction
        });
        if(!post_user){
            throw new NotFoundException(__("ERROR_USER_NOT_FOUND_MESSAGE"), __("ERROR_USER_NOT_FOUND_CLIENT_MESSAGE"));
        }

        if(!isEmpty(await this.likeRepository.findByUserIdAndBoardId(raw))) {
            //이미 좋아요한 내역이 있는 글에 좋아요를 추가하는 시도를 할 경우, 푸시 알림을 보내지 않는다.

            await this.likeRepository.update(raw); //기존 좋아요 삭제 이력을 초기화 한다.
        }
        else {

            //좋아요 추가
            await this.likeRepository.create(raw);
            //댓글 푸시알람
            await pushAlarm({
                device_token: post_user.device_token,
                data: {
                    title: __("PUSH_DEFAULT_TITLE"),
                    body:  __("PUSH_LIKE_STRING",user.nickname),
                    deep_link: __("COMMENT_DEEP_LINK")
                }
            });
        }

        return user;
    }
    /**
     * 게시글 좋아요 취소
     * @param {object} raw - {  user_id : 유저 아이디, post_id : 게시글 아이디, transaction :  트랜잭션}
     */
    async deleteLike(raw) {
        await this.likeRepository.deleteById(raw);
    }
}