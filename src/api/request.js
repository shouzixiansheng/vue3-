import axios from 'axios'
import { globalStore } from '@/store/global'
const service = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        const xToken= globalStore.getToken || ''
        config.headers = { "X-Token": xToken}
        return config
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);


export default function request(method, url, oData) {
    let data  = clearParams(oData)
    method = method.toLocaleLowerCase()
    if (method == 'post') {
      return service.post(url, data)
    } else if (method == 'get') {
      return service.get(url, {
        params: data
      })
    } else if (method == 'delete') {
      return service.delete(url, {
        params: data
      })
    }
  }
  
  

