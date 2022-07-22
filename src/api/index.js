import request from './request.js';

// dem  测试案例
export const fetchData = params => {
    return request('post', '/api/v1.0/role/save', params) 
};
