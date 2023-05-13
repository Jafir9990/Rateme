import axios from "axios"
import { authActions } from "../store/actions/authActions";

export const configureAxios = (store) => {
    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

    axios.interceptors.request.use((config) => {
        const state = store.getState();
        if(state.auth.token)
          config.headers.Authorization = 'Bearer ' + state.auth.token
        return config;

    },(err) => Promise.reject(err))
    axios.interceptors.response.use(response => response,err => {
      if(err.response && err.response.status === 401)
      {
        store.dispatch({
          type:authActions.AUTH_FAILED
        })
        localStorage.removeItem('token')
        return Promise.reject(new Error('Authentication Failed'))
      }else{
        return Promise.reject(err)
      }
    });
}