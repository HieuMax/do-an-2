import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { getCouncilById } from '../../controller/5.councils/councils';
import { updateProjectStatusAndCouncil } from '../../controller/1.projects/project';
import { getCouncilMembers } from '../../controller/5.councils/councils';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../api/authStore';
import ModalConfirm from './ModalConfirm';

const ModalAssignCouncil = ({ isOpen, toggleModal, data, toggleAssigned }) => {
  const [member, setMember] = useState({});
  const [input, setInput] = useState(false);
  const [valid, setValid] = useState(true);
  const [exist, setExist] = useState(false);
  const [value, setValue] = useState();
  const [oldMembers, setOldMembers] = useState({});

  const handleChange = (item) => {
    setValue(item);
  };

  const handleSearch = async () => {
    if (!value) return;
    
    const mem = await fetchData();
    if(!mem) {
      setValid(false);
      return;
    }

    const councilMem = await getCouncilMembersData();
    if(!councilMem) {
      setValid(false);
      return;
    }

    if (mem.hoidongid) {
      setValid(true);
      setInput(true);
      setMember(mem);
      setOldMembers({
        chuTich: councilMem.chuTich,
        chuTichID: councilMem.chuTichID,

        phanBien1: councilMem.phanBien1,
        phanBien1ID: councilMem.phanBien1ID,

        phanBien2: councilMem.phanBien2,
        phanBien2ID: councilMem.phanBien2ID,

        thuKy: councilMem.thuKy,
        thuKyID: councilMem.thuKyID,

        uyVien: councilMem.uyVien,
        uyVienID: councilMem.uyVienID,

      });
    } else {
      setInput(true);
      setValid(false);
    }
  };

  const fetchData = async() => {
    if (!value) return;
    try {
      const validValue = await getCouncilById(value);
      return validValue;
      
    } catch (error) {
      return false
    }
  };
  const getCouncilMembersData = async () => {
    if (!value) return;
    try {
      const response = await getCouncilMembers(value);
      return response;
    } catch (error) {
      return false;
    }

};

  const { user } = useAuthStore();  

  const onSubmitHandler = async () => {
    const response = await updateProjectStatusAndCouncil(data, '1', member.hoidongid, user.taikhoanid)
    if(response.success){
    
      toggleAssigned();
      toast.success('Phân công hội đồng thành công')

      handleModalClose();
      return
    } else {
      return
    }
  };

  const handleModalClose = () => {
    toggleModal();
    setValid(true);
    setInput(false);
    setExist(false);
    setValue('');
    setMember({});
  };


  /* ---------- Confirm Dialog ---------- */
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Kiểm soát mở/đóng dialog xác nhận

  // Hàm mở Confirm Dialog
  const openConfirmDialog = () => setIsConfirmOpen(true);

  // Hàm đóng Confirm Dialog
  const closeConfirmDialog = () => setIsConfirmOpen(false);

  const handleSubmitWithConfirmation = () => {
    
    if(!member.hoidongid) return
    
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
        title="Xác nhận phân công hội đồng"
        message="Bạn có xác nhận phân công hội đồng cho đề tài này không ?"
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Phân công hội đồng cho: {data}
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
                <div className="p-4">
                  <div className="my-2 w-full px-7">
                    <div className="mt-3">
                      <label htmlFor="idCouncil" className="block text-base font-medium leading-6 text-gray-900">
                        Mã số hội đồng
                      </label>
                      <div className="flex items-center w-full justify-between flex-wrap">
                        <input
                          id='idCouncil'
                          placeholder='Nhập mã số hội đồng'
                          onChange={(e) => handleChange(e.target.value)}
                          className={`
                            ${(input && valid) && "bg-green-200 ring-green-500 "} sm:w-2/3 block px-3 w-full rounded-md py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6
                            `}
                        />
                        
                        <div onClick={handleSearch} className=
                          "mt-3 cursor-pointer min-w-16 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-2 sm:w-auto">
                          Tìm
                        </div>
                        <span className={
                          `${valid
                              ? "hidden"
                              : "sm:block"
                          }
                          text-red-500
                          `
                        }>Không tìm thấy, vui lòng thử lại.</span>
                      </div>
                    </div>
                  </div>
                  <div className={`
                    ${(valid && input) ? "block" : "hidden"}
                    w-full text-base mt-6  
                    `}>
                    <hr className='my-3'/>
                    <div className="flex px-4 sm:px-0 justify-center mt-4">
                        <h3 className="text-lg font-semibold leading-7 text-gray-900">Thông tin hội đồng</h3>
                    </div>
                    <div className="mt-6 px-7 border-gray-100">
                        <dl className="divide-y divide-gray-100">
                          <div className="px-4 py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Tên hội đồng</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{member.tenhoidong}</dd>
                            </div>


                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Chủ tịch</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{oldMembers.chuTich}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Thư ký</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{oldMembers.thuKy}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Ủy viên</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{oldMembers.uyVien}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Giảng viên phản biện 1</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{oldMembers.phanBien1}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                                <dt className="text-base font-medium leading-6 text-gray-900">Giảng viên phản biện 2</dt>
                                <dd className="text-base leading-6 text-gray-700 ">{oldMembers.phanBien2}</dd>
                            </div>
                        </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
                  <button
                    type="button"
                    onClick={handleSubmitWithConfirmation}
                    className="inline-flex min-w-16 w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-system-500 sm:ml-3 sm:w-auto"
                  >
                    Phân công
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
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ModalAssignCouncil;