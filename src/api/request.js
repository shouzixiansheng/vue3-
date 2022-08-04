import axios from 'axios'
import { globalStore } from '@/store/global'
import {ElMessage} from "element-plus";
const service = axios.create({
    timeout: 5000
});

const userStore = globalStore()

service.interceptors.request.use(
    config => {
        const xToken= userStore.getToken || ''
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
            if (response.data.code === "0") {
                return response.data.data;
            }
            else {
                if (response.data.code === "3000"){
                    localStorage.removeItem("token")
                    localStorage.removeItem("ms_username")
                }
                ElMessage.error(response.data.message)
            }
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);


// export default function request(method, url, oData) {
//     let data  = clearParams(oData)
//     method = method.toLocaleLowerCase()
//     if (method == 'post') {
//       return service.post(url, data)
//     } else if (method == 'get') {
//       return service.get(url, {
//         params: data
//       })
//     } else if (method == 'delete') {
//       return service.delete(url, {
//         params: data
//       })
//     }
//   }

export default service;


