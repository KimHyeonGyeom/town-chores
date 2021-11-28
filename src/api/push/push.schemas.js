export const ajv = {
    updateIsRead: {
        type: 'object',
        required: ['push_id'],
        properties : {
            push_id : {
                type : 'number',
                minimum : 1,
            }
        },
        errorMessage: {
            required: {
                push_id: '[push_id] 알림 아이디는 필수 입력값 입니다.',
            },
            properties: {
                push_id : '[push_id] 알림 아이디가 비어있거나 1 보다 작습니다.'
            }
        },
    }
};