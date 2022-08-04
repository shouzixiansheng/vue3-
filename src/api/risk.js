import request from './request.js';

export const getRiskConfig = query => {
    return request({
        url: '/api/admin/risk/config',
        method: 'get',
        params: query
    });
};

export const postRiskConfigUpdate = query => {
    return request({
        url: '/api/admin/risk/update-config',
        method: 'post',
        data: query
    });
};

export const getRecoveryLog = query => {
    return request({
        url: '/api/recovery/recovery-log',
        method: 'get',
        params: query
    });
};

export const getRecoveryLogDetail = (hash, query) => {
    return request({
        url: `/api/recovery/recovery-log/${hash}/detail`,
        method: 'get',
        params: query
    });
};

export const postRecovery = query => {
    return request({
        url: '/api/recovery/recycle',
        method: 'post',
        data: query
    });
};