import React from 'react'
import Home from './pages/2.home/Home'
import Navbar from './components/header/Navbar'
import { createBrowserRouter, Outlet, Route, Router, RouterProvider, Routes } from 'react-router-dom'
import Login from './pages/1.login/Login'
import Footer from './components/footer/Footer'
import ErrorPage from './pages/3.errorPage/ErrorPage'

const Dashboard = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
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
      }
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
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App