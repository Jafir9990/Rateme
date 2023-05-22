import { authActions } from "../actions/authActions"

const initState = {
    user: null,
    token: null,
    userType:null,
    isLoaded:false
}

const authReducer = (state =  initState, action) => {
    switch(action.type){
        case authActions.SIGN_IN:
            return{
                ...state,
                user:action.user,
                token:action.token,
                userType:action.userType,
                isLoaded:true 
            }
            case authActions.LOAD_TOKEN:
                return{
                    ...state,
                    token:action.token
                }
                case authActions.AUTH_LOADED:
                    return{
                        ...state,
                        user:action.user,
                        userType:action.user.type,
                        isLoaded: true
                    }
                    case authActions.SIGN_OUT:
                    case authActions.AUTH_FAILED:
                        return{
                            ...state,
                            user:null,
                            token:null,
                            userType:null,
                            isLoaded: true
                        }
                    case authActions.UPDATE_USER:
                        return{
                            ...state,
                            user: action.user
                        }
            default:
            return state
    }
}
export default authReducer;