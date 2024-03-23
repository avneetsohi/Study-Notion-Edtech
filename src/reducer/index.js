import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import profileSlice from "../slices/profileSlice";

import courseSlice from "../slices/courseSlice";
import categorySlice from "../slices/categorySlice";
import cartSlice from "../slices/cartSlice";
import viewCourseSlice from "../slices/viewCourseSlice";


export const rootReducer=combineReducers({
    auth:authSlice,
    profile:profileSlice,
    cart:cartSlice,
    course:courseSlice,
    category:categorySlice,
    viewCourse:viewCourseSlice
})

