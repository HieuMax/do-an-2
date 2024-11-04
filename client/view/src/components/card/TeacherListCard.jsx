import React, { useEffect, useState, useContext } from 'react';
import ModalAssignCouncil from '../modal/ModalAssignCouncil';
import { ManagementContext } from '../../context/ManagementContext';
import { Link } from 'react-router-dom';
import ModalDelete from '../modal/ModalDelete';
import { Skeleton } from 'antd';

const TeacherListCard = ({ props }) => {
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState('HD000');
  const { loadingCA, departmentsContext, getTeachersData } = useContext(ManagementContext);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // Thêm trạng thái sắp xếp

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleModalAssign = () => {
    setIsModalAssignOpen(!isModalAssignOpen);
  };

  const toggleModalDelete = () => {
    setIsModalDeleteOpen(!isModalDeleteOpen);
  };

  const handleDeleteClick = (board) => {
    setSelectedData(board);
    toggleModalDelete();
  };

  const getDepartmentName = (khoaid) => {
    const department = departmentsContext.find((dept) => dept.khoaid === khoaid);
    return department ? department.tenkhoa : 'Không xác định';
  };

  const handleSort = async () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    await getTeachersData(newSortOrder)
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="cursor-pointer w-1/4 px-3 py-3.5 pl-4 pr-3 text-left sm:text-xl text-sm font-semibold text-gray-900 sm:pl-6"
                      onClick={handleSort} // Thêm sự kiện nhấp chuột
                    >
                      Mã giảng viên 
                      <span className='text-xs'>{sortOrder === 'desc' ? ' ▲' : ' ▼'} {/* Dấu mũi tên */}</span>
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
                  {isLoading ? (
                    Array.from({ length: 1 }).map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <Skeleton.Input active size="small" style={{ width: 226 }} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-6 text-sm text-gray-500">
                          <Skeleton.Input active size="small" style={{ width: 250 }} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Skeleton.Input active size="small" style={{ width: 400 }} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <Skeleton.Input active size="small" style={{ width: 150 }} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <Skeleton.Input active size="small" style={{ width: 150 }} />
                        </td>
                      </tr>
                    ))
                  ) : (
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
                          <Link to={`/editing-teacher/${board.giangvienid}`}>
                            <button className="bg-system text-white px-4 py-2 rounded min-w-[100px] mr-2">
                              Chỉnh sửa
                            </button>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded min-w-[100px]"
                            onClick={() => handleDeleteClick(board)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalAssignCouncil isOpen={isModalAssignOpen} toggleModal={toggleModalAssign} data={selectedData} />
      <ModalDelete isOpen={isModalDeleteOpen} toggleModal={toggleModalDelete} data={selectedData} />
    </>
  );
};

export default TeacherListCard;