import { ChevronFirst, ChevronLast, Menu, MoreVertical } from 'lucide-react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '../../api/authStore'

const SidebarContext = createContext()
export const Sidebar2 = ({ children, expand }) => {
  const [expanded, setExpanded] = useState(true);
  
  const [widthWindow, setWidthWindow] = useState(window.innerWidth);


  const { user } = useAuthStore();

  // Listen to window resize events
  useEffect(() => {

    const handleResize = () => {
      setWidthWindow(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Disable/Enable scroll based on sidebar expansion and window width
  useEffect(() => {
    if (expanded && widthWindow <= 640) {
      document.body.style.overflow = 'hidden';  // Disable scrolling
    } else {
      document.body.style.overflow = 'auto';    // Enable scrolling
    }
  }, [expanded, widthWindow]);

  useEffect(() => {
    expand(expanded)
  }, [expanded])
  return (
    <aside className={`h-screen 
          max-md:max-w-52 md:max-w-64 ${expanded
            ? "w-max max-sm:max-w-full max-sm:min-w-full max-sm:fixed max-sm:z-10 max-sm:top-0 max-sm:bg-white" 
            : "w-16"}
          `}>
        <nav className="h-full flex flex-col  border-r shadow-sm sm:bg-white">
            <div className={`p-4 pb-2 flex justify-between items-center`}>
                <img 
                src="/view/src/assets/logo.webp" 
                className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
                alt="logo" 
                />
                <button onClick={() => {
                    setExpanded(curr => !curr)
                }} className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                    {expanded ? <ChevronFirst /> : <ChevronLast />}
                </button>
            </div>
            
            <SidebarContext.Provider value={{expanded}}>
              <ul className='flex-1 px-3'>{children}</ul>
            </SidebarContext.Provider>


            <div className="border-t flex p-3 mb-9">
                <img 
                src={user.avtimg}
                alt="" 
                className='w-10 h-10 rounded-md'
                />
                <div className={`
                    flex justify-between items-center
                    overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
                `}>
                    <div className='leading-4'>
                        <h4 className='font-semibold'>{user.hoten}</h4>
                        <span className='text-xs text-gray-600'>{user.mail}</span>
                    </div>
                </div>
            </div>


        </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert }) {
    const {expanded} = useContext(SidebarContext)
    return (
        <li 
        className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${
                active
                  ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" 
                  : "hover:bg-indigo-50 text-gray-600"
            }
            ${expanded ? "" : "w-max h-12"}
        `}
        >
            {icon}
            <span 
              className={`
                overflow-hidden transition-all 
                ${expanded ? "w-52 ml-3" : "w-0"}
                `}>
                  {text}
            </span>
            {alert && (
                <div 
                  className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                    expanded ? "" : "top-2"
                  }`} 
                />
            )}

            {!expanded && (
              <div
                className={`
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-indigo-100 text-indigo-800 text-sm w-max
                    invisible opacity-20 -translate-x-3 transition-all
                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
              >
                {text}
              </div>)}
        </li>
    )
}