import { useDispatch } from "react-redux";
import categories, { auth, resetPassword } from "../apis";



const {SHOWCATEGORIES_API}=categories

const {SEND_OTP_API,SIGNUP_API,LOGIN_API}=auth;

const {RESET_PASSWORD_API,RESET_PASSWORD_TOKEN_API}=resetPassword

export const sendOTP = () => {
    return async (dispatch) => {

    }
}

export const signup = () => {
    return async (dispatch) =>{

    }
}

export const login = () => {
    return async (dispatch) => {
        
    }
}


export const getPasswordResetToken = () => {
    return async (dispatch) => {
        
    }
}

export const resetPassword = () => {
    return async (dispatch) => {

    }
}

export const logout = () => {
    return (dispatch) => {

    }
}

