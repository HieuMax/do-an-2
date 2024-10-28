// navigation.js
import React from 'react';
import CouncilListProvider from '../pages/10.councilList/CouncilListProvider';
import AddTeacherProvider from '../pages/11.teacherList/AddTeacherProvider';
import TeacherListProvider from '../pages/11.teacherList/TeacherListProvider';
import CouncilAssignmentProvider from '../pages/12.councilAssignment/CouncilAssignmentProvider';
import Home from '../pages/2.home/Home';
import ResetPasswordPage from '../pages/9.resetForgotPassword/ResetPasswordPage';
import ForgotPasswordPage from '../pages/9.resetForgotPassword/ForgotPasswordPage';
import { Profile } from '../pages/4.profile/Profile';
import { ProjectListProvider } from '../pages/5.projectList/ProjectListProvider';
import { ProjectDetail } from '../pages/6.projectDetail/ProjectDetail';
import { RegisteredProject } from '../pages/6.projectDetail/RegisteredProject';
import { NotificationPage } from '../pages/8.Notification/NotificationPage';
import { useAuthStore } from './authStore';
import ErrorPage from '../pages/3.errorPage/ErrorPage';

let navigate = null;

export const setNavigate = (nav) => {
  navigate = nav;
};

export const getNavigate = () => {
  return navigate;
};


const AccessRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (user.vaitro != "Admin") {
    return <ErrorPage /> 
  }

  return children;
};

const StudentAccess = ({ children }) => {
  const { user } = useAuthStore();
  if (user.vaitro != "Student") {
    return <ErrorPage /> 
  }

  return children;
}

const StuAndTeaAccess = ({ children }) => {
  const { user } = useAuthStore();
  if (user.vaitro != "Student" && user.vaitro != "Teacher") {
    return <ErrorPage /> 
  }

  return children;
}


export const children = [
  // All user
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/notification", element: <NotificationPage /> },
  // { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  // { path: "/forgot-password", element: <ForgotPasswordPage /> },

  // Teacher - Student
  { path: "/project-list", 
    element: 
      <StuAndTeaAccess>
          <ProjectListProvider />
      </StuAndTeaAccess> 
  },
  { path: "/project-list/:id", 
    element: 
      <StuAndTeaAccess>
        <RegisteredProject /> 
      </StuAndTeaAccess> 
  },


  // Student
  { path: "/regist-project", 
    element: 
      <StudentAccess>
        <ProjectDetail /> 
      </StudentAccess>
  },

  // Admin
  { path: "/council-management", 
    element: <AccessRoute><CouncilListProvider /></AccessRoute> 
  },
  { path: "/council-assignment", 
    element: <AccessRoute><CouncilAssignmentProvider /></AccessRoute> 
  },
  { path: "/teacher-management", 
    element: <AccessRoute><TeacherListProvider /></AccessRoute>  
  },
  { path: "/adding-teacher", 
    element: <AccessRoute><AddTeacherProvider /> </AccessRoute> 
  },
  { path: "/editing-teacher/:id", 
    element: <AccessRoute><AddTeacherProvider isEdit = {true}/> </AccessRoute> 
  },
  { path: "/detail-product/:id", 
    element: <AccessRoute> <ProjectDetail isAssign = {true}/> </AccessRoute> 
  },
  { path: "/detail-project/:id", 
    element: 
      <AccessRoute>
        <RegisteredProject /> 
      </AccessRoute> 
  },
]

