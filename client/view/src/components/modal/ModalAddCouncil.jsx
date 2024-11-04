import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { addCouncilWithMembers } from '../../controller/5.councils/councils';
import { toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';
import ModalConfirm from './ModalConfirm';

const modalCouncil = ({ isOpen, toggleModal, data, getCouncilData }) => {


    /* ---------- Khai báo useState, useRef ---------- */
    const [departments, setDepartments] = useState([]); // Lưu trữ List All Khoa load lên từ DB
    const [selectedDepartment, setSelectedDepartment] = useState(''); // Lưu trữ Khoa được lựa chọn

    const [giangVienList, setGiangVienList] = useState([]); // Lưu trữ List All Giảng Viên từ DB
    const [filteredGiangVienList, setFilteredGiangVienList] = useState([]); // Lưu trữ List Giảng Viên đã được filter theo Khoa
  
    const [tenHoidong, setTenHoidong] = useState(''); // Lưu trữ input Hội Đồng
    const [moTa, setMoTa] = useState(''); // Lưu trữ input Mô Tả

    const [selectedLecturers, setSelectedLecturers] = useState({ // Lưu trữ 1 object Thành viên hội đồng
      chuTich: '',
      phanBien1: '',
      phanBien2: '',
      thuKy: '',
      uyVien: ''
    }); 
    
    const {teachers, departmentsContext, getCouncilsData, loadingCC, loadingButtonCC} = useContext(ManagementContext)
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Tạo ref cho các input cần focus khi có lỗi
    const tenHoidongRef = useRef(null);
    const moTaRef = useRef(null);
    const departmentRef = useRef(null);
    const lecturerRefs = {
      chuTich: useRef(null),
      phanBien1: useRef(null),
      phanBien2: useRef(null),
      thuKy: useRef(null),
      uyVien: useRef(null),
    };

    /* ---------- Lấy dữ liệu từ Database ---------- */
    useEffect(() => {
      setGiangVienList(teachers)
      setDepartments(departmentsContext)
    }, [teachers, departmentsContext]);

    /* ---------- Handle giá trị của các selection box ---------- */
    const handleDepartmentChange = (e) => {
      const departmentId = e.target.value;
      setSelectedDepartment(departmentId);
      const filteredList = giangVienList.filter(
        (giangVien) => giangVien.khoaid === departmentId
      );
      setFilteredGiangVienList(filteredList);

      // Xóa lỗi nếu người dùng đã chọn khoa
      if (errors.selectedDepartment) {
        setErrors((prev) => ({ ...prev, selectedDepartment: '' }));
      }
    };

    const handleCouncilNameChange = (e) => {
      
      setTenHoidong(e.target.value)
      // Xóa lỗi nếu người dùng đã điền tên hội đồng
      if (errors.tenHoidong) {
        setErrors((prev) => ({ ...prev, tenHoidong: '' }));
      }
    };

    const handleCouncilDescriptionChange = (e) => {
      
      setMoTa(e.target.value)
      // Xóa lỗi nếu người dùng đã điền tên hội đồng
      if (errors.moTa) {
        setErrors((prev) => ({ ...prev, moTa: '' }));
      }
    };

    const handleLecturerChange = (role, value) => {
      setSelectedLecturers((prevSelectedLecturers) => ({
        ...prevSelectedLecturers,
        [role]: value
      }));
      
    };
    // Kiểm tra nếu tất cả các vai trò đã được chọn
    useEffect(() => {
      const allRolesSelected = Object.values(selectedLecturers).every((v) => v !== '');
      if(allRolesSelected){
        setErrors((prev) => ({ ...prev, selectedLecturers: '' }));
      }
    },[selectedLecturers])

    /* ---------- Handle nút thêm hội đồng ---------- */
    const onSubmitHandler = async () => {
 
      const chuTich = selectedLecturers.chuTich;
      const phanBien1 = selectedLecturers.phanBien1;
      const phanBien2 = selectedLecturers.phanBien2;
      const thuKy = selectedLecturers.thuKy;
      const uyVien = selectedLecturers.uyVien;

      const giangVienIds = [chuTich, phanBien1, phanBien2, thuKy, uyVien];

      const uniqueGiangVienIds = new Set(giangVienIds);
      if (uniqueGiangVienIds.size !== giangVienIds.length) {
          toast.warning('Không được phép chọn trùng giảng viên cho các vai trò khác nhau.');
          return;
      }

      const requestData = {
        tenhoidong: tenHoidong,
        mota: moTa,
        thanhvien: [
          { giangvienid: chuTich, vaitro: 'Chủ tịch' },
          { giangvienid: phanBien1, vaitro: 'Phản biện 1' },
          { giangvienid: phanBien2, vaitro: 'Phản biện 2' },
          { giangvienid: thuKy, vaitro: 'Thư ký' },
          { giangvienid: uyVien, vaitro: 'Ủy viên' },
        ],
      };

      try {

        setSubmitted(true);
        await addCouncilWithMembers(requestData);
        await getCouncilsData(); // Load lại danh sách hội đồng sau khi thêm thành công

      } catch (error) {
        toast.warning('Đã xảy ra lỗi khi thêm hội đồng và thành viên.');

        setSubmitted(false);

      }

  
    };

    useEffect(() => {
      if (submitted && !loadingButtonCC) {
        setSubmitted(false)
        toast.success('Hội đồng mới đã được thêm thành công!!')
        handleModalClose()
      }
    }, [loadingButtonCC]);

    
    /* ---------- Handle khi tắt form ---------- */
    const resetForm = () => {
      setSelectedDepartment('');
      setFilteredGiangVienList([]);
      setTenHoidong('');
      setMoTa('');
      setSelectedLecturers({
        chuTich: '',
        phanBien1: '',
        phanBien2: '',
        thuKy: '',
        uyVien: ''
      });
    };

    const handleModalClose = () => {
      toggleModal();

      setTimeout(() => {
          resetForm();
          setErrors({});

      }, 200);

    };
    /* ---------- Confirm Dialog ---------- */
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Kiểm soát mở/đóng dialog xác nhận

    // Hàm mở Confirm Dialog
    const openConfirmDialog = () => setIsConfirmOpen(true);

    // Hàm đóng Confirm Dialog
    const closeConfirmDialog = () => setIsConfirmOpen(false);


  // Mở dialog xác nhận trước khi thực hiện submit
    const handleSubmitWithConfirmation = (e) => {
      e.preventDefault();
      
      let newErrors = {};
      let firstErrorField = null;
    
      // Validate each field
      if (!tenHoidong) {
        newErrors.tenHoidong = 'Vui lòng nhập tên hội đồng';
        if (!firstErrorField) {
          firstErrorField = tenHoidongRef;
        }
      } 
      if (!moTa) {
        newErrors.moTa = 'Vui lòng nhập mô tả';
        if (!firstErrorField) {
          firstErrorField = moTaRef;
        }
      }
      if (!selectedDepartment) {
        newErrors.selectedDepartment = 'Vui lòng chọn khoa';
        if (!firstErrorField) {
          firstErrorField = departmentRef;
        }
      }
      if (!selectedLecturers.chuTich || !selectedLecturers.phanBien1 || !selectedLecturers.phanBien2 || !selectedLecturers.thuKy || !selectedLecturers.uyVien) {
        newErrors.selectedLecturers = 'Vui lòng phân công đủ vai trò';
      }
      
      // Validate each role and set focus for the first missing one
      const roles = ['chuTich', 'phanBien1', 'phanBien2', 'thuKy', 'uyVien'];
      roles.forEach((role) => {
        if (!selectedLecturers[role]) {
          newErrors[role] = `Vui lòng chọn ${role === 'chuTich' ? 'Chủ tịch' : role === 'phanBien1' ? 'Phản biện 1' : role === 'phanBien2' ? 'Phản biện 2' : role === 'thuKy' ? 'Thư ký' : 'Ủy viên'}`;
          if (!firstErrorField) {
            firstErrorField = lecturerRefs[role];
          }
        }
      });

      // If there are any errors, set errors state
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        if (firstErrorField && firstErrorField.current) {
          firstErrorField.current.focus();
        }
        return;
      }
      // Reset errors if no errors found
      setErrors({});
      openConfirmDialog()
    };

    /* ---------- Ending ---------- */


    
  return (
    <>
      
      <ModalConfirm
        isOpen={isConfirmOpen}
        onClose={closeConfirmDialog}
        onConfirm={() => {
          closeConfirmDialog();
          onSubmitHandler();
        }}
        title="Xác nhận thêm hội đồng"
        message="Bạn có chắc chắn muốn thêm hội đồng mới này không?"
      />



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
                Thêm hội đồng mới
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
            <form onSubmit={handleSubmitWithConfirmation} className="">
                <div className="grid gap-x-16 gap-y-4 p-6 grid-cols-2">
                    <div className="col-span-2">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên hội đồng</label>
                        <input ref={tenHoidongRef} onChange={handleCouncilNameChange} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập tên hội đồng" required=""/>
                        {errors.tenHoidong && (
                          <p className="mt-1 text-sm text-red-600">{errors.tenHoidong}</p>
                        )}
                    </div>
                    <div className="col-span-2">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
                        <input ref={moTaRef} onChange={handleCouncilDescriptionChange} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập mô tả" required=""/>
                        {errors.moTa && (
                          <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>
                        )}
                    </div>
                    {/* --------- Select Option CHON KHOA --------- */}
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Chọn khoa
                      </label>
                      <select
                        id="department"
                        value={selectedDepartment}
                        ref={departmentRef}
                        onChange={handleDepartmentChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option value="">Chọn khoa</option>
                        {departments.map((department) => (
                          <option key={department.khoaid} value={department.khoaid}>
                            {department.tenkhoa}
                          </option>
                        ))}
                      </select>
                      {errors.selectedDepartment && (
                        <p className="mt-1 text-sm text-red-600">{errors.selectedDepartment}</p>
                      )}
                    </div>

                    {/* --------- Select Option CHON GIANG VIEN --------- */}

                    {['chuTich', 'phanBien1', 'thuKy', 'phanBien2', 'uyVien'].map((role, index) => (
                    <div className="col-span-2 sm:col-span-1" key={index}>
                      <label
                        htmlFor={role}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {role === 'chuTich'
                          ? 'Chủ tịch hội đồng'
                          : role === 'phanBien1'
                          ? 'Giảng viên phản biện 1'
                          : role === 'phanBien2'
                          ? 'Giảng viên phản biện 2'
                          : role === 'thuKy'
                          ? 'Thư ký chương trình'
                          : 'Ủy viên'}
                      </label>
                      <select
                        id={role}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedLecturers[role]}
                        ref={lecturerRefs[role]}
                        onChange={(e) => handleLecturerChange(role, e.target.value)}
                        disabled={!selectedDepartment}
                 
                      >
                        <option value="">Chọn giảng viên</option>
                        {filteredGiangVienList.map((giangvien) => (
                          <option
                            key={giangvien.giangvienid}
                            value={giangvien.giangvienid}
                            disabled={Object.values(selectedLecturers).includes(giangvien.giangvienid) && selectedLecturers[role] !== giangvien.giangvienid}
                          >
                            {giangvien.hoten}
                          </option>
                        ))}
                        {/* Show the selected lecturer even if it's not part of the filtered list */}
                        {selectedLecturers[role] && !filteredGiangVienList.find(gv => gv.giangvienid === selectedLecturers[role]) && (
                          <option key={selectedLecturers[role]} value={selectedLecturers[role]}>
                            {giangVienList.find(gv => gv.giangvienid === selectedLecturers[role])?.hoten || 'Giảng viên đã chọn'}
                          </option>
                        )}
                      </select>
                    </div>
                  ))}
                  {errors.selectedLecturers && (
                    <p className="mt-1 text-sm text-red-600">{errors.selectedLecturers}</p>
                  )}
                </div>  

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
            

                  className="inline-flex w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                >
                    {loadingButtonCC 
                    ?  
                    <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> 
                    : ''}
                   
                  <span className="font-medium">{loadingButtonCC ? ' Processing... ' : 'Thêm hội đồng'}</span>
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
  );
};

export default modalCouncil;
