import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { deleteCouncil } from '../../controller/5.councils/councils';
import { ManagementContext } from '../../context/ManagementContext';
import { deleteTeacher } from '../../controller/2.mentors/mentors';
import { toast } from 'react-toastify';

const ModalDelete = ({ isOpen, toggleModal, data, onDelete }) => {
  

  const {getCouncilsData, getTeachersData} = useContext(ManagementContext)
  const [nameSelected, setNameSelected] = useState('')

  useEffect(() => {
    if(data.hoidongid){
      setNameSelected(data.tenhoidong)
    }
    if(data.giangvienid){
      setNameSelected(data.hoten)
    }
  },[data])
  const handleDelete = async () => {
    try {
      if(data.hoidongid){
        const response = await deleteCouncil(data.hoidongid); // Gọi hàm xóa hội đồng
        if(response.data.success){
          await getCouncilsData()
          toast.success('Xóa hội đồng thành công!')
        } else {
          toast.error(`Không thể xóa hội đồng ${nameSelected} !!`);
        }
        toggleModal(); // Đóng modal
      }
      if(data.giangvienid){
       
        const response = await deleteTeacher(data.giangvienid); // Gọi hàm xóa hội đồng
        if(response.data.success){
          await getTeachersData()
          toast.success('Xóa giảng viên thành công!')
        } else {
          toast.error(`Không thể xóa giảng viên ${nameSelected} !!`);
        }
        toggleModal()
        
      }
   
    } catch (error) {
      toast.error(`Không thể xóa ${nameSelected} !!`);
 
    }
  };

  return (
    <Dialog open={isOpen} onClose={toggleModal} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Xóa {nameSelected}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {data.hoidongid 
                      ? 'Bạn có chắc chắn muốn xóa hội đồng này không !!?'
                      : 'Bạn có chắc chắn muốn xóa giảng viên này không !!?'
                      
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleDelete} // Gọi hàm xóa tại đây
                className="min-w-16 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Xóa
              </button>
              <button
                type="button"
                data-autofocus
                onClick={toggleModal}
                className="min-w-16 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Hủy
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default ModalDelete;
