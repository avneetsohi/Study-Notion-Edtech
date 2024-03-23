const { Router } = require("express");
const { signup, sendOTP, login, changePassword } = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const { createCourse, showAllCourses, getCourseDetails, editCourseDetails, deleteCourse, getUserEnrolledCourse, getInstructorCourses, getFullCourseDetails } = require("../controllers/Courses");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/Category");
const { sendEnquiry } = require("../controllers/ContactUs");
const { capturePayment, verifySignature, verifyPayment, paymentSuccessEmail } = require("../controllers/Payments");
const { updateProfile, scheduleDeleteAccount, getAllUserDetails, updateProfilePicture, deleteAccount, editUserCartDetials} = require("../controllers/Profile");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");
const { createRating, getAverageRating, getAllRatings, getCourseRatings } = require("../controllers/RatingAndReviews");
const { auth, isStudent, isInstructor, isAdmin } = require("../middleware/auth");
const { updateLectureCompletionStatus } = require("../controllers/CourseProgress");

const router=Router();

// AUTHENTICATION ROUTES
router.post("/auth/signup",signup)
router.post("/auth/login",login)
router.post("/auth/verify-otp",sendOTP)
router.put("/auth/change-password",auth,changePassword)

// RESET PASSWORD
router.post("/auth/forgot-password",resetPasswordToken)
router.put("/auth/reset-password",resetPassword)

// CATEGORY ROUTES
router.post("/categories/createCategory",auth,isAdmin,createCategory)
router.get("/categories/showAllCategories",showAllCategories)
router.post("/categories/categoryPage",categoryPageDetails)

// COURSE ROUTES
router.post("/courses/createCourse",auth,isInstructor,createCourse)
router.put("/courses/editCourseDetails",auth,isInstructor,editCourseDetails)
router.get("/courses/showAllCourses",auth,showAllCourses)
router.post("/courses/getDetails",getCourseDetails)
router.post("/courses/getFullCourseDetails",auth,isStudent,getFullCourseDetails)
router.delete("/courses/deleteCourse",auth,isInstructor,deleteCourse)
router.get("/courses/getEnrolledCourses",auth,isStudent,getUserEnrolledCourse)
router.get("/courses/getInstructorCourses",auth,isInstructor,getInstructorCourses)


// SECTION ROUTES
router.post("/section/create-section",auth,isInstructor,createSection)
router.put("/section/update-section",auth,isInstructor,updateSection)
router.delete("/section/delete-section",auth,isInstructor,deleteSection)

// SUB SECTION ROUTES
router.post("/subSection/create-subSection",auth,isInstructor,createSubSection)
router.put("/subSection/update-subSection",auth,isInstructor,updateSubSection)
router.delete("/subSection/delete-subSection",auth,isInstructor,deleteSubSection)
router.put("/subSection/updateLectureCompletionStatus",auth,isStudent,updateLectureCompletionStatus)

// PROFILE ROUTES
router.put("/profile/updateProfile",auth,updateProfile)
router.put("/profile/update-profile-picture",auth,updateProfilePicture)
router.delete("/profile/delete-account",auth,isStudent,deleteAccount)
router.get("/profile/user-details",auth,getAllUserDetails)
router.post("/profile/updateCartDetails",auth,isStudent,editUserCartDetials)

// PAYMENT ROUTES
router.post("/buy-course",auth,isStudent,capturePayment)
router.post("/verify-payment",auth,isStudent,verifyPayment)
router.post("/paymentSuccessEmail",auth,isStudent,paymentSuccessEmail)
// router.post("/verify-signature",verifySignature)

// RATING AND REVIEW ROUTES
router.post("/reviews/create-rating",auth,isStudent,createRating)
router.post("/reviews/get-average-rating",getAverageRating)
router.get("/reviews/get-all-ratings",getAllRatings)
router.get("/reviews/get-course-ratings",getCourseRatings)

// CONTACT US --> ENQUIRY ROUTES
router.post("/contact-us",sendEnquiry);


module.exports=router;