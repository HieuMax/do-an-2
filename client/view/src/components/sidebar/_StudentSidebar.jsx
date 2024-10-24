import { ArrowLeftFromLine, Bell, FileChartColumn, LayoutDashboard, List, ListChecks, User } from 'lucide-react';

const StudentSideBar = [
    { name: 'Home', href: '/', current: true, icon: <LayoutDashboard size={20} />, alert: false, active: true}, 
    { name: 'Thông tin cá nhân', href: '/profile', current: false , icon: <User size={20} />},
    { name: 'Đăng ký đề tài', href: '/regist-project', current: false, icon: <List size={20} /> },
    { name: 'Trạng thái đề tài', href: '/project-list', current: false, icon: <ListChecks size={20} /> },
    { name: 'Kết quả báo cáo', href: '/report', current: false, icon: <FileChartColumn size={20} />, alert: true  },
    { name: 'Trung tâm thông báo', href: '/notification', current: false, icon: <Bell size={20} /> },
    { name: 'Đăng xuất', href: '/login', current: false, icon: <ArrowLeftFromLine size={20} /> },
]

import React from 'react'

export const _StudentSidebar = () => {
  return (StudentSideBar)
}
