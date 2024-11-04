import { useEffect, useState } from 'react'
import { Calendar, CircleUser, CreditCard, IdCard, Landmark, MapPinHouse, Phone, Mail, Server, Dna, LibraryBig, Library } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../../api/authStore'
import ModalChangePassword from '../../components/modal/ModalChangePassword'
import { getDepartmentsById } from '../../controller/3.departments/departments'

export const Profile = () => {
  const { user } = useAuthStore();
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');

  const toggleModalAdd = () => {
    setIsModalAddOpen(!isModalAddOpen);
  };

  const handleAddClick = () => {
      toggleModalAdd();
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Kiểm tra nếu không có ngày để tránh lỗi
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getDepartmentsName = async (khoaid) => {
    try {
      const result = await getDepartmentsById(khoaid)
      return result.khoa.tenkhoa.replace(/^Khoa\s*/, '')
    } catch (error) {
      return "Lỗi hiển thị"      
    }
  }

  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (user.khoaid) {
        const name = await getDepartmentsName(user.khoaid);
        setDepartmentName(name);
      }
    };
    fetchDepartmentName();
  }, [user.khoaid]);

  const renderUserInfo = () => {
    switch (user.vaitro) {
      case 'Student':
        return (
          <>
            <InfoField label="Mã sinh viên" value={user.sinhvienid} Icon={IdCard}/>
            <InfoField label="Ngành học" value={user.tennh} Icon={Server}/>
            <InfoField label="Giới tính" value={user.gioitinh == 0 ? "Nam" : "Nữ"} Icon={Dna}/>
            <InfoField label="Ngày sinh" value={formatDate(user.ngaysinh)} Icon={Calendar}/>
            <InfoField label="Mail" value={user.mail} Icon={Mail}/>
            <InfoField label="Số CCCD" value={user.cccd} Icon={CreditCard}/>
            <InfoField label="Số tài khoản NH" value={user.stknh} Icon={Landmark}/>
            {/* Add other Student fields here */}
          </>
        );
      case 'Teacher':
        return (
          <>
            <InfoField label="Mã giảng viên" value={user.giangvienid} Icon={IdCard}/>
            <InfoField label="Khoa" value={departmentName} Icon={Server}/>
            <InfoField label="Học hàm" value={user.hocham} Icon={Library}/>
            <InfoField label="Học vị" value={user.hocvi} Icon={LibraryBig}/>
            <InfoField label="Giới tính" value={user.gioitinh == 0 ? "Nam" : "Nữ"} Icon={Dna}/>
            <InfoField label="Ngày sinh" value={formatDate(user.ngaysinh)} Icon={Calendar}/>
            <InfoField label="Mail" value={user.mail} Icon={Mail}/>
            <InfoField label="Số CCCD" value={user.cccd} Icon={CreditCard}/>
            <InfoField label="Số tài khoản NH" value={user.stknh} Icon={Landmark}/>

            
            {/* Add other Teacher fields here */}
          </>
        );
      case 'Admin':
        return (
          <>
            <InfoField label="Mã người quản lý" value={user.manql} Icon={IdCard}/>
            <InfoField label="Số điện thoại" value={user.sdt} Icon={Phone}/>
            <InfoField label="Email" value={user.mail} Icon={Mail}/>
            <InfoField label="Tên bộ phận" value={user.tenbophan} Icon={Server} />
            {/* Add other Admin fields here */}
          </>
        );
      default:
        return null;
    }
  };

  const InfoField = ({ label, value, Icon }) => (
    <div className="ml-0 m-4 flex flex-row items-center w-72 rounded-lg py-3 p-3 shadow-sm border-r border-b max-lg:w-full ">
    <Icon as="div" className='h-12 w-12 scale-75 rounded mr-2'/>
    <div className="flex flex-col">
      <span> {label} </span>
      <span className='text-xl text-black font-semibold'> {value} </span>
    </div>
  </div>
  );
  
  return (
    <div className='lg:h-screen flex flex-col max-lg:flex-col max-w-full w-full'>
      <div className="lg:w-full bg-red-500 h-max w-full ">

        <div className="pr-3 py-3 h-full w-full items-center justify-between flex flex-col 
        bg-gradient-to-r from-gray-200 to-gray-500 bg-center shadow-sm border-b max-lg:w-full-2">
          <div className="pr-3 py-3 h-full flex items-center max-h-72 justify-between w-full max-lg:flex-col-reverse">
            <div className="h-full w-max flex max-lg:w-full max-lg:justify-center 
            font-bold text-black px-3 py-6 text-3xl max-md:text-2xl flex-col justify-around 
            "
            >
              {user.vaitro != "Admin" 
              ? 
              (
                <>
                <div className="text-5xl flex border-system max-lg:text-4xl max-md:text-3xl w-fit">
                  {user.hoten}
                </div>
                <div className="">{user.lopid}</div>

                </>
              ) 
              : 
              (
                <div className="text-5xl flex border-system max-lg:text-4xl max-md:text-3xl w-fit">
                  {user.tennql}
                </div>

              )}
              
            </div>
            
            <div className="h-[180px]">
              <img src={user.avtimg} alt="" className='
                  h-full shadow-xl
                  w-full max-w-xs rounded-full
              '/>
              {/* <div className="bg-system text-center py-3 rounded-xl shadow-xl text-lg 
              font-semibold text-white cursor-pointer w-2/3 m-auto">
                Upload photo
              </div> */}
            </div>
          </div>
        </div>  
      </div>

      <div className="py-3 w-full text-system-blue ">
        <div className=" text-lg flex flex-wrap flex-row items-center max-lg:flex-col max-lg:justify-center ">
            {renderUserInfo()}
        </div>
      </div>

      <div className="p-3 flex justify-end items-end h-full w-full">
        <div className="bg-system h-max text-center p-3 rounded-xl shadow-xl text-lg 
        font-semibold text-white cursor-pointer w-max bg-btn-system"
          onClick={handleAddClick}
        >
          Đổi mật khẩu
        </div>
        <ModalChangePassword isOpen={isModalAddOpen} toggleModal={toggleModalAdd} data={user.taikhoanid} />

      </div>

    </div>
  )
}
