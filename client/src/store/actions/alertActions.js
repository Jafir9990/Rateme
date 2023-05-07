export const alertActionTypes = {
    SHOW_SUCCESS:'showSuccess',
    SHOW_ERROR:'showError',
    SHOW_INFO:'showInfo',
    SHOW_WARNING:'showWarning',
    CLEAR_ALERT:'clearAlert'
}

export const showSuccess = (message) => ({type: alertActionTypes.SHOW_SUCCESS, message })
export const showError = (message) => ({type: alertActionTypes.SHOW_ERROR, message })
export const showInfo = (message) => ({type: alertActionTypes.SHOW_INFO, message })
export const showWarning = (message) => ({type: alertActionTypes.SHOW_WARNING, message })
export const clearAlert = () => ({type: alertActionTypes.CLEAR_ALERT })

