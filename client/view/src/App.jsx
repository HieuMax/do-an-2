import React, { useState } from 'react'
import Home from './pages/2.home/Home'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Login from './pages/1.login/Login'
import Footer from './components/footer/Footer'
import ErrorPage from './pages/3.errorPage/ErrorPage'
import { SidebarFunc } from './components/sidebar/SidebarFunc'
import { Profile } from './pages/4.profile/Profile'
import Navbar from './components/header/Navbar'
import { ProjectDetail } from './pages/6.projectDetail/ProjectDetail'
import { ProjectListProvider } from './pages/5.projectList/ProjectListProvider'
import { RegisteredProject } from './pages/6.projectDetail/RegisteredProject'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CouncilListProvider from './pages/10.councilList/CouncilListProvider'
import CouncilAssignmentProvider from './pages/12.councilAssignment/CouncilAssignmentProvider'
import TeacherListProvider from './pages/11.teacherList/TeacherListProvider'
import AddTeacherProvider from './pages/11.teacherList/AddTeacherProvider'
import { NotificationPage } from './pages/8.Notification/NotificationPage'
const Dashboard = () => {
  const [expand, setExpand] = useState(false);
  const handleExpand = (item) => {
    setExpand(item)
  }
  return (
    <div className="max-sm:max-w-full lg:max-w-full">
      <div className='flex max-sm:flex-1 '>
        <div className="z-50">
          <div className={
            ` ${expand 
              ? "md:w-64 w-52"
              : "w-16"
            }
            h-screen `
          }></div>

            <SidebarFunc expand={handleExpand}/>
        </div>
        <div className="main max-sm:overflow-hidden max-lg:max-w-full w-screen">
          <Navbar/>
          <div className="h-max lg:w-11/12 w-11/12 m-auto">
            <Outlet/>
          </div>
        </div>
      </div>
      <div className="">
        <Footer/>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/project-list",
        element: <ProjectListProvider />
      },
      {
        path: "/project-list/:id",
        element: <RegisteredProject />
      },
      {
        path: "/regist-project",
        element: <ProjectDetail />
      },
      {
        path: "/notification",
        element: <NotificationPage />
      },
      {
        path: "/dsda",
        element: <CouncilListProvider />
      },
      {
        path: "/phanCong",
        element: <CouncilAssignmentProvider />
      },
      {
        path: "/dsgv",
        element: <TeacherListProvider />
      },
      {
        path: "/addTeacher",
        element: <AddTeacherProvider />
      },
      {
        path: "/editTeacher/:id",
        element: <AddTeacherProvider isEdit = {true}/>
      },
    ]
  },
  { 
    path: '/login',
    element: <Login />
  },
  {
    path: "*",
    element: <ErrorPage />
  }
])

const App = () => {
  return (
    <>
    <ToastContainer />
      <RouterProvider router={router} />

    </>

  )
}

export default App