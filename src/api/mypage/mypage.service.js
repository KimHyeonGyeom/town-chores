import {PostRepository} from "../post/post.repository.js";

export class MypageService {

    constructor(postRepository ) {
        /** @type {PostRepository} */
        this.postRepository = postRepository
    }

    /**
     * 해당 유저가 등록한 게시글 조회
     * @param {object} raw - {user_id : 유저 아이디, page : 조회 페이지, szie : 레코드 수, transaction : 트랜잭션}
     */
    async getAllPostsByUser(raw){
        return await this.postRepository.findByUserId(raw);
    }
}
