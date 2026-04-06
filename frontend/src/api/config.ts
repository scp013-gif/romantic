import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const client = axios.create({
    baseURL:'http://localhost:3000/api',
    timeout:10000
});

let isRefreshing = false;
let subscribe:((token:string) => void)[] = [];

client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use((res) => res,async (error) => {
    const { config,response } = error;
    if(response?.status === 401 && !config._retry){
        if(isRefreshing){
            return new Promise((resolve) => {
                subscribe.push(token => {
                    config.headers.Authorization = `Bearer ${token}`;
                    resolve(client(config));
                })
            });
        }
        config._retry = true;
        isRefreshing = true;
        try{
            const { refreshToken,updateAccessToken } = useAuthStore.getState();
            const { data } = await client.post('/auth/refresh',{refresh:refreshToken});
            updateAccessToken(data.accessToken);
            isRefreshing = false;
            subscribe.forEach(cb => cb(data.accessToken));
            subscribe = [];
            return client(config);
        }catch(error){
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})

export default client;