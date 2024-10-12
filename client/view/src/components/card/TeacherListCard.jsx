import React, { useEffect, useState, useContext } from 'react';

import ModalAssignCouncil from '../modal/ModalAssignCouncil';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'

const TeacherListCard = ({ props }) => {
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);

  const [selectedData, setSelectedData] = useState('HD000');
  const { loadingCA, departmentsContext } = useContext(ManagementContext);



  // Edit Council
  const toggleModalAssign = () => {
    setIsModalAssignOpen(!isModalAssignOpen);
  };

  const handleAssignClick = (board) => {
    setSelectedData(board);
    toggleModalAssign();
  };

  // Hàm để lấy tên khoa từ departmentsContext
  const getDepartmentName = (khoaid) => {
    const department = departmentsContext.find((dept) => dept.khoaid === khoaid);
    return department ? department.tenkhoa : 'Không xác định';
  };

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/addTeacher'); // Điều chỉnh URL của trang thêm giảng viên phù hợp với định nghĩa route của bạn

  }

  const [excelData, setExcelData] = useState([])

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0])
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {type: "binary"});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData= XLSX.utils.sheet_to_json(sheet);
      setExcelData(parsedData)
      console.log(parsedData)
    }
    console.log('hi')
  }
  useEffect(() => {
    console.log(excelData)
  }, [excelData])

  return (
    <>

      <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">
        <button 
          onClick={handleAddClick} 
          className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
          // disabled={loadingCC}
        >
          Thêm giảng viên
        </button>
        <button 
          // onClick={handleAddClick} 
          className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
          // disabled={loadingCC}
        >
          Thêm danh sách giảng viên
        </button>
        <input 
          type="file"
          accept='.xlsx, .xls'
          onChange={handleFileUpload} 
        />
      </div>

      {/* <table>
        <thead>
          <tr>
            {Object.keys(excelData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
      </table> */}

      <div className="flex sm:flex-row sm:w-full flex-col mb-4">
   
        <div className="flex sm:flex-row flex-col items-start sm:items-center">
          <label className="block font-bold mr-4">Tìm kiếm giảng viên:</label>
          <input
            type="text"
            placeholder="Nhập ID hoặc mã tên khoa..."
            className="border border-gray-300 p-2 rounded flex-1 min-w-64"
          />
        </div>
      </div>


      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="w-1/4 px-3 py-3.5 pl-4 pr-3 text-left sm:text-xl text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Mã giảng viên
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/4 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Họ tên
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/2 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Khoa
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/2 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
            
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/2 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!loadingCA ? (
                    props.map((board) => (
                      <tr key={board.giangvienid}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:text-base text-sm font-medium text-gray-900 sm:pl-6">
                          {board.giangvienid}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-black">{board.hoten}</td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm">
                          {getDepartmentName(board.khoaid)}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                            <Link to={`/editTeacher/${board.giangvienid}`}>
                            <button
                                className="bg-system text-white px-4 py-2 rounded min-w-[100px] mr-2"
                                // onClick={() => handleAssignClick(board)}
                            >
                                Chỉnh sửa
                            </button>
                            </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                            <button
                            className="bg-[#B80011] text-white px-4 py-2 rounded min-w-[100px]"
                            // onClick={() => handleDeleteClick(board)}
                            >
                                Xóa
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 min-w-[100px]">
                          <span className="block w-full h-4 bg-gray-200">
                            
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 min-w-[200px]">
                          <span className="block w-full h-4 bg-gray-200"></span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 min-w-[200px]">
                          <span className="block w-full h-4 bg-gray-200"></span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center min-w-[100px]">
                          <span className="block w-full h-4 bg-gray-200"></span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center min-w-[100px]">
                          <span className="block w-full h-4 bg-gray-200"></span>
                        </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {/* Modal */}

      <ModalAssignCouncil isOpen={isModalAssignOpen} toggleModal={toggleModalAssign} data={selectedData} />
    </>
  );
};

export default TeacherListCard;
