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
    const type = ["sinh viên", "giảng viên", "quản lý"]
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
            if (off != userType) {
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
        {/* <div className="w-3/5 bg-red-300 h-screen float-right">
          <div className="bg-background-login h-screen bg-no-repeat  bg-right "></div>
        </div> */}

        <div className="min-h-full min-w-full h-screen bg-background-login bg-no-repeat bg-bottom justify-center align-middle flex bg-cover">
          <div className="absolute top-5 w-max text-center bg-white py-3 px-40 text-3xl max-lg:text-xl max-lg:px-20 max-md:text-lg max-md:px-10 max-sm:px-5">
            <h1>Hệ thống quản lý đề tài nghiên cứu khoa học sinh viên</h1>
          </div>
          <div className="flex flex-1 flex-col justify-center px-6 py-12 bg-white lg:px-8  m-auto max-w-md">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Logo"
                src="/view/src/assets/logo.webp"
                className="mx-auto h-10 w-auto"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Đăng nhập
              </h2>
            </div>
              
            <div className="flex mt-4 w-full justify-center max-sm:flex-wrap max-sm:items-center">
                {/* <div className="flex sm:mx-auto sm:w-full sm:max-w-sm py-5 bg-yellow-100">
                </div>   */}
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

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="/" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Mã {type[userType]}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={`Nhập mã ${type[userType]} của bạn`}
                      className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Mật khẩu
                    </label>
    
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
                <div className="text-sm float-end">
                  <a href="/" className="font-semibold  text-gray-600 hover:text-black">
                    Quên mật khẩu?
                  </a>
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

        </div>
      </>
    )
  }
  