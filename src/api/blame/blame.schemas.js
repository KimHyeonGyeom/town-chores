export const ajv = {
   addBlame: {
        type: 'object',
        required: ['target_id','target_user_id'],
        properties : {
            target_id :{
                type : "number",
                minimum : 1,
            },
            target_user_id :{
                type : "number",
                minimum : 1,
            }

       },
        errorMessage: {
            required: {
                target_id: '[target_id] 신고한 게시물, 댓글, 유저 아이디는 필수 입력값 입니다.',
                target_user_id: '[target_user_id] 신고를 당한 회원 아이디는 필수 입력값 입니다.',
            },
            properties : {
                target_id: '[target_id] 신고한 게시물, 댓글, 유저 아이디가 비어있거나 1 보다 작습니다.',
                target_user_id: '[target_user_id] 신고를 당한 회원 아이디가 비어있거나 1 보다 작습니다.',
            }
        },
    },
};