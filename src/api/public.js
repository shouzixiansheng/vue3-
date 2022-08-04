import request from './request.js';

export const getImgPreSign = query => {
    return request({
        url: '/api/upload/img/pre-signed',
        method: 'get',
        params: query
    });
};

export const getReferenceRates = query => {
    return request({
        url: '/api/currency/reference-rates',
        method: 'get',
        params: query
    });
};