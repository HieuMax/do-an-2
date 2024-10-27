import React, { useState, useEffect } from 'react';
import { Sidebar2, SidebarItem } from './Sidebar2';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLogoutApi } from '../../api';
import { useAuthStore } from '../../api/authStore';
import { _StudentSidebar } from './_StudentSidebar';
import { _TeacherSidebar } from './_TeacherSidebar';
import { _AdminSidebar } from './_AdminSidebar';


export const SidebarFunc = ({expand}) => {
  const location = useLocation();  // To get the current path
  const navigate = useNavigate();  // To programmatically navigate
  const [navigation, setNavigation] = useState([])

// --------------------------------------------------Menu thay đổi theo vai trò----------------------------------------------------------------
  const { user } = useAuthStore();

  useEffect(() => {
    let sideObj;  
    if(!user) return
    if(user.vaitro == "Student") {
      sideObj = _StudentSidebar
    } else if (user.vaitro == "Teacher") {
      sideObj = _TeacherSidebar
    } else if (user.vaitro == "Admin") {
      sideObj = _AdminSidebar
    }
    setNavigation(sideObj)
    const location = window.location.pathname
    const item = {
      href: `/${location.substring(location.lastIndexOf('/')+1)}`
    }
    setNavigation((prevNav) =>
      prevNav.map((navItem) =>
        navItem.name === item.name || navItem.href === item.href
          ? { ...navItem, active: true }
          : { ...navItem, active: false }
      )
    );
  }, [user])

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
