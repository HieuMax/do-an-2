import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { uploadTeacherList } from '../../controller/2.mentors/mentors';
import { ListCard } from '../../components/card/ListCard';
import Pagination from '../../utils/Pagination';
import { useDebounce } from '../../utils/useDebounce';
import 'react-toastify/dist/ReactToastify.css';
import { ManagementContext } from '../../context/ManagementContext';
import Dropdown from '../../components/dropdown/Dropdown';
import { FileUploadManagement } from '../../components/dialog/FileUploadManagement';

const TeacherList = () => {
  const { teachers, departmentsContext, getTeachersData } = useContext(ManagementContext);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [status, setStatus] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [resetFileArray, setResetFileArray] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const navigate = useNavigate();


  // ------------------ Add Teacher Page ------------------

  const handleAddClick = () => {
    navigate('/adding-teacher');
  };
  // ------------------ Input Search Teacher ------------------

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };



  useEffect(() => {
    let filteredByDepartment = teachers;
    if (selectedDepartment && selectedDepartment.id !== "0") {
      filteredByDepartment = teachers.filter(teacher => teacher.khoaid === selectedDepartment.id);
    }

    const searchResult = filteredByDepartment.filter(teacher =>
      teacher.giangvienid.toLowerCase().includes(debouncedSearchValue.toLowerCase()) || 
      teacher.hoten.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );
    setFilteredTeachers(searchResult);
  }, [teachers, selectedDepartment, debouncedSearchValue]);


  // ------------------ Handle Filter Select Department ------------------
  const handleDepartmentChange = (selectedDept) => {
    setSelectedDepartment(selectedDept);
  };
  
  useEffect(() => {
    const mappedStatus = departmentsContext.map(department => ({
      id: department.khoaid,
      name: department.tenkhoa
    }));
    setStatus([{ id: "0", name: "Chọn khoa" }, ...mappedStatus]);
  }, [departmentsContext]);

  // ------------------ Upload List Modal ------------------
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const openUploadModal = () => {
    setIsUploadOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
  };

  const handleAddListClick = async () => {
    if (fileList.length <= 0) {
      toast.warn('Chưa chọn file excel để thêm');
      return;
    }

    try {
      const result = await uploadTeacherList(fileList);
      await getTeachersData();
      if (result.success) {
        toast.success('Thêm danh sách giảng viên thành công!');
        setFileList([])
        setFileName([])
      } else {
        toast.error('Dữ liệu không hợp lệ!');
        setResetFileArray(true)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi thêm danh sách giảng viên!');
    }
  };

  // ------------------ Transfer Data ------------------

  const Log = {
    data: filteredTeachers,
    parent: "TeacherListCard"
  };

  // ------------------ End ------------------

  return (
    <div className="h-full ">
      <div className="h-full max-w-full mt-3 py-3 px-6 flex p-[-12px] flex-col">
        <h1 className="sm:text-2xl text-xl font-bold underline">Danh sách giảng viên</h1>
        <div className="statusButton py-3">
          <div className="h-full max-w-full p-[-3px]">
            <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">
              <button 
                onClick={handleAddClick} 
                className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded">
                Thêm giảng viên
              </button>
              <button 
                onClick={handleAddListClick} 
                className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded">
                Thêm danh sách giảng viên
              </button>
            </div>

            <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">
              <div className="flex sm:flex-row flex-col items-start sm:items-center">
                <label className="block font-bold mr-4">Tìm kiếm giảng viên:</label>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-blue-950 transition-colors duration-200">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    placeholder="Nhập mã hoặc tên giảng viên..."
                    className="p-2 flex-1 outline-none w-56 text-sm"
                  />
                  <div className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-1/3">
                <div
                  className="px-3 rounded-md border-0 py-[1.5px] mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                  flex items-center justify-between"
                  onClick={openUploadModal}>
                  <div className="file:hidden" id="inputGroupFile02">
                  {fileName.length > 0 
                  ? fileName.map(file => file.name).join(' | ') 
                  : 'Không có tệp nào được chọn'}
                  </div>
                  <label className="input-group-text" htmlFor='inputGroupFile02'>
                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl font-semibold text-white cursor-pointer w-fit m-auto">
                      Upload
                    </div>
                  </label>
                </div>
              </div>

              <FileUploadManagement 
                isOpen={isUploadOpen} 
                onClose={closeUploadModal} 
                setFileList={setFileList}
                setFileName={setFileName}
                resetFileArray={resetFileArray}
              />
            </div>

            <div className="w-fit">
              {status.length > 0 && <Dropdown prop={status} update={handleDepartmentChange} />}
            </div>

            <ListCard props={Log}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
