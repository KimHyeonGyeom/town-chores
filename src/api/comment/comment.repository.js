import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';
import {constants} from "../../common/consts.js";


export class CommentRepository {

    /**
     * 댓글 상세 조회 (댓글에 포함된 대댓글 조회)
     * @param {object} raw - {comment_id : 댓글 아이디, transaction : 트랜잭션}
     */

    async findByIdOrParentCommentId(raw) {
        try {
            return (await Promise.all([
                sequelize.models.comments.findOne({
                    include: [
                        {
                            model: sequelize.models.users,
                            attributes: ['id', 'nickname', 'profile_image_url']
                        }],
                    attributes: ['id', 'post_id', 'parent_comment_id', 'comment',
                        [sequelize.literal(__("DB_QUERY_COMMENTS_IS_MINE", raw.user_id)), 'is_mine'],
                        [sequelize.literal(__("DB_QUERY_COMMENTS_IS_DELETED")), 'is_deleted'],
                        [sequelize.literal(__("DB_QUERY_COMMENTS_CREATED_TIME")), 'created_time']],
                    where: {
                        id: raw.comment_id
                    },
                    paranoid: false,
                    transaction: raw.transaction
                }),
                sequelize.models.comments.findAll({
                    include: [
                        {
                            model: sequelize.models.users,
                            attributes: ['id', 'nickname', 'profile_image_url']
                        }],
                    attributes: ['id', 'post_id', 'parent_comment_id', 'comment',
                        [sequelize.literal(__("DB_QUERY_COMMENTS_IS_MINE", raw.user_id)), 'is_mine'],
                        [sequelize.literal(__("DB_QUERY_COMMENTS_IS_DELETED")), 'is_deleted'],
                        [sequelize.literal(__("DB_QUERY_COMMENTS_CREATED_TIME")), 'created_time']],
                    where: {
                        parent_comment_id: raw.comment_id
                    },
                    paranoid: false,
                    transaction: raw.transaction
                })
            ])).flat()
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 게시글 댓글 리스트 조회
     * @param {object} raw - {post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async findByPostId(raw) {
        try {
            return await sequelize.models.comments.findAll({
                include: [
                    {
                        model: sequelize.models.users,
                        attributes: ['id', 'nickname', 'profile_image_url']
                    }],
                attributes: ['id', 'post_id', 'parent_comment_id', 'comment',
                    [sequelize.literal(__("DB_QUERY_COMMENTS_IS_MINE", raw.user_id)), 'is_mine'],
                    [sequelize.literal(__("DB_QUERY_COMMENTS_IS_DELETED")), 'is_deleted'],
                    [sequelize.literal(__("DB_QUERY_COMMENTS_CREATED_TIME")), 'created_time']],
                where: {
                    post_id: raw.post_id
                },
                paranoid: false,
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 댓글 조회
     * @param {object} raw - {id : 댓글 아이디, transaction : 트랜잭션}
     */
    async findById(raw) {
        try {
            return await sequelize.models.comments.findOne({
                include: [
                    {
                        model: sequelize.models.users,
                        attributes: ['id', 'nickname', 'profile_image_url']
                    }],
                attributes: ['id', 'post_id', 'parent_comment_id', 'comment',
                    [sequelize.literal(__("DB_QUERY_COMMENTS_IS_MINE", raw.user_id)), 'is_mine'],
                    [sequelize.literal(__("DB_QUERY_COMMENTS_IS_DELETED")), 'is_deleted'],
                    [sequelize.literal(__("DB_QUERY_COMMENTS_CREATED_TIME")), 'created_time']],
                where: {
                    id: raw.id
                },
                paranoid: false,
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 댓글 저장
     * @param {object} raw - {post_id : 게시글 아이디, user_id : 유저 아이디, parent_comment_id : 상위 댓글 아이디, comment : 댓글 내용, transaction : 트랜잭션}
     */
    async create(raw) {
        try {
            return await sequelize.models.comments.create({
                post_id: raw.post_id,
                user_id: raw.user_id,
                parent_comment_id: raw.parent_comment_id,
                comment: raw.comment
            }, {transaction: raw.transaction});
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 댓글 삭제
     * @param {object} raw - {id : 댓글 아이디, transaction : 트랜잭션}
     */
    async deleteById(raw) {
        try {
            return await sequelize.models.comments.destroy({
                where: {
                    id: raw.id
                }, transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }
}