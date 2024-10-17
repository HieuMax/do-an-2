import { Disclosure } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { NotificationDialog } from '../dialog/NotificationDialog'
import { useEffect, useState } from 'react'
import { Avatar, Badge } from 'antd'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [ openNoti, setOpenNoti ] = useState(false)

  const closeNoti = () => setOpenNoti(false)
  // useEffect(() => console.log(openNoti), [openNoti])
  // addEventListener("click", () => {
  //   document.body.click
  // })
  const data = ["", "", ""]
  return (
    <>
      <div className="" >
        <Disclosure as="nav" className="bg-system">
          <div className="px-2 lg:w-11/12 md:w-10/12 m-auto">
            <div className="flex h-16 items-center justify-between max-sm:h-20 max-sm:py-6">
            <h1 className='text-2xl font-bold max-md:text-xl text-white'>Hệ thống quản lý đề tài nghiên cứu khoa học sinh viên</h1>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Badge count={data.length} overflowCount={999} className='select-none'>

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
        <div className="overflow-hidden"><NotificationDialog open={openNoti} close={closeNoti}/></div>

      </div>
    </>
  )
}
