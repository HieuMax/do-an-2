import React, { useState, useEffect } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom'
import Login from './pages/1.login/Login'
import Footer from './components/footer/Footer'
import ErrorPage from './pages/3.errorPage/ErrorPage'
import { SidebarFunc } from './components/sidebar/SidebarFunc'
import Navbar from './components/header/Navbar'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------- Check User Authentication ----------------
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './api/authStore'
import { setNavigate, children } from './api/navigation'

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to='/' replace />;
  }
  return children;
};

const Dashboard = () => {
  const [expand, setExpand] = useState(false);
  // const [user, setUser] = useState(null)

  const handleExpand = (item) => {
    setExpand(item)
  }

  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
    
  }, [navigate])

  const { checkAuth, isAuthenticated, connectSocketServer } = useAuthStore();

	useEffect(() => {
		checkAuth();
    if (isAuthenticated) {
      connectSocketServer(isAuthenticated);
    }
	}, [checkAuth]);

  return (
    <div className="max-sm:max-w-full lg:max-w-full">
      <div className='flex max-sm:flex-1 '>
        <div className="z-50">
          <div className={` ${expand ? "md:w-64 w-52": "w-16"} h-screen `}></div>
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
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: children
  },
  { 
    path: '/login',
    element: (
      <RedirectAuthenticatedUser>
        <Login />
      </RedirectAuthenticatedUser>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />
  }
])

const App = () => {

  return (
    <>
    <ToastContainer position="bottom-right" />
      <RouterProvider router={router} />

    </>
  )
}

export default App