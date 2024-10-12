import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';
import { PaperClipIcon } from '@heroicons/react/20/solid'


const ModalAssignCouncil = ({ isOpen, toggleModal, data }) => {


    const { teachers, students, councils } = useContext(ManagementContext);


      // Tìm tên sinh viên dựa trên ID
    const student = students.find((s) => s.sinhvienid === data.sinhvienid);
    const studentName = student ? student.hoten : 'Không tìm thấy sinh viên';

    // Tìm tên giảng viên hướng dẫn dựa trên ID
    const teacher = teachers.find((t) => t.giangvienid === data.giangvienchunhiemid);
    const teacherName = teacher ? teacher.hoten : 'Không tìm thấy giảng viên';

    const handleModalClose = () => {
        toggleModal();
      };

  return (
        <>
      <Dialog open={isOpen} onClose={handleModalClose} className="relative z-50">
        {/* Modal Overlay */}
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
              <div className="bg-white ">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Phân công hội đồng cho: {data.tendetai}
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
                

            <div className='px-10 py-5'> 
                <div className="flex px-4 sm:px-0 justify-center">
                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Thông tin đề tài</h3>
                </div>
                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-base font-medium leading-6 text-gray-900">Tên đề tài</dt>
                            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.tendetai}</dd>
                        </div>
                        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-base font-medium leading-6 text-gray-900">SV thực hiện</dt>
                            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{studentName}</dd>
                        </div>
                        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-base font-medium leading-6 text-gray-900">Lĩnh vực</dt>
                            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.linhvuc}</dd>
                        </div>
                        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-base font-medium leading-6 text-gray-900">GV hướng dẫn</dt>
                            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{teacherName}</dd>
                        </div>
                    </dl>
                </div>
                <div className="flex mt-6 px-4 sm:px-0 justify-center">
                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Phân công hội đồng</h3>
                </div>
                <div className="col-span-2 mt-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Chọn hội đồng
                    </label>
                    <select
                    id="department"
                    // value={}
                    // ref={}
                    // onChange={handleDepartmentChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                    <option value="">Chọn hội đồng</option>
                    {councils.map((council) => (
                        <option key={council.hoidongid} value={council.hoidongid}>
                        {council.tenhoidong}
                        </option>
                    ))}
                    </select>
                    {/* {errors.selectedDepartment && (
                    <p className="mt-1 text-sm text-red-600">{errors.selectedDepartment}</p>
                    )} */}
                </div>
            </div>

                     

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                    type="submit"
                

                    className="inline-flex w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    >
                        {/* {loadingButtonCC 
                        ?  
                        <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> 
                        : ''} */}
                    
                        <span className="font-medium">Phân công</span>
                    </button>

                    <button
                    type="button"
                    data-autofocus
                    onClick={handleModalClose}

                    className="min-w-16 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default ModalAssignCouncil
