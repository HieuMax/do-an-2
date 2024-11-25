import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from "../../api/authStore";
import { onLogin } from "../../provider/websocket";
import { motion } from "framer-motion";

export default function InputForm() {
  const type = ["sinh viên", "giảng viên", "quản lý"];
  const [userType, setUserType] = useState('Student');
  const [maSo, setMaSo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
	const { login} = useAuthStore();

  const userTypeHandle = (type) => {
    setUserType(type);
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
		await login(maSo, password, userType);

    navigate('/')
    onLogin(JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid);
  };


  

  return (
    <>
      <div className="min-h-full min-w-full h-screen bg-background-login bg-no-repeat bg-bottom justify-center align-middle flex bg-cover">
        <div className="absolute top-5 w-max text-center bg-white py-3 px-40 text-3xl max-lg:text-xl max-lg:px-20 max-md:text-lg max-md:px-10 max-sm:px-5">
          <h1>Hệ thống quản lý đề tài nghiên cứu khoa học sinh viên</h1>
        </div>
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col justify-center px-6 py-12 bg-white lg:px-8 m-auto max-w-md rounded-2xl"
        >
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
            <div
              className={`students py-1.5 w-1/3 text-center cursor-pointer text-black rounded-3xl m-3 ${userType === 'Student' ? 'bg-[#306BA0] text-white' : 'bg-[#BBBBBB] hover:bg-[#306BA0]'}`}
              onClick={() => userTypeHandle('Student')}
            >
              <h2>Sinh viên</h2>
            </div>
            <div
              className={`students py-1.5 w-1/3 text-center cursor-pointer text-black rounded-3xl m-3 ${userType === 'Teacher' ? 'bg-[#306BA0] text-white' : 'bg-[#BBBBBB] hover:bg-[#306BA0]'}`}
              onClick={() => userTypeHandle('Teacher')}
            >
              <h2>Giảng viên</h2>
            </div>
            <div
              className={`students py-1.5 w-1/3 text-center cursor-pointer text-black rounded-3xl m-3 ${userType === 'Admin' ? 'bg-[#306BA0] text-white' : 'bg-[#BBBBBB] hover:bg-[#306BA0]'}`}
              onClick={() => userTypeHandle('Admin')}
            >
              <h2>Quản lý</h2>
            </div>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="/" method="POST" className="space-y-6">
              <div>
                <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                  Mã {type[userType === 'Student' ? 0 : userType === 'Teacher' ? 1 : 2]}
                </label>
                <div className="mt-2">
                  <input
                    id="text"
                    name="text"
                    type="text"
                    required
                    autoComplete="text"
                    placeholder={`Nhập mã ${type[userType === 'Student' ? 0 : userType === 'Teacher' ? 1 : 2]} của bạn`}
                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setMaSo(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleLoginClick}
                  className="flex w-full justify-center rounded-md bg-system px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-system focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Đăng nhập
                </button>
              </div>
              <div className="text-sm float-end">
                <Link to='/forgot-password' className='text-sm hover:underline'>
                  Quên mật khẩu?
						    </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
