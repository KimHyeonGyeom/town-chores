export const ajv = {
    addPost: {
        type: 'object',
        required: ['title', 'content', 'latitude', 'longitude', 'area' ],
        properties: {
            title: {
                type: "string",
                minLength : 5
            },
            content: {
                type: "string",
                minLength : 10
            },
            latitude: {
                type: "number",
                minimum : 1
            },
            longitude: {
                type: "number",
                minimum : 1
            },
            area: {
                type: "string",
                minLength : 1
            },
            hashtags: {
                type: "array",
            },
        },
        errorMessage: {
            required: {
                title: '[title] 제목은 필수 입력값 입니다. | 제목은 필수입니다.',
                content: '[content] 내용은 필수 입력값 입니다. | 내용은 필수입니다.',
                latitude: '[latitude] 위도는 필수 입력값 입니다.',
                longitude: '[longitude] 경도는 필수 입력값 입니다.',
                area: '[area] 지역는 필수 입력값 입니다.',
            },
            properties : {
                title : '[title] 제목을 입력해주세요. | 제목은 최소 5글자 이상 작성해야 합니다.',
                content :'[content] 내용을 입력해주세요. | 내용은 최소 10글자 이상 작성해야 합니다.',
                latitude : '[latitude] 위도 값이 비어있거나 1 보다 작습니다.',
                longitude : '[longitude] 경도 값이 비어있거나 1 보다 작습니다.',
                area : '[area] 지역 값이 비어있거나 1 보다 작습니다.'
            }
        },
    },
    getPost: {
        type: 'object',
        required: ['post_id'],
        properties: {
            post_id: {
                type: "number",
                minimum : 1
            },
        },
        errorMessage: {
            required: {
                post_id: '[post_id] 게시글 ID는 필수 입력값 입니다.',
            },
            properties : {
                post_id: '[post_id] 게시글 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
    getAllPosts: {
        type: 'object',
        required: ['latitude', 'longitude',  'size','page'],
        properties: {
            latitude: {
                type: "number",
                minimum: 1
            },
            longitude: {
                type: "number",
                minimum : 1
            },
            size: {
                type: "number",
                minimum : 1
            },
            page: {
                type: "number",
                minimum : 1
            },
        },
        errorMessage: {
            required: {
                latitude : '[latitude] 위도는 필수 입력값 입니다.',
                longitude : '[longitude] 경도는 필수 입력값 입니다.',
                size: '[size] size는 필수 입력값 입니다.',
                page: '[page] page는 필수 입력값 입니다.',
            },
            properties : {
                latitude : '[latitude] 위도 값이 비어있거나 1 보다 작습니다.',
                longitude : '[longitude] 경도 값이 비어있거나 1 보다 작습니다.',
                size: '[size] size 값이 비어있거나 1 보다 작습니다.',
                page: '[page] page 값이 비어있거나 1 보다 작습니다.',
            }
        },
    },
    updatePost: {
        type: 'object',
        properties: {
            existing_images : {
                type: "array"
            }
        },

    },
    addLike: {
        type: 'object',
        required: ['post_id','post_user_id'],
        properties: {
            post_id: {
                type: "number",
                minimum : 1,
            },
            post_user_id: {
                type: "number",
                minimum : 1,
            },
        },
        errorMessage: {
            required: {
                post_id : '[post_id] 프로필 아이디는 필수 입력값 입니다.',
                post_user_id : '[post_user_id] 프로필 유저 아이디는 필수 입력값 입니다.',
            },
            properties : {
                post_id : '[post_id] 프로필 아이디가 비어있거나 1 보다 작습니다.',
                post_user_id : '[post_user_id] 프로필 유저 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
    delete: {
        type: 'object',
        required: ['post_id'],
        properties: {
            post_id: {
                type: "number",
                minimum: 1,
            },
        },
        errorMessage: {
            required: {
                post_id: '[post_id] 프로필 아이디는 필수 입력값 입니다.',
            },
            properties: {
                post_id: '[post_id] 프로필 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
};