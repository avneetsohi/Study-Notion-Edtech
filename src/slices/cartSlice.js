import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";




const initialState={
    
    
    itemCart:[],
    totalItems:0,
    total:0

}

const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const course=action.payload;
            const index=state.itemCart.findIndex((item)=>item._id===course._id)
            if(index>=0){
                toast.error("Course already in the cart");
                return
            }
            state.itemCart.push(course)
            state.totalItems++;
            state.total+=course.price;
            
            toast.success("Course added to the cart");
        },
        removeFromCart:(state,action)=>{
            const courseId=action.payload;
            const index=state.itemCart.findIndex((item)=>item._id===courseId)
            if(index>=0){
                state.totalItems--;
                state.total-=state.itemCart[index].price;
                state.itemCart.splice(index,1);
                
                toast.success("Course removed from the cart");
            }
        },
        setCart:(state,action)=>{
            state.itemCart=action.payload.itemCart
            state.total=action.payload.totalAmount
            state.totalItems=action.payload.totalItems

            
        },
        resetCart:(state)=>{
            state.total=0
            state.totalItems=0
            state.itemCart=[]

            toast.success("Cleared the cart")
            
            
        }
    }
})

export const {addToCart,removeFromCart,setCart,resetCart}=cartSlice.actions
export default cartSlice.reducer