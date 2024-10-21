import { ArrowLeftFromLine, Bell, FileChartColumn, LayoutDashboard, List, ListChecks, School, SquareCheckBig, User, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Sidebar2, SidebarItem } from './Sidebar2';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLogoutApi } from '../../api';
import { useAuthStore } from '../../api/authStore';

export const SidebarFunc = ({expand}) => {
  const location = useLocation();  // To get the current path
  const navigate = useNavigate();  // To programmatically navigate
  const [navigation, setNavigation] = useState(
    [
        { name: 'Home', href: '/', current: true, icon: <LayoutDashboard size={20} />, alert: false, active: true}, 
        { name: 'Thông tin cá nhân', href: '/profile', current: false , icon: <User size={20} />},
        { name: 'Đăng ký đề tài', href: '/regist-project', current: false, icon: <List size={20} /> },
        { name: 'Trạng thái đề tài', href: '/project-list', current: false, icon: <ListChecks size={20} /> },
        { name: 'Kết quả báo cáo', href: '/report', current: false, icon: <FileChartColumn size={20}/>, alert: true  },
        { name: 'Danh sách hội đồng', href: '/dsda', current: false, icon: <School size={20}/>},
        { name: 'Phân công hội đồng', href: '/phanCong', current: false, icon: <SquareCheckBig size={20}/>},
        { name: 'Danh sách giảng viên', href: '/dsgv', current: false, icon: <Users size={20}/>},
        { name: 'Trung tâm thông báo', href: '/notification', current: false, icon: <Bell size={20}/> },
        { name: 'Đăng xuất', href: '/login', current: false, icon: <ArrowLeftFromLine size={20}/> },
    ]
  );  // Use state to track active links
// --------------------------------------------------Menu thay đổi theo vai trò----------------------------------------------------------------
  const { user } = useAuthStore();
  // useEffect(() => {
  //   let defaultNav = [
  //     { name: 'Home', href: '/', current: true, icon: <LayoutDashboard size={20} />, alert: false, active: true },
  //     { name: 'Thông tin cá nhân', href: '/profile', current: false, icon: <User size={20} /> },
  //   ];

  //   let additionalNav = [];

  //   if (user.vaitro === 'Student') {
  //     additionalNav = [
  //       { name: 'Phân công hội đồng', href: '/phanCong', current: false, icon: <SquareCheckBig size={20}/> },
  //       { name: 'Danh sách giảng viên', href: '/dsgv', current: false, icon: <Users size={20}/> }
  //     ];
  //   } else 
  //   if (user.vaitro === 'Admin') {
  //     additionalNav = [
  //       { name: 'Phân công hội đồng', href: '/phanCong', current: false, icon: <SquareCheckBig size={20}/> },
  //       { name: 'Danh sách giảng viên', href: '/dsgv', current: false, icon: <Users size={20}/> },
  //       { name: 'Đăng xuất', href: '/login', current: false, icon: <ArrowLeftFromLine size={20}/> }

  //     ];
  //   } else 
  //   if (user.vaitro === 'Teacher') {
  //     additionalNav = [
  //       { name: 'Đăng ký đề tài', href: '/regist-project', current: false, icon: <List size={20} /> },
  //       { name: 'Trạng thái đề tài', href: '/project-list', current: false, icon: <ListChecks size={20} /> }
  //     ];
  //   } 

  //   setNavigation([...defaultNav, ...additionalNav]);
  // }, [user.vaitro]);
// ------------------------------------------------------------------------------------------------------------------
  // Update the active state based on the current path
  useEffect(() => {
    setNavigation((prevNav) =>
      prevNav.map((item) => ({
        ...item,
        active: item.href === location.pathname,
      }))
    );
  }, [location.pathname]);

  const handleClick = async (item) => {
    window.scroll(0,0)
    if (item.name == 'Đăng xuất'){
      await handleLogoutApi()

      navigate('/login')
      return;
    }
    if (item.href) {
      navigate(item.href);
    }

    // Update the active state locally for the clicked item - **for href: empty**
    setNavigation((prevNav) =>
      prevNav.map((navItem) =>
        navItem.name === item.name
          ? { ...navItem, active: true }
          : { ...navItem, active: false }
      )
    );
  };

  return (
    <div className="top-0 fixed sm:bg-white  max-sm:overflow-hidden">
      <Sidebar2 expand={expand}>
        {navigation.map((item) => (
          <div
            className=""
            key={item.name}
            onClick={() => handleClick(item)}  // Pass the item to the handleClick function
          >
            {item.active ? (
                <SidebarItem
                  text={item.name}
                  icon={item.icon}
                  alert={item.alert}
                  active={item.active}
                />
            ) : (
                <SidebarItem
                  text={item.name}
                  icon={item.icon}
                  alert={item.alert}
                  active={item.active}
                />
            )}
          </div>
        ))}
      </Sidebar2>
    </div>
  );
};
