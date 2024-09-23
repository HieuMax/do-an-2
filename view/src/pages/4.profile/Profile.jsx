import { Calendar, CircleUser, CreditCard, IdCard, Landmark, MapPinHouse, Phone } from 'lucide-react'
import React from 'react'

export const Profile = () => {
  const user = {
    name: "Hieu Max",
    avatar: "/view/src/assets/avatar.png",
    img_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    class: "71K28",
    mail: "HieuMax@gmail.com",
    userID: "07720400000",
    dob: "01/01/2004",
    gender: "Nam",
    phone: "0979797979",
    address: "69/3 Đặng Thùy Trâm, Phường 13, Quận Bình Thạnh, Tp. HCM",
    bank: "999999999",
    bankName: "MBBank"
  }

  return (
    <div className='lg:h-screen flex flex-col max-lg:flex-col max-w-full w-full'>
      <div className="lg:w-full h-max w-full">

        <div className="pr-3 py-3 h-full w-full items-center justify-between flex flex-col bg-gradient-to-r from-gray-200 to-gray-500 bg-center shadow-sm border-b max-lg:w-full-2">
          <div className="pr-3 py-3 h-full flex items-center justify-between w-full max-lg:flex-col-reverse">
            <div className="h-full w-max flex max-lg:w-full max-lg:justify-center 
            font-bold text-black px-3 py-6 text-3xl max-md:text-2xl flex-col justify-around 
            "
            >
              <div className="text-5xl flex border-system max-lg:text-4xl max-md:text-3xl w-fit">
                {/* <div className="h-1/2 w-1/12 bg-red-300"></div> */}
                {user.name}
              </div>
              <div className="">{user.class}</div>

            </div>
            <div className="">
              <img src={user.img_url} alt="" className='
                  h-full scale-75 shadow-xl
                  w-full max-w-xs rounded-full
              '/>
              <div className="bg-system text-center py-3 rounded-xl shadow-xl text-lg 
              font-semibold text-white cursor-pointer w-2/3 m-auto">
                Upload photo
              </div>
            </div>
          </div>
        </div>  
      </div>

      <div className="py-3 w-full text-system-blue ">
        <div className=" text-lg flex flex-wrap flex-row items-center
         max-lg:flex-col  max-lg:justify-center  
          ">

          {/* <div className="flex w-full bg-red-300 flex-wrap "> */}
            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full ">
              <IdCard as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Số CCCD </span>
                <span className='text-xl text-black font-semibold'>{user.userID}</span>
              </div>
            </div>
            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full ">
              <Calendar as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Ngày sinh </span>
                <span className='text-xl text-black font-semibold'>{user.dob}</span>
              </div>
            </div>
            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full">
              <CircleUser as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Giới tính </span>
                <span className='text-xl text-black font-semibold'>{user.gender}</span>
              </div>
            </div>
            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full">
              <Phone as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Điện thoại </span>
                <span className='text-xl text-black font-semibold'>{user.phone}</span>
              </div>
            </div>
          {/* </div> */}

          {/* <div className="flex w-full bg-green-300 flex-wrap"> */}

            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full">
              <CreditCard as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Số tài khoản </span>
                <span className='text-xl text-black font-semibold'>{user.bank}</span>
              </div>
            </div>
            <div className="ml-0 m-4 flex flex-row items-center w-60 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full ">
              <Landmark as="div" className='h-16 w-16 scale-75 rounded mr-2'/>
              <div className="flex flex-col">
                <span>Tên ngân hàng </span>
                <span className='text-xl text-black font-semibold'>{user.bankName}</span>
              </div>
            </div>
            <div className="ml-0 m-4 flex flex-row items-center w-fit min-w-60 break-words rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full max-lg:bg-gray-200">
              {/* <MapPinHouse as="div" className='h-16 w-16 scale-75 rounded mr-2'/> */}
              <div className="flex flex-col">
                <span>Địa chỉ </span>
                <span className='text-xl text-black font-semibold '>{user.address}</span>
              </div>
            </div>
        </div>
      </div>

      <div className="p-3 flex justify-end items-end h-full w-full">
        <div className="bg-system h-max text-center p-3 rounded-xl shadow-xl text-lg 
        font-semibold text-white cursor-pointer w-max bg-btn-system">
          Đổi mật khẩu
        </div>
      </div>

    </div>
  )
}
