import i18n from 'i18n';
import path from 'path';

const __dirname = path.resolve();

/** 옵션 설정 */
i18n.configure({
    locales:['ko'], //사용언어 설정 / 'de' 나 'ja' , 'fr' 등등 추가 가능
    directory: __dirname + '/locales', // 사용언어에 대한 템플릿폴더 생성위치,
    defaultLocale: 'ko', //기본 사용언어 설정
    register: global,
});

const initialize = (req, res, next) => {
    i18n.init(req, res);
    return next();
}
export default initialize
