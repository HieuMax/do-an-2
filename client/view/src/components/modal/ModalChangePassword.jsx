import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../api/authStore';
import ModalConfirm from './ModalConfirm';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ModalChangePassword = ({isOpen, toggleModal ,data}) => {

	const { changePassword, error, isLoading, message } = useAuthStore();

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const id = data;


  const handleOldPasswordChange = (e) => {
      
    setOldPassword(e.target.value)
    // Xóa lỗi nếu người dùng đã điền tên hội đồng
    if (errors.oldPassword) {
      setErrors((prev) => ({ ...prev, oldPassword: '' }));
    }
  };
  const handlePasswordChange = (e) => {
      
    setPassword(e.target.value)
    // Xóa lỗi nếu người dùng đã điền tên hội đồng
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };
  const handleConfirmPasswordChange = (e) => {
      
    setConfirmPassword(e.target.value)
    // Xóa lỗi nếu người dùng đã điền tên hội đồng
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };


  const resetForm = () => {
    setOldPassword('')
    setPassword('')
    setConfirmPassword('')
  };

  const handleModalClose = () => {
    toggleModal();

    setTimeout(() => {
        resetForm();

    }, 200);

  };
  
  const onSubmitHandler = async () => {
    
		try {
			const result = await changePassword(parseInt(id, 10), password, oldPassword);

			toast.success("Đổi mật khẩu thành công !!");
      handleModalClose()
		} catch (error) {
      toast.warning("Mật khẩu không hợp lệ !!");
        
		}

  }

  /* ---------- Confirm Dialog ---------- */
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Kiểm soát mở/đóng dialog xác nhận

  // Hàm mở Confirm Dialog
  const openConfirmDialog = () => setIsConfirmOpen(true);

  // Hàm đóng Confirm Dialog
  const closeConfirmDialog = () => setIsConfirmOpen(false);

  const handleSubmitWithConfirmation = () => {
    
    if(!id){
      toast.error('Lỗi hệ thống !!')
      return
    }

    let newErrors = {};
    let firstErrorField = null;

    // Validate each field
    if (!oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
      if (!firstErrorField) {
        // firstErrorField = tenHoidongRef;
      }
    } 
    if (!password) {
      newErrors.password = 'Vui lòng mật khẩu mới';
      if (!firstErrorField) {
        // firstErrorField = moTaRef;
      }
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      if (!firstErrorField) {
        // firstErrorField = departmentRef;
      }
    }
    // If there are any errors, set errors state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // if (firstErrorField && firstErrorField.current) {
      //   firstErrorField.current.focus();
      // }
      return;
    }

    if (password !== confirmPassword) {
      toast.info('Vui lòng xác nhận lại mật khẩu')
      return;
    }

    openConfirmDialog()
  };
  return (
    <>
    <ModalConfirm
        isOpen={isConfirmOpen}
        onClose={closeConfirmDialog}
        onConfirm={() => {
          closeConfirmDialog();
          onSubmitHandler();
        }}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu cho tài khoản này ?"
    />

    <Dialog open={isOpen} onClose={handleModalClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Đổi mật khẩu
                </h3>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form className="">
                <div className="grid gap-x-16 gap-y-4 p-6 py-8 grid-cols-2">
                  <div className="relative col-span-2">
                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu cũ</label>
                    <input 
                      onChange={handleOldPasswordChange} 
                      type={showPasswordOld ? "text" : "password"} name="oldPassword" id="oldPassword" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập mật khẩu cũ" required=""
                    />

                    <div 
                      className="absolute right-3 top-[49px] transform -translate-y-1/2 cursor-pointer" 
                      onMouseDown={() => setShowPasswordOld(true)} // Hiển thị mật khẩu khi nhấn giữ
                      onMouseUp={() => setShowPasswordOld(false)}  // Ẩn mật khẩu khi thả chuột
                      onMouseLeave={() => setShowPasswordOld(false)} // Ẩn mật khẩu khi di chuột ra ngoài
                    >
                      {showPasswordOld ? (
                        <EyeIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                      )}
                    </div>

                    {errors.oldPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
                    )}
                  </div>
                  <div className="relative col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu mới</label>
                    <input 
                      onChange={handlePasswordChange} 
                      type={showPassword ? "text" : "password"} name="password" id="password" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập mật khẩu mới" required=""
                    />

                    <div 
                      className="absolute right-3 top-[49px] transform -translate-y-1/2 cursor-pointer" 
                      onMouseDown={() => setShowPassword(true)} // Hiển thị mật khẩu khi nhấn giữ
                      onMouseUp={() => setShowPassword(false)}  // Ẩn mật khẩu khi thả chuột
                      onMouseLeave={() => setShowPassword(false)} // Ẩn mật khẩu khi di chuột ra ngoài
                    >
                      {showPassword ? (
                        <EyeIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                      )}
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  <div className="relative col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Xác nhận mật khẩu mới</label>
                    <input 
                      onChange={handleConfirmPasswordChange} 
                      type={showPasswordConfirm ? "text" : "password"} name="confirmPassword" id="confirmPassword" 
                      className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập lại mật khẩu mới" required=""
                    />
                      
                      <div 
                        className="absolute right-3 top-[49px] transform -translate-y-1/2 cursor-pointer" 
                        onMouseDown={() => setShowPasswordConfirm(true)} // Hiển thị mật khẩu khi nhấn giữ
                        onMouseUp={() => setShowPasswordConfirm(false)}  // Ẩn mật khẩu khi thả chuột
                        onMouseLeave={() => setShowPasswordConfirm(false)} // Ẩn mật khẩu khi di chuột ra ngoài
                      >
                        {showPasswordConfirm ? (
                          <EyeIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeSlashIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                     
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
                  <button
                    type="button"
                    onClick={handleSubmitWithConfirmation}
                    className="inline-flex min-w-16 w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-system-500 sm:ml-3 sm:w-auto"
                  >
                    Đổi mật khẩu
                  </button>
                  <div className="hidden">
                    {/* <ConfirmDialog open={openModal} close={closeModal} isConfirm={isConfirm} props={searchedMember}/> */}
                  </div>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="mt-3 inline-flex min-w-16 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Hủy
                  </button>
                </div>
              </form>
             
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>


  </>
  )
}

export default ModalChangePassword
