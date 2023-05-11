import axios from "axios"

export const authActions = {
    SIGN_IN: 'signin',
    SIGN_OUT: 'signout',
    AUTH_LOADED:'authLoaded',
    AUTH_FAILED: 'authFailed',
    LOAD_TOKEN: 'loadToken'
}

export const signin = (user,token) => ({type: authActions.SIGN_IN,user,token,})
export const loadToken = () => {
    const token = localStorage.getItem('token')
    return{
        type:authActions.LOAD_TOKEN,
        token: token ? token : null
    }
}
export const loadAuth = () => {
    return (dispatch,getState) => {
        axios.get('/users/profile').then(({data}) =>{
          dispatch({
            type:authActions.AUTH_LOADED,
            user:data.user
          })
        }).catch(err => {
            console.log(err)

        })
    }
}