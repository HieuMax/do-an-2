import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { getAllTeachers, getAllDepartments, getCouncilMembers, updateCouncilMember } from '../../controller/5.councils/councils';
import { ManagementContext } from '../../context/ManagementContext';
import { toast } from 'react-toastify';

const modalEditCouncil = ({ isOpen, toggleModal, data }) => {


    /* ---------- Khai báo useState ---------- */
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [giangVienList, setGiangVienList] = useState([]);
    const [filteredGiangVienList, setFilteredGiangVienList] = useState([]);

    const [oldMembers, setOldMembers] = useState({});
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLecturer, setSelectedLecturer] = useState('');

    const [selectedLecturers, setSelectedLecturers] = useState({
      chuTich: '',
      chuTichID: '',

      phanBien1: '',
      phanBien1ID: '',

      phanBien2: '',
      phanBien2ID: '',

      thuKy: '',
      thuKyID: '',

      uyVien: '',
      uyVienID: ''

    });
    
    const {teachers, departmentsContext, getCouncilsData} = useContext(ManagementContext)
    const [continueButton, setContinueButton] = useState(false)
    
    /* ---------- Lấy dữ liệu từ Database ---------- */

    /* ---------- useEffect: Load dữ liệu lên trang ---------- */

    useEffect(() => {
      setGiangVienList(teachers)
      setDepartments(departmentsContext)
      getCouncilMembersData()
    }, [teachers, departmentsContext, data]);

    const getCouncilMembersData = async () => {
      try {
        if (data && data.hoidongid != null) { // Kiểm tra nếu data tồn tại
          const response = await getCouncilMembers(data.hoidongid);
          if (response) {

            setOldMembers({
              chuTich: response.chuTich,
              chuTichID: response.chuTichID,

              phanBien1: response.phanBien1,
              phanBien1ID: response.phanBien1ID,

              phanBien2: response.phanBien2,
              phanBien2ID: response.phanBien2ID,

              thuKy: response.thuKy,
              thuKyID: response.thuKyID,

              uyVien: response.uyVien,
              uyVienID: response.uyVienID,

            });
          } else {
            console.error("Error fetching council members");
          }
        }
        
      } catch (error) {
          console.error(error);
      }
    };


    /* ---------- Handle giá trị của các selection box ---------- */
    const handleRoleChange = (e) => {
      const role = e.target.value;
      setSelectedRole(role);

      let rowIndex;
      if(role === 'Chủ tịch'){
        rowIndex = 'chuTichID';
      }
      if(role === 'Phản biện 1'){
        rowIndex = 'phanBien1ID';
      }
      if(role === 'Phản biện 2'){
        rowIndex = 'phanBien2ID';
      }
      if(role === 'Ủy viên'){
        rowIndex = 'uyVienID';
      }
      if(role === 'Thư ký'){
        rowIndex = 'thuKyID';
      }
      // console.log(role)
      // console.log(rowIndex)

      // Lấy giảng viên hiện tại của vai trò đã chọn
      const currentLecturerID = oldMembers[rowIndex];
 
      if (currentLecturerID) {
          // Tìm giảng viên từ danh sách giảng viên
          const giangVien = giangVienList.find((gv) => gv.giangvienid === currentLecturerID);
          if (giangVien) {
              setSelectedDepartment(giangVien.khoaid); // Đặt khoa của giảng viên
              setFilteredGiangVienList(giangVienList.filter((gv) => gv.khoaid === giangVien.khoaid)); // Lọc danh sách giảng viên theo khoa
              setSelectedLecturer(giangVien.giangvienid); // Đặt giảng viên hiện tại
          }
      } else {
          // Nếu không có giảng viên nào hiện tại, đặt lại các giá trị
          setSelectedDepartment('');
          setFilteredGiangVienList([]);
          setSelectedLecturer('');
      }
    };

    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        setSelectedDepartment(departmentId);
        const filteredList = giangVienList.filter((giangVien) => giangVien.khoaid === departmentId);
        setFilteredGiangVienList(filteredList);
        setSelectedLecturer(''); // Đặt lại lựa chọn giảng viên
    };

    const handleLecturerChange = (e) => {
        setSelectedLecturer(e.target.value);
    };

    /* ---------- Handle nút sửa thành viên theo vai trò trong hội đồng ---------- */
    const submitHandler = async (e) => {

      if(continueButton){
        setContinueButton(!continueButton)
        return
      }
      if (!selectedRole) {
        toast.warn("Vui lòng chọn vai trò")
        return;
      }
      if (!selectedDepartment) {
        toast.warn("Vui lòng chọn khoa")
        return;
      }
      if (!selectedLecturer) {
        toast.warn("Vui lòng chọn giảng viên")
        return;
      }
      let rowIndex;
      if(selectedRole === 'Chủ tịch'){
        rowIndex = 'chuTichID';
      }
      if(selectedRole === 'Phản biện 1'){
        rowIndex = 'phanBien1ID';
      }
      if(selectedRole === 'Phản biện 2'){
        rowIndex = 'phanBien2ID';
      }
      if(selectedRole === 'Ủy viên'){
        rowIndex = 'uyVienID';
      }
      if(selectedRole === 'Thư ký'){
        rowIndex = 'thuKyID';
      }

      const currentLecturerId = oldMembers[rowIndex];
      if (currentLecturerId === selectedLecturer) {
        alert("Chưa có thông tin nào được thay đổi");
        return;
      }

      const updatedMember = {
        hoidongid: data.hoidongid,
        vaitro: selectedRole,
        giangvienid: selectedLecturer,
      };
    
      try {
        const response = await updateCouncilMember(updatedMember); // Gọi API cập nhật thành viên hội đồng
        if (response.success) {
          await getCouncilsData();
          toast.success("Chỉnh sửa thành viên hội đồng thành công")
          setContinueButton(true)
          setSelectedDepartment('')
          setSelectedLecturer('')
          setSelectedRole('')
          // toggleModal(); // Đóng modal sau khi cập nhật thành công
        } else {
          console.error("Lỗi khi cập nhật thành viên hội đồng");
          alert("Chỉnh sửa không thành công, vui lòng thử lại");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau");
      }

    }

    /* ---------- Handle khi tắt form ---------- */
    const resetForm = () => {
      setSelectedDepartment('');
      setFilteredGiangVienList([])
      setSelectedRole('');
      setSelectedLecturer('')
    };

    const handleModalClose = () => {
      resetForm();
      toggleModal();
    };

    /* ---------- Ending ---------- */

  return (
    <>
      <Dialog open={isOpen} onClose={handleModalClose} className="relative z-50">
        {/* ---------- Modal Overlay ----------*/}
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
              <div className="bg-white ">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chỉnh sửa {data.tenhoidong}
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
            <div className='flex justify-between'>
              <form className="flex gap-8 flex-1 p-4 md:p-5">
                  <div className='w-1/2'>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      {['chuTich', 'thuKy', 'uyVien', 'phanBien1', 'phanBien2'].map((role, index) => (
                        <div className="col-span-2" key={index}>
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
                          <input disabled value={oldMembers[role] || ''} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  required=""/>
                          
                        </div>
                      ))}
                      
                    </div>
                  </div>

                  <div className='w-1/2'>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Chọn vai trò cần thay đổi
                        </label>
                        <select
                          value={selectedRole}
                          onChange={handleRoleChange}
                          disabled={continueButton}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        >
                          <option value="">Chọn vai trò</option>
                          <option value="Chủ tịch">Chủ tịch hội đồng</option>
                          <option value="Thư ký">Thư ký chương trình</option>
                          <option value="Ủy viên">Ủy viên</option>
                          <option value="Phản biện 1">Giảng viên phản biện 1</option>
                          <option value="Phản biện 2">Giảng viên phản biện 2</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className={`${!selectedRole ? 'hidden' : ''} block mb-2 text-sm font-medium text-gray-900 dark:text-white`}>
                          Chọn khoa
                        </label>
                        <select
                          value={selectedDepartment}
                          onChange={handleDepartmentChange}
                          className={`${!selectedRole ? 'hidden' : ''} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                          // disabled={!selectedRole}
                        >
                          <option value="">Chọn khoa</option>
                          {departments.map((department) => (
                            <option key={department.khoaid} value={department.khoaid}>
                              {department.tenkhoa}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className={`${!selectedDepartment ? 'hidden' : ''} block mb-2 text-sm font-medium text-gray-900 dark:text-white`}>
                          Chọn giảng viên
                        </label>
                        <select
                          value={selectedLecturer}
                          onChange={handleLecturerChange}
                          className={`${!selectedDepartment ? 'hidden' : ''} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                          disabled={!selectedDepartment}
                        >
                          <option value="">Chọn giảng viên</option>
                          {filteredGiangVienList.map((giangvien) => (
                          <option
                            key={giangvien.giangvienid}
                            value={giangvien.giangvienid}
                            disabled={Object.values(oldMembers).includes(giangvien.giangvienid) && oldMembers[selectedRole] !== giangvien.giangvienid}
                          >
                            {giangvien.hoten}
                          </option>
                          ))}
                        {/* {selectedLecturers[selectedRole] && !filteredGiangVienList.find(gv => gv.giangvienid === selectedLecturers[selectedRole]) && (
                          <option key={selectedLecturers[selectedRole]} value={selectedLecturers[selectedRole]}>
                            {giangVienList.find(gv => gv.giangvienid === selectedLecturers[selectedRole])?.hoten || 'Giảng viên đã chọn'}
                          </option>
                        )} */}
                        </select>
                      </div>
                      
                      
                      
                    </div >
                  </div>
                 
              </form>
              </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={(e) => submitHandler(e)}

                  className="inline-flex w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                >
                  {continueButton ? 'Tiếp tục chỉnh sửa' : 'Chỉnh sửa'}
     
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
            </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
  );
};

export default modalEditCouncil;
