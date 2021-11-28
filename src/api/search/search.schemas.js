export const ajv = {
    getAll: {
        type: 'object',
        required: ['latitude', 'longitude',  'size','page'],
        properties: {
            latitude: {
                type: "number",
                minimum : 1,
            },
            longitude: {
                type: "number",
                minimum : 1,
            },
            size: {
                type: "number",
                minimum : 1,
            },
            page: {
                type: "number",
                minimum : 1,
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
                query : '[query] 검색어를 입력해주세요. | 검색어를 입력해주세요.'
            }
        },
    },
};