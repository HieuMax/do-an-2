// navigation.js
import React, { useState } from 'react';
import CouncilListProvider from '../pages/10.councilList/CouncilListProvider';
import AddTeacherProvider from '../pages/11.teacherList/AddTeacherProvider';
import TeacherListProvider from '../pages/11.teacherList/TeacherListProvider';
import CouncilAssignmentProvider from '../pages/12.councilAssignment/CouncilAssignmentProvider';
import Home from '../pages/2.home/Home';
import { Profile } from '../pages/4.profile/Profile';
import { ProjectListProvider } from '../pages/5.projectList/ProjectListProvider';
import { ProjectDetail } from '../pages/6.projectDetail/ProjectDetail';
import { RegisteredProject } from '../pages/6.projectDetail/RegisteredProject';
import { NotificationPage } from '../pages/8.Notification/NotificationPage';
import { useAuthStore } from './authStore';
import ErrorPage from '../pages/3.errorPage/ErrorPage';
import { ReportPage } from '../pages/13.reportPage/ReportPage';
import { projectPermission, reportPermission } from '../controller/1.projects/project';
import { useLocation } from 'react-router-dom';
import { ReportPageList } from '../pages/13.reportPage/ReportPageList';
import ArticlePage from '../pages/15.feedManagement/ArticlePage';
import ArticleDetail from '../pages/15.feedManagement/ArticleDetail';
import DashboardPage from '../pages/14.dashboard/DashboardPage';

let navigate = null;

export const setNavigate = (nav) => {
  navigate = nav;
};

export const getNavigate = () => {
  return navigate;
};


const AccessRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) throw new Error("Dangerous! You changed localstorage. You must logout and login again to keep using application")
  if (user.vaitro != "Admin") {
    return <ErrorPage /> 
  }

  return children;
};

const StudentAccess = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) throw new Error("Dangerous! You changed localstorage. You must logout and login again to keep using application")
  if (user.vaitro != "Student") {
    return <ErrorPage /> 
  }

  return children;
}

const StuAndTeaAccess = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) throw new Error("Dangerous! You changed localstorage. You must logout and login again to keep using application")
  if (user.vaitro != "Student" && user.vaitro != "Teacher") {
    return <ErrorPage /> 
  }

  return children;
}

const ProjectAccessPermis = ({ children }) => {
  const user = JSON.parse(window.localStorage.getItem('userInfo'))
  try {
    if (user.vaitro == "Admin") {
      return children 
    } else {
      const location = useLocation();
      const { detaiId } = location.state 
      ? location.state
      : {detaiId: location.pathname.substring(location.pathname.lastIndexOf('/')+1)}; 
      const [ child, setChild ] = useState()
      async function isAccess() {
        const res = await projectPermission(detaiId, user.userId)
        res.result.permission == "allowed"
        ? setChild(children)
        : setChild(<ErrorPage />)
      }
      isAccess();
      return child
    }
  } catch (error) {
    
  }
}

const ReportAccessPermis = ({ children }) => {
  const user = JSON.parse(window.localStorage.getItem('userInfo'))
  try {
    if (user.vaitro == "Admin") {
      return children 
    } else {
      const location = useLocation();
      const { detaiId } = location.state 
      ? location.state
      : {detaiId: location.pathname.substring(location.pathname.lastIndexOf('/')+1)}; 
      const [ child, setChild ] = useState()
      async function isAccess() {
      const res = await reportPermission(detaiId, user.userId)
      res.result.permission == "allowed"
        ? setChild(children)
        : setChild(<ErrorPage />)
      }
      isAccess();
      return child
    }
  } catch (error) {
    
  }
}



export const children = [
  // All user
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/notification", element: <NotificationPage /> },
  { path: "/project-list/:id", 
    element: 
      <ProjectAccessPermis>
        <RegisteredProject /> 
      </ProjectAccessPermis>
  },
  { path: "/article/:slug", 
    element: <ArticleDetail />
  },
  
  // Teacher - Student
  { path: "/project-list", 
    element: 
      <StuAndTeaAccess>
          <ProjectListProvider />
      </StuAndTeaAccess> 
  },

  { path: "/report", 
    element: 
      <StuAndTeaAccess>
        <ReportPageList /> 
      </StuAndTeaAccess> 
  },
  { path: "/report/:id", 
    element: 
      <ReportAccessPermis>
        <ReportPage /> 
      </ReportAccessPermis>
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
  { path: "/feed-management", 
    element: <AccessRoute><Home /> </AccessRoute> 
  },
  { path: "/adding-feed", 
    element: <AccessRoute><ArticlePage /> </AccessRoute> 
  },
  { path: "/editing-feed/:id", 
    element: <AccessRoute><ArticlePage /> </AccessRoute> 
  },
  { path: "/project-view/:id", 
    element: <AccessRoute><RegisteredProject /> </AccessRoute> 
  },
  { path: "/dashboard-management", 
    element: <AccessRoute><DashboardPage /> </AccessRoute> 
  },
]

