import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';
import pkg from 'sequelize';
import {constants} from "../../common/consts.js";

const {Op} = pkg;

export class PostRepository {

    /**
     * 게시글 생성
     * @param {object} raw - {user_id : 유저 아이디, title : 제목, content : 내용, latitude : 위도, longitude : 경도, area : 지역, transaction : 트랜잭션}
     */
    async create(raw) {
        try {
            return await sequelize.models.posts.create({
                    user_id: raw.user_id,
                    title: raw.title,
                    content: raw.content,
                    latitude: raw.latitude,
                    longitude: raw.longitude,
                    area: raw.area,
                }, {transaction: raw.transaction}
            );
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 게시글 수정
     * @param {object} raw - {post_id : 게시글 아이디, title : 제목, content : 내용,transaction : 트랜잭션}
     */
    async update(raw) {
        try {
            return await sequelize.models.posts.update({
                title: raw.title,
                content: raw.content,
            }, {
                where: {
                    id: raw.post_id
                },
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 게시글 상세 조회
     * @param {object} raw - {post_id : 게시글 아이디, user_id : 유저 아이디, transaction : 트랜잭션}
     */
    async findById(raw) {
        try {
            return await sequelize.models.posts.findOne({
                include: [
                    {
                        model: sequelize.models.images,
                        attributes: ['id', 'post_id', 'user_id',
                            [sequelize.literal(__("DB_QUERY_IMAGES_SEQ")), 'seq'], 'image_name_url'],
                        separate:true,
                        order: [['id', 'asc']],
                    },
                    {
                        model: sequelize.models.hashtags,
                        attributes: ['id', 'post_id',
                            [sequelize.literal(__("DB_QUERY_HASHTAGS_SEQ")), 'seq'], 'keyword'],
                        separate:true,
                        order: [['id', 'asc']],
                    },
                    {
                        model: sequelize.models.users,
                        attributes: ['id', 'nickname', 'profile_image_url'],
                    },
                ],
                attributes: [
                    'id', 'title', 'content', 'area'
                    , [sequelize.literal(__("DB_QUERY_POSTS_IS_LIKE", raw.user_id)), 'is_like']
                    , [sequelize.literal(__("DB_QUERY_LIKE_COUNT")), 'like_count']
                    , [sequelize.literal(__("DB_QUERY_POSTS_IS_MINE",raw.user_id)), 'is_mine']
                    , [sequelize.literal(__("DB_QUERY_POSTS_CREATED_DATE")), 'created_date']
                    , [sequelize.literal(__("DB_QUERY_POSTS_CREATED_TIME")), 'created_time']
                    , [sequelize.literal(__("DB_QUERY_COMMENT_COUNT")), 'comment_count']
                ],
                where: {
                    id: raw.post_id
                },
                order: [['created_at', 'desc']]
                ,transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 게시글 리스트 조회
     * @param {object} raw - {page : 조회 페이지, szie : 레코드 수, latitude : 위도, longitude : 경도, transaction : 트랜잭션, query : 검색어}
     */
    async findByAll(raw) {
        try {
            return await sequelize.models.posts.findAll({
                    include: [
                        {
                            model: sequelize.models.images,
                            attributes: ['id', 'post_id', 'user_id',
                                [sequelize.literal(__("DB_QUERY_IMAGES_SEQ")), 'seq'], 'image_name_url'],
                            separate : true,
                            order : [["id","asc"]]

                        },
                        {
                            model: sequelize.models.hashtags,
                            attributes: ['id', 'post_id',
                                [sequelize.literal(__("DB_QUERY_HASHTAGS_SEQ")), 'seq'], 'keyword'],
                            separate : true,
                            order : [["id","asc"]]

                        },
                        {
                            model: sequelize.models.users,
                            attributes: ['id', 'nickname', 'profile_image_url']
                        },
                    ],
                    attributes: [
                        'id', 'title', 'content', 'area', 'created_at',
                        [sequelize.literal(__("DB_QUERY_POSTS_IS_LIKE", raw.user_id)), 'is_like'],
                        [sequelize.literal(__("DB_QUERY_LIKE_COUNT")), 'like_count'],
                        [sequelize.literal(__("DB_QUERY_POSTS_CREATED_DATE")), 'created_date'],
                        [sequelize.literal(__("DB_QUERY_POSTS_CREATED_TIME")), 'created_time'],
                        [sequelize.literal(__("DB_QUERY_COMMENT_COUNT")), 'comment_count'],
                        raw.latitude && [sequelize.literal(__("DB_QUERY_POSTS_DISTANCE",raw.latitude ,raw.longitude ,raw.latitude)), 'distance']
                    ],
                    where: {
                        [Op.and]: [
                            //TODO 값이 존재할 때 조건을 실행하는 방법 말고 if문을 사용하여 검사할 수 있는 방법이 있는지 추후에 확인 필요
                            raw.titleOrComment_type && {id: {[Op.in]: [sequelize.literal(__("DB_QUERY_POSTS_SEARCH_TITLE_COMMENT",raw.query))]}},
                            raw.hashtag_type && {id: {[Op.in]: [sequelize.literal(__("DB_QUERY_POSTS_SEARCH_HASHTAG",raw.query))]}},
                        ],
                    },
                    having: raw.latitude && sequelize.literal('distance <= 2'),
                    offset: raw.page,
                    limit: parseInt(raw.size),
                    order: [['created_at', 'desc']],
                    transaction: raw.transaction,

                }
            )
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 해당 유저가 등록한 게시글 조회
     * @param {object} raw - {user_id : 유저 아이디, page : 조회 페이지, szie : 레코드 수, transaction : 트랜잭션}
     */
    async findByUserId(raw) {
        try {
            return await sequelize.models.posts.findAll({
                include: [
                    {
                        model: sequelize.models.images,
                        attributes: ['id', 'post_id', 'user_id', [sequelize.literal(__("DB_QUERY_IMAGES_SEQ")), 'seq'], 'image_name_url'],
                        separate:true,
                        order: [['id', 'asc']],
                    },
                    {
                        model: sequelize.models.hashtags,
                        attributes: ['id', 'post_id', [sequelize.literal(__("DB_QUERY_HASHTAGS_SEQ")), 'seq'], 'keyword'],
                        separate:true,
                        order: [['id', 'asc']],
                    },
                    {
                        model: sequelize.models.users,
                        attributes: ['id', 'nickname', 'profile_image_url']
                    }],
                attributes: [
                    'id', 'title', 'content', 'area', 'created_at'
                    , [sequelize.literal(__("DB_QUERY_POSTS_CREATED_DATE")), 'created_date']
                    , [sequelize.literal(__("DB_QUERY_POSTS_CREATED_TIME")), 'created_time']
                    , [sequelize.literal(__("DB_QUERY_COMMENT_COUNT")), 'comment_count']],
                where: {
                    user_id: raw.user_id
                },
                offset: raw.page,
                limit: parseInt(raw.size),
                order: [['created_at', 'desc']]
                , transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

    /**
     * 게시글 삭제
     * @param {object} raw - {post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async deletePostId(raw) {
        try {
            return await sequelize.models.posts.destroy({
                where: {
                    id: raw.post_id,
                },
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }
}