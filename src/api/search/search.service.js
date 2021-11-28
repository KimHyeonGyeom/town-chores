import {PostRepository} from "../post/post.repository.js";

export class SearchService {

    constructor(postRepository ) {
        /** @type {PostRepository} */
        this.postRepository = postRepository
    }

  /**
   * 게시글 검색 리스트 조회 (검색 타입 : 해시태그, (제목,내용))
   * @param {object} raw - { titleOrComment_type : 제목, 내용 조회 타입,
   *                         hashtag_type : 해시태그 조회 타입
   *                         latitude : 위도,
   *                         longitude : 경도,
   *                         area : 지역,
   *                         size: 레코드 수,
   *                         page: 페이지 번호,
   *                         transaction :  트랜잭션 }
   */
   async getAllPosts(raw){
      return await this.postRepository.findByAll(raw)
    }
}