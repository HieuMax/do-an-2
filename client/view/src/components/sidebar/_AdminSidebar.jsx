import { ArrowLeftFromLine, Bell, LayoutDashboard, School, SquareCheckBig, User, Users } from 'lucide-react';
const AdminSideBar = [
  { name: 'Home', href: '/', current: true, icon: <LayoutDashboard size={20} />, alert: false, active: true}, 
  { name: 'Thông tin cá nhân', href: '/profile', current: false , icon: <User size={20} />},
  { name: 'Danh sách hội đồng', href: '/council-management', current: false, icon: <School size={20} /> },
  { name: 'Phân công hội đồng', href: '/council-assignment', current: false, icon: <SquareCheckBig size={20} /> },
  { name: 'Danh sách giảng viên', href: '/teacher-management', current: false, icon: <Users size={20} /> },
  { name: 'Trung tâm thông báo', href: '/notification', current: false, icon: <Bell size={20} /> },
  { name: 'Đăng xuất', href: '/login', current: false, icon: <ArrowLeftFromLine size={20} /> },
]

import React from 'react'

export const _AdminSidebar = () => {
  return (AdminSideBar)
}
