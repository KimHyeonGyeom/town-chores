export const ajv = {
    getAllPostsByUser: {
        type: 'object',
        required: ['page','size'],
        properties : {
            page : {
                type : 'number',
                minimum : 1,
            },
            size : {
                type : 'number',
                minimum : 1,
            }
        },
        errorMessage: {
            required: {
                page: '[page] 페이시 수는 필수 입력 값 입니다.',
                size: '[size] 조회 레코드 수는 필수 입력 값 입니다.',
            },
            properties: {
                page: '[page] 페이시 수가 비어있거나 1 보다 작습니다.',
                size: '[size] 조회 레코드 수가 비어있거나 1 보다 작습니다.',
            }
        },
    },
};