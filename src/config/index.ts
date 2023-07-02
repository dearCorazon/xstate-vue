import axios from 'axios'

// axios.defaults.baseURL = '127.0.0.1:3000'
const http  = axios

http.defaults.withCredentials = true

export default http