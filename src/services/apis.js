
const BASE_URL=process.env.REACT_APP_BASE_URL

const categories={
    SHOWCATEGORIES_API:BASE_URL + "/categories/showAllCategories",
    GET_CATEGORY_DETAILS_PAGE_API:BASE_URL + "/categories/categoryPage"
}

export const resetPassword={
    RESET_PASSWORD_TOKEN_API:BASE_URL + "/auth/forgot-password",
    RESET_PASSWORD_API:BASE_URL + "/auth/reset-password"
}

export const auth={
    SIGNUP_API:BASE_URL + "/auth/signup",
    SEND_OTP_API:BASE_URL + "/auth/verify-otp",
    LOGIN_API:BASE_URL + "/auth/login",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password"
    
}

export const enquiry = {
    CONTACTUS_API : BASE_URL + "/contact-us"
}

export const courses={
    CREATE_COURSE_API:BASE_URL + "/courses/createCourse",
    EDIT_COURSE_API:BASE_URL + "/courses/editCourseDetails",
    GET_ENROLLED_COURSES_API: BASE_URL+ "/courses/getEnrolledCourses",
    GET_INSTRUCTOR_COURSES_API: BASE_URL + "/courses/getInstructorCourses",
    DELETE_COURSE_API:BASE_URL+"/courses/deleteCourse",
    GET_COURSE_DETAILS:BASE_URL + "/courses/getDetails",
    GET_COURSE_DETAILS_API_AUTHENTICATED: BASE_URL + "/courses/getFullCourseDetails"
}

export const profile={
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    DELETE_PROFILE_API: BASE_URL + "/profile/delete-account",
    UPDATE_PROFILE_PICTURE_API:BASE_URL + "/profile/update-profile-picture",
    UPDATE_CART_DETAILS:BASE_URL + "/profile/updateCartDetails"

}

export const rating_Review={
    GET_AVERAGE_RATING_API:BASE_URL+"/reviews/get-average-rating",
    CREATE_RATING_API:BASE_URL + "/reviews/create-rating",
    GET_ALL_REVIEWS:BASE_URL + "/reviews/get-all-ratings"
}

export const section={
    CREATE_SECTION_API:BASE_URL + "/section/create-section",
    UPDATE_SECTION_API:BASE_URL + "/section/update-section",
    DELETE_SECTION_API:BASE_URL + "/section/delete-section"
}

export const subSection={
    CREATE_SUBSECTION_API:BASE_URL + "/subSection/create-subSection",
    UPDATE_SUBSECTION_API:BASE_URL + "/subSection/update-subSection",
    DELETE_SUBSECTION_API:BASE_URL + "/subSection/delete-subSection",
    UPDATE_LECTURE_COMPLETION_STATUS_API:BASE_URL + "/subSection/updateLectureCompletionStatus"
}

export const payments={
    CAPTURE_PAYMENT_API:BASE_URL + "/buy-course",
    VERIFY_PAYMENT_API:BASE_URL + "/verify-payment",
    PAYMENT_SUCCESS_EMAIL:BASE_URL + "/paymentSuccessEmail"
}

export default categories