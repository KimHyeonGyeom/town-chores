export const ajv = {
    addComment: {
        type: 'object',
        required: ['post_id', 'comment'],
        properties: {
            post_id: {
                type: "number",
                minimum : 1,
            },
            comment: {
                type: "string",
                minLength : 1,
            },
        },
        errorMessage: {
            required: {
                post_id: '[post_id] 게시글 ID는 필수 입력값 입니다.',
                comment: '[comment] 내용은 필수 입력값 입니다.',
            },
            properties : {
                post_id: '[post_id] 게시글 아이디가 비어있거나 1 보다 작습니다.',
                comment: '[comment] 내용을 입력해주세요. | 내용을 입력해주세요.',
            }
        },
    },
    getPostComments: {
        type: 'object',
        required: ['post_id'],
        properties: {
            post_id: {
                type: "number",
                minimum : 1,
            },
        },
        errorMessage: {
            required: {
                post_id: '[post_id] 게시글 아이디는 필수 입력값 입니다.',
            },
            properties : {
                post_id: '[post_id]게시글 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
    getComments: {
        type: 'object',
        required: ['comment_id'],
        properties: {
            comment_id: {
                type: "number",
                minimum : 1,
            },
        },
        errorMessage: {
            required: {
                comment_id: '[comment_id] 댓글 아이디는 필수 입력값 입니다.',
            },
            properties : {
                comment_id: '[comment_id] 댓글 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
    deleteComment: {
        type: 'object',
        required: ['comment_id'],
        properties: {
            comment_id: {
                type: "number",
                minimum : 1,
            },
        },
        errorMessage: {
            required: {
                comment_id: '[comment_id] 댓글 아이디는 필수 입력값 입니다.',
            },
            properties : {
                comment_id: '[comment_id] 댓글 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
};