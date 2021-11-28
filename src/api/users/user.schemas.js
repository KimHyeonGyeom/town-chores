export const ajv = {
    login: {
        type: 'object',
        required: ['social_id','device_token'],
        properties: {
            social_id: {
                type: "string",
                minLength : 1,
            },
            device_token: {
                type: "string",
                minLength : 1,
            },
        },
        errorMessage: {
            required: {
                social_id: '소셜 아이디는 필수 입력값 입니다.',
                device_token: '디바이스 토큰은 필수 입력값 입니다.',
            },
            properties : {
                social_id: '소셜 아이디를 입력해주세요.',
                device_token: '디바이스 토큰을 입력해주세요.',
            }
        },
    },
    signUp: {
        type: 'object',
        required: ['nickname', 'social_id', 'social_type'],
        properties: {
            nickname: {
                type: 'string',
                minLength: 1,
            },
            social_id: {
                type: 'string',
                minLength: 1,
            },
            social_type: {
                type: 'string',
                minLength: 1,
            },
        },
        errorMessage: {
            required: {
                nickname: '[nickname] 닉네임은 필수 입력값 입니다.',
                social_id: '[social_id] 소셜 ID는 필수 입력값 입니다.',
                social_type: '[social_type] 소셜 타입은 필수 입력값 입니다.',
            },
            properties:{
                nickname: '[nickname] 닉네임을 입력해주세요. | 닉네임을 입력해주세요.',
                social_id: '[social_id] 소셜 ID를 입력해주세요.',
                social_type: '[social_type] 소셜 타입을 입력해주세요.',
            }
        },
    },
    getPushes: {
        type: 'object',
        required: ['page', 'size'],
        properties:{
            page :{
                type :'number',
                minimum : 1,
            },
            size :{
                type :'number',
                minimum : 1,
            },
        },
        errorMessage: {
            required: {
                page: '[page] 페이시 수는 필수 입력값 입니다.',
                size: '[size] 조회 레코드 수는 필수 입력값 입니다.',
            },
            properties :{
                page: '[page] 페이시 수가 비어있거나 1 보다 작습니다.',
                size: '[size] 조회 레코드 수가 비어있거나 1 보다 작습니다.',
            }
        },
    },
};