import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Navbar } from "./components/common/Navbar";
import { Error } from "./pages/Error";
import { ForgotPassword } from "./pages/ForgotPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Dashboard } from "./pages/Dashboard";
import { OpenRoute } from "./components/core/auth/OpenRoute";
import { About } from "./pages/About";
import { ContactUs } from "./pages/ContactUs";
import { MyProfile } from "./components/core/Dashboard/MyProfile";
import { PrivateRoute } from "./components/core/auth/PrivateRoute";
import Settings  from "./components/core/Dashboard/Settings/index";
import { EnrolledCourses } from "./components/core/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart  from "./components/core/Dashboard/Cart/index";
import { MyCourses } from "./components/core/Dashboard/MyCourses";
import  AddCourse  from "./components/core/Dashboard/AddCourse/index";
import { useState } from "react";
import { Catalog } from "./pages/Catalog";
import { CourseDetails } from "./pages/CourseDetails";
import { ViewCourse } from "./pages/ViewCourse";
import { VideoDetails } from "./components/core/ViewCoursePage/VideoDetails";
import { InstructorDashboard } from "./components/core/Dashboard/InstructorDashboard";


function App() {
  const {user}=useSelector((state)=>state.profile)
  const [overlayStatus,setOverlayStatus]=useState(false);

  // const handleOverlayStatus=(status)=>{
  //   setOverlayStatus(status)
  // }
  return (
    <div className={`${overlayStatus?"fixed":""} w-screen min-h-screen bg-richblack-900 flex flex-col font-inter`}>
      
      <Navbar/>
      <Routes>
        <Route path='/' element=
          {
            <Home/>  
          }>
        </Route>
        <Route path='/login' element=
          {
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }>
        </Route>
        <Route path='/signup' element=
          {
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }>
        </Route>
        <Route path='/forgot-password' element=
          {
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }>
        </Route>
        <Route path='/update-password/:id' element=
          {
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }>
        </Route>
        
        <Route path='/verify-email' element=
          {
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }>
        </Route>

        {/* <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/update-password/:id' element={<UpdatePassword/>}></Route>
        <Route path='/verify-email' element={<VerifyEmail/>}></Route> */}

        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<ContactUs/>}></Route>
        <Route path='*' element={<Error/>}></Route>
        <Route path='/catalog/:catalogName' element={<Catalog/>}></Route>
        <Route path='/courses/:courseId' element={<CourseDetails/>}></Route>


        <Route
        element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>
          
          <Route index path="/dashboard/my-profile" element={<MyProfile/>}></Route>
          <Route path="/dashboard/settings" element={<Settings/>}></Route>
          
          {
            user?.accountType===ACCOUNT_TYPE.STUDENT && <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}></Route>
          }

          
          {
            user?.accountType===ACCOUNT_TYPE.STUDENT && <Route path="/dashboard/cart" element={<Cart/>}></Route>
          }

          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && <Route path="/dashboard/my-courses" element={<MyCourses />}></Route>
          }

          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && <Route path='/dashboard/add-course' element={<AddCourse/>}></Route>
          }

          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && <Route path='/dashboard/edit-course/:id' element={<AddCourse/>}></Route>
          }

          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && <Route path="/dashboard/instructor" element={<InstructorDashboard/>}></Route>
          }

          <Route path='*' element={<Error/>}></Route>
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }
        >
            {
              user?.accountType===ACCOUNT_TYPE.STUDENT && 
             <Route path="/view-course/:courseId/section/:sectionId/:sub-section/:subSectionId" element={<VideoDetails/>} /> 
            }
        </Route>

        <Route path='*' element={<Error/>}></Route>
      </Routes> 

      
      
    </div>
    
  );
}

export default App;
