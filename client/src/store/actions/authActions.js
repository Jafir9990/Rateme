import axios from "axios"
import { showError } from "./alertActions"

export const authActions = {
    SIGN_IN: 'signin',
    SIGN_OUT: 'signout',
    AUTH_LOADED:'authLoaded',
    AUTH_FAILED: 'authFailed',
    LOAD_TOKEN: 'loadToken'
}

export const signin = (user,token) => ({type: authActions.SIGN_IN,user,token,})


export const signout = () => {
    localStorage.removeItem('token')
    return{
        type:authActions.SIGN_OUT
    }
}

export const loadAuth = () => {
    return (dispatch,getState) => {

    const token = localStorage.getItem('token')
        dispatch({
            type:authActions.LOAD_TOKEN,
            token: token ? token : null
        })
        axios.get('/users/profile').then(({data}) =>{
          dispatch({
            type:authActions.AUTH_LOADED,
            user:data.user
          })
        }).catch(err => {
        if(token)
         dispatch(showError(err.message))

        })
    }
}