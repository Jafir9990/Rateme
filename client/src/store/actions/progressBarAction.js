export const progressBarActionTypes = {
    LOADING:'loading',
    LOADED:'loaded'
}

export const showProgressBar = () => ({type: progressBarActionTypes.LOADING})
export const hideProgressBar = () => ({type: progressBarActionTypes.LOADED})