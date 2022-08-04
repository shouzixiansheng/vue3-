import request from './request.js';


export const getCaptchaCode = query => {
    return request({
        url: '/api/captcha/code',
        method: 'get',
        params: query
    });
};

export const postLogin = query => {
    return request({
        url: '/api/admin/auth/login',
        method: 'post',
        data: query
    });
};