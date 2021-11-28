import {NotFoundException} from '../../common/exceptions/index.js';
import {convertToTrees, pushAlarm, textLengthOverCut} from "../../lib/utils.js";
import {constants} from '../../common/consts.js';
import {CommentRepository} from "./comment.repository.js";
import {UserRepository} from "../users/user.repository.js";
import {PostRepository} from "../post/post.repository.js";
import {PushRepository} from "../push/push.repository.js";

export class CommentService {

    constructor(commentRepository, userRepository, postRepository, pushRepository ) {
        /** @type {CommentRepository} */
        this.commentRepository = commentRepository
        /** @type {UserRepository} */
        this.userRepository = userRepository
        /** @type {PostRepository} */
        this.postRepository = postRepository
        /** @type {PushRepository} */
        this.pushRepository = pushRepository
    }

    /**
     * 댓글 상세 정보 조회
     * @param {object} raw - {comment_id : 댓글 아이디, transaction : 트랜잭션}
     */
    async getComments(raw) {
        const comment = await this.commentRepository.findByIdOrParentCommentId(raw);
        if (!comment) {
            throw new NotFoundException(__("ERROR_COMMENT_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        return convertToTrees(comment, 'id', 'parent_comment_id', 'child_comments');
    }

    /**
     * 게시글 댓글 상세 정보 조회
     * @param {object} raw - {post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async getPostComments(raw) {

        const comments = await this.commentRepository.findByPostId(raw);
        if (!comments) {
            throw new NotFoundException(__("ERROR_COMMENT_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        return convertToTrees(comments, 'id', 'parent_comment_id', 'child_comments');
    }

    /**
     * 댓글 생성
     * @param {object} raw - {user_id : 유저 아이디, post_id : 게시글 아이디 , comment : 댓글 내용, parent_comment_id : 상위 댓글 아이디, transaction : 트랜잭션}
     */
    async addComment(raw) {
        let user;
        let comment;
        comment = await this.commentRepository.create(raw);

        //게시글 작성자가 댓글 등록 시 푸시 알람 X
        //게시글 조회
        const post = await this.postRepository.findById({
            post_id: raw.post_id,
            user_id : raw.user_id,
            transaction: raw.transaction
        })
        if(!post){
            throw new NotFoundException(__("ERROR_POST_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        if (post.user.dataValues.id !== raw.user_id) {
            //게시글 유저 아이디
            const user_id = post.user.dataValues.id;

            //유저 정보 조회
            user = await this.userRepository.findById({
                id: user_id,
                transaction: raw.transaction
            });
            if (!user) {
                throw new NotFoundException(__("ERROR_USER_NOT_FOUND_MESSAGE"), __("ERROR_USER_NOT_FOUND_CLIENT_MESSAGE"));
            }

            const push_body = __("PUSH_COMMENT_STRING",textLengthOverCut(post.title));
            //푸시 저장
            await this.pushRepository.create({
                user_id : user_id,
                comment_id : (raw.parent_comment_id !== undefined) ? raw.parent_comment_id : comment.id,
                post_id : post.id,
                reference_id : raw.user_id,
                title : __("PUSH_COMMENT_TITLE"),
                content : push_body,
                msg_division : 1, // 댓글
                transaction : raw.transaction
            })

            //댓글 푸시알람
            await pushAlarm({
                device_token: user.device_token,
                data: {
                    title: __("PUSH_COMMENT_TITLE"),
                    body: push_body,
                    deep_link: __("COMMENT_DEEP_LINK")
                }
            });
        }

        //댓글 조회
        comment = await this.commentRepository.findById({
            id: comment.id,
            user_id : raw.user_id,
            transaction: raw.transaction
        });
        if (!comment) {
            throw new NotFoundException(__("ERROR_COMMENT_NOT_FOUND_MESSAGE"), __("ERROR_POST_NOT_FOUND_CLIENT_MESSAGE"));
        }

        return comment
    }

    /**
     * 댓글 삭제
     * @param {object} raw - {id : 댓글 아이디, transaction : 트랜잭션}
     */
    async deleteComment(raw) {
        await this.commentRepository.deleteById(raw);
    }
}
