import axios from 'axios';

const client = axios.create();

/**
 * 글로벌 설정 예시 
 

 //api 주소를 다른 곳으로 사용 
 client.defaults.baseURL = 'http://external-api-server.com'

 //헤더 설정 
 client.defaults.headers.common['Authorization'] = 'Bearer a123c34'

 //인터셉터 
 axios.interceptors.response.use(\
    response => {
        //요청 성공 시 특정 작업 수행 
        return response;
    },
    error =>{
        //요청 실패 시 특정 작업 수행
        return Promise.reject(error);
    }
})
*/
