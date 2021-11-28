
export const constants = {
    /** 클라이언트 <-> 서버 메시지 규칙 */
    COMMENT_DEEP_LINK: 'tnc://pheed_detail?name=샤라랄라라',
    CLIENT_MESSAGE_TOAST_TYPE : 'toast',
    CLIENT_MESSAGE_POPUP_TYPE : 'popup',

    /** 에러 메시지 */
    ERROR_SERVER : '서버에서 응답에러가 발생 하였습니다. \r 앱 종료 후 다시 접속해 주세요.',
    ERROR_DATABASE : '데이터베이스 오류가 발생하였습니다.',

    /** 유저 */
    ERROR_USER_NICKNAME_REGEX : '닉네임은 띄어쓰기 없이 한글, 영문, 숫자만 가능해요.',
    ERROR_USER_NOT_FOUND_MESSAGE : '실패 - 유저 정보를 찾을 수 없습니다. (404)',
    ERROR_USER_NOT_FOUND_CLIENT_MESSAGE : '해당 유저 정보가 없습니다.',

    /** 댓글 */
    ERROR_COMMENT_NOT_FOUND_MESSAGE : '실패 - 댓글 정보를 찾을 수 없습니다. (404)',
    ERROR_COMMENT_NOT_FOUND_CLIENT_MESSAGE : '해당 댓글 정보가 없습니다.',

    /** 신고 */
    ERROR_BLAME_REPEATED_REPORTS_MESSAGE : '실패 - 이미 신고 하셨습니다. (400)',
    ERROR_BLAME_REPEATED_REPORTS_CLIENT_MESSAGE : '이미 신고 하셨습니다.',

    /** 닉네임 */
    ERROR_NICKNAME_NOT_FOUND_MESSAGE : '사용할 수 없는 닉네임입니다.',
    ERROR_NICKNAME_NOT_FOUND_CLIENT_MESSAGE : '사용할 수 없는 닉네임입니다.',

    /** 게시글 */
    ERROR_POST_NOT_FOUND_MESSAGE : '실패 - 게시글을 찾을 수 없습니다. (404).',
    ERROR_POST_NOT_FOUND_CLIENT_MESSAGE : '해당 유저가 등록한 게시글 정보가 없습니다.',
    ERROR_POST_HISTORY_ALREADY_EXISTS : '이미 좋아요한 글입니다.',

    /** 푸시알림 */
    PUSH_DEFAULT_TITLE : "동네잡일",
    PUSH_COMMENT_TITLE : "[댓글 작성]",
    PUSH_COMMENT_LAST_STRING : "에 대한 글에 댓글이 달렸습니다.",
    PUSH_LIKE_LAST_STRING : "님이 회원님의 게시물을 좋아합니다.",
    ERROR_PUSH_SEND : '푸시 알림 전송 실패',

    /** DB 쿼리 */
    DB_QUERY_USER_IS_DELETED: 'case when user.deleted_at is null then false else true end',
    DB_QUERY_COMMENTS_IS_DELETED: 'case when comments.deleted_at is null then false else true end',
    DB_QUERY_IMAGES_SEQ: 'DENSE_RANK() over (PARTITION by images.post_id order by images.created_at, images.id asc)',
    DB_QUERY_HASHTAGS_SEQ: 'DENSE_RANK() over (PARTITION by hashtags.post_id order by hashtags.created_at, hashtags.id asc)',
    DB_QUERY_POSTS_CREATED_DATE: 'DATE_FORMAT(posts.created_at, "%y.%m.%d")',
    DB_QUERY_COMMENTS_CREATED_DATE: 'DATE_FORMAT(comments.created_at, "%y.%m.%d")',
    DB_QUERY_POSTS_CREATED_TIME: 'case when  TIMESTAMPDIFF(day,posts.created_at,NOW()) > 0  then DATE_FORMAT(posts.created_at, "%y.%m.%d") ' +
                                      'when  TIMESTAMPDIFF(hour,posts.created_at,NOW()) > 0 then concat(TIMESTAMPDIFF(hour,posts.created_at,NOW()), "시간 전")' +
                                      'when  TIMESTAMPDIFF(minute,posts.created_at,NOW()) = 0 then concat("방금 전")' +
                                      'else concat(TIMESTAMPDIFF(minute,posts.created_at,NOW()),"분 전") end',
    DB_QUERY_COMMENTS_CREATED_TIME: 'case when  TIMESTAMPDIFF(day, comments.created_at,NOW()) > 0  then DATE_FORMAT(comments.created_at, "%y.%m.%d") ' +
                                      'when  TIMESTAMPDIFF(hour, comments.created_at,NOW()) > 0 then concat(TIMESTAMPDIFF(hour, comments.created_at,NOW()), "시간 전")' +
                                      'when  TIMESTAMPDIFF(minute,comments.created_at,NOW()) = 0 then concat("방금 전")' +
                                      'else concat(TIMESTAMPDIFF(minute, comments.created_at,NOW()),"분 전") end',

    DB_QUERY_COMMENT_COUNT: '(select COUNT(*) from comments c where post_id=posts.id) ',
    DB_QUERY_LIKE_COUNT: '(select count(post_id) from `likes` where post_id = posts.id and deleted_at is null )',
};