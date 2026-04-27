import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios"


// let memoryToken:string|null = null

export class ApiService{

    private static instance:ApiService;
    private api: AxiosInstance;
    private memeoryToken:string|null=null;

    private constructor(){
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
            // baseURL: process.env.REACT_APP_BASE_URL || "http://localhost/3000",
            headers:{
                "Content-Type": "application/json"
            },
            withCredentials:true,
            timeout: 10000
        });

        this.memeoryToken = localStorage.getItem('token');

        this.initializeInterceptors()
    }
    public static getInstance():ApiService{
        if(!ApiService.instance){
            ApiService.instance = new ApiService()
        }
        return ApiService.instance
    }

    public async setToken(token:string|null):Promise<void>{
        this.memeoryToken=token
        return Promise.resolve()
    }
    public async getToken():Promise<string | null>{
        return this.memeoryToken
    }

    private async initializeInterceptors():Promise<void>{
        await this.api.interceptors.request.use(
            (config:InternalAxiosRequestConfig)=>{
                if(this.memeoryToken){
                    config.headers.Authorization = `${this.memeoryToken}`
                }
                return config
            },
            (error)=>Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response)=>response,
            async (error)=>{
                const originalRequest = error.config;
                if(error.response?.status === 401 && !originalRequest._retry){
                    originalRequest._retry =true
                    try{
                        const response=await axios.get(`${this.api.defaults.baseURL}/Auth/refresh`,{
                            withCredentials:true
                        })
                        const newToken = response.data.accessToken;
                        this.setToken(newToken)

                        originalRequest.headers.Authorization = `${newToken}`
                        return this.api(originalRequest)

                    }catch (refreshError){
                        this.setToken(null)
                        window.location.href="/"
                        return Promise.reject(refreshError)
                    }

                }
                return Promise.reject(error)
            }

        )
    }
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const res = await this.api.get<T>(url, config);
        // console.log(`\n\nresposta: ${res}\n`)
        return res.data;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const res = await this.api.post<T>(url, data, config);
        return res.data;
    }


}

export const api = ApiService.getInstance();