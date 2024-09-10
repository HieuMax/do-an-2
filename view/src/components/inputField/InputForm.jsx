import { useEffect, useRef, useState } from "react"

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function InputForm() {
    // const userType = ["MSSV", "MSGV", "MQL"]
    const type = ["Sinh viên", "Giảng viên", "Quản lý"]
    const [userType, setUserType] = useState(0);
    const userTypeHandle = (type) => {
        setUserType(type)
    }

    const checkFirstRender = useRef(true);

    useEffect(() => {
        if (checkFirstRender.current) {
            checkFirstRender.current = false;
            return;
        }
        document.getElementsByClassName('students')[userType].classList.add('bg-[#306BA0]');
        document.getElementsByClassName('students')[userType].classList.remove('bg-[#BBBBBB]')
        type.forEach(e => {
            const off = type.indexOf(e)
            // console.log('user: ', userType)
            if (off != userType) {
                // console.log('Off: ',off)
                // console.log(userType)
                document.getElementsByClassName('students')[off].classList.remove('bg-[#306BA0]');
                document.getElementsByClassName('students')[off].classList.add('bg-[#BBBBBB]')
                document.getElementsByClassName('students')[off].classList.add('hover:bg-[#306BA0]')
            } else {
                
            }
        });

        console.log('ok')
    }, [userType])

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Đăng nhập
            </h2>
          </div>
            
            <div className="flex min-h-full mt-4 w-1/2 justify-center lg:px-8 m-auto">
                <div className="flex sm:mx-auto sm:w-full sm:max-w-sm py-5 ">
                    <div className="students py-1.5 bg-[#306BA0]  w-1/3 text-center cursor-pointer text-black  rounded-3xl m-3" onClick={() => {userTypeHandle(0)}}>
                        <h2 className="text-white">Sinh viên</h2>
                    </div>          
                    <div className="students py-1.5 bg-[#BBBBBB]  w-1/3 text-center cursor-pointer text-black  rounded-3xl m-3 hover:bg-[#306BA0]" onClick={() => {userTypeHandle(1)}}>
                        <h2 className="text-white">Giảng viên</h2>
                    </div>          
                    <div className="students py-1.5 bg-[#BBBBBB]  w-1/3 text-center cursor-pointer text-black  rounded-3xl m-3 hover:bg-[#306BA0]" onClick={() => {userTypeHandle(2)}}>
                        <h2 className="text-white">Quản lý</h2>
                    </div>                    
                </div>  
            </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold  text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Nhập mật khẩu của bạn" 
                    autoComplete="current-password"
                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-system px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:.bg-system focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
  
            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p> */}
          </div>
        </div>
      </>
    )
  }
  