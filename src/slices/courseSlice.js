import { createSlice } from "@reduxjs/toolkit"

const initialState={
    step:1,
    course:null,
    editDetails:false,
    paymentLoading:false,
}

const courseSlice=createSlice({
    name:"Course",
    initialState,
    reducers:{
        setStep:(state,action)=>{
            state.step=action.payload
        },
        setCourse:(state,action)=>{
            state.course=action.payload
        },
        setEditDetails:(state,action)=>{
            state.editDetails=action.payload
        },
        setPaymentLoading:(state,action)=>{
            state.paymentLoading=action.payload
        },
        resetCourseState:(state)=>{
            state.step=1
            state.course=null
            state.editDetails=false
        }
    }
})

export const {
    setStep,
    setCourse,
    setEditDetails,
    setPaymentLoading,
    resetCourseState
} = courseSlice.actions

export default courseSlice.reducer