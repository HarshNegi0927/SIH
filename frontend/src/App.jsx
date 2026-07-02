// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import StudentList from "./components/admin/StudentList";
import BulkUpload from "./components/admin/BulkUpload";
import InviteAdmins from "./components/admin/InviteAdmins";
import AdminEditProfile from "./components/admin/AdminEditProfile";
import CourseManagement from "./components/admin/CourseManagement";
import FacultyDashboard from "./components/faculty";
import StudentDashboard from "./components/student/StudentDashboard";
// import CourseManagement from "./components/CoursePage";
// impot CourseManagement from "./components/CoursePage";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/course" element={<CourseManagement />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<StudentList />} />
          <Route path="bulk-upload" element={<BulkUpload />} />
          <Route path="invite-admins" element={<InviteAdmins />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="edit" element={<AdminEditProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}