import request from './request.js';

export const getUserQuery = query => {
    return request({
        url: '/api/adminUser/query',
        method: 'get',
        params: query
    });
};

export const getVerifyCodeAdminQuery = query => {
    return request({
        url: '/api/verifyCodeAdmin/query',
        method: 'get',
        params: query
    });
};

export const getRechargeStat = query => {
    return request({
        url: '/api/admin/capital/recharge/stat',
        method: 'get',
        params: query
    });
};

export const getUsdtWithdrawStat = query => {
    return request({
        url: '/api/admin/capital/usdt-withdrawal/stat',
        method: 'get',
        params: query
    });
};

export const getCurrencyLogStat = query => {
    return request({
        url: '/api/admin/capital/currency-log/stat',
        method: 'get',
        params: query
    });
};

export const getUserAddress = query => {
    return request({
        url: '/api/adminUser/address',
        method: 'get',
        params: query
    });
};

export const getUserStatistical = query => {
    return request({
        url: '/api/adminTransfer/statistical',
        method: 'get',
        params: query
    });
};

export const postUpdateUserStatus = query => {
    return request({
        url: '/api/adminUser/updateUserStatus',
        method: 'post',
        params: query
    });
};