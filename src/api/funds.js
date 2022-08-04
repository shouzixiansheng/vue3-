import request from './request.js';

export const getCurrencyList = query => {
    return request({
        url: '/api/admin/capital/currency-log/list',
        method: 'get',
        params: query
    });
};

export const getRechargeList = query => {
    return request({
        url: '/api/admin/capital/recharge/list',
        method: 'get',
        params: query
    });
};

export const postUsdtWithdrawalAudit = query => {
    return request({
        url: '/api/admin/capital/usdt-withdrawal/audit',
        method: 'post',
        data: query
    });
};

export const getUsdtWithdrawalList = query => {
    return request({
        url: '/api/admin/capital/usdt-withdrawal/list',
        method: 'get',
        params: query
    });
};

export const getExpressExchangeList = query => {
    return request({
        url: '/api/admin/capital/express-exchange/list',
        method: 'get',
        params: query
    });
};

export const getTransferList = query => {
    return request({
        url: '/api/adminTransfer/list',
        method: 'get',
        params: query
    });
};

export const getFlatMoneyWithdrawalList = query => {
    return request({
        url: '/api/admin/capital/flatMoneyWithdrawal/list',
        method: 'get',
        params: query
    });
};
export const getAddressCollectionList = query => {
    return request({
        url: '/api/adminAddressCollection/queryList',
        method: 'get',
        params: query
    });
};
export const getBankList = query => {
    return request({
        url: '/api/adminBank/queryList',
        method: 'get',
        params: query
    });
};

export const postFlatMoneyWithdrawalEvidence = query => {
    return request({
        url: '/api/admin/capital/flatMoneyWithdrawal/evidence',
        method: 'post',
        data: query
    });
};

export const postFlatMoneyWithdrawalAudit = query => {
    return request({
        url: '/api/admin/capital/flatMoneyWithdrawal/audit',
        method: 'post',
        data: query
    });
};
