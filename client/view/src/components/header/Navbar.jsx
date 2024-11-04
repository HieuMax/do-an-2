import { Disclosure } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { NotificationDialog } from '../dialog/NotificationDialog'
import { useEffect, useState } from 'react'
import { Badge } from 'antd'
import { getNotificate } from '../../controller/7.notify/notify'
import socket from '../../provider/websocket'
import { NotificationCard } from '../card/NotificationCard'
import NotifyInfo from '../../third-party/components/Notification/NotifyInfo'
import { useAuthStore } from '../../api/authStore'
import { useNavigate } from 'react-router-dom'
import { handleLogoutApi } from '../../api'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Navbar() {
  const [ openNoti, setOpenNoti ] = useState(false)
  const [ countNoti, setCountNoti ] = useState()
  const [ data, setData ] = useState()
  const closeNoti = () => setOpenNoti(false)

  const { user } = useAuthStore();

  const fetchNoti = async() => {
    const result = await getNotificate()
    setData(result)
    setCountNoti(result && result.length)
    return result
  }

  const validateUser = () => {
    const localUserInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (!localUserInfo || user && user.taikhoanid !== localUserInfo.taikhoanid || !user) {
      throw new Error("Dangerous error: You changed localStorage");
    }
  };

  useEffect(() => {
    const validateAndFetch = async () => {
      try {
        // validateUser();
        await fetchNoti();
      } catch (error) {
        console.error(error.message);
      }
    };
    validateAndFetch();
  }, []);

  useEffect(() => {
    socket.onmessage = function(event) {
      async function handleEvent (){
        const result = await fetchNoti()
        NotifyInfo(<NotificationCard item={result && result[0]}/>)
      }
      handleEvent();
    };
  }, [socket])


  const navigate = useNavigate()
  useEffect(() => {
    const handleStorageChange = async (event) => {
      if (event.key === "userInfo") {
        console.warn("Detected change in localStorage userInfo");
        await handleLogoutApi()
        navigate('/login')
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [])

  return (
    <>
      <div className="" >
        <Disclosure as="nav" className="bg-system">
          <div className="px-2 lg:w-11/12 md:w-10/12 m-auto ">
            <div className="flex h-16 items-center justify-between max-sm:h-20 max-sm:py-6">
            <h1 className='text-2xl font-bold max-md:text-xl text-white'>Hệ thống quản lý đề tài nghiên cứu khoa học sinh viên</h1>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Badge count={countNoti} overflowCount={999} className='select-none'>

                    <button
                      onClick={() => setOpenNoti(!openNoti)}
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="h-6 w-6"/>
                        {/* <Avatar shape="circle" size="small"  /> */}

                    </button>
                  </Badge>
                </div>
              </div>

            </div>
          </div>
        </Disclosure>
        <div className="overflow-hidden"><NotificationDialog open={openNoti} close={closeNoti} data={data}/></div>

      </div>
    </>
  )
}
