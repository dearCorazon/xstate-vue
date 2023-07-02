import serviceAxios from "../config/index";
export const login = (username: any, password: any,code?:any) => serviceAxios({
    method: 'post',
    url:  'http://localhost:3000/auth/login',
    data: {username,password,code}    
  })

export const getCode = () => {
  return serviceAxios.get('http://localhost:3000/auth/authCode')
}
export const checkIsLogin = (token:string) => serviceAxios({
  method:'get',
  url:'http://127.0.0.1:3000/auth/profile',
  headers: {
    Authorization: `Bearer ${token}`,
  }
})
export const verify = (code:string) => serviceAxios({
  method: 'post',
  url: 'http://localhost:3000/auth/verifyCode',
  data: {code},
})
