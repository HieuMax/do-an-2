import React, { useEffect, useState, useContext } from 'react';
import ModalEditAssignCouncil from '../modal/ModalEditAssignCouncil';
import { ManagementContext } from '../../context/ManagementContext';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CouncilAssignmentCard = ({ props }) => {
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState('HD000');
  const { loadingCA, getProjectsData } = useContext(ManagementContext);
  const [sortOrder, setSortOrder] = useState('desc'); // Thêm trạng thái sắp xếp
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Edit Council
  const toggleModalAssign = () => {
    setIsModalAssignOpen(!isModalAssignOpen);
  };

  const handleAssignClick = (board, action) => {
    setSelectedData(board);
    setActionType(action); // Truyền loại hành động (Phân công/Thanh lý)
    toggleModalAssign();
  };
  

  const handleSort = async () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    await getProjectsData(newSortOrder)
  };
  const navigate = useNavigate();
  const isAssign = true; // hoặc false

  const handleClick = (id) => {
    navigate(`/project-list/${id}`, { state: { detaiId: id, isAssign } });

  }

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
                      Mã đề tài
                      <span className='text-xs'>{sortOrder === 'desc' ? ' ▲' : ' ▼'} {/* Dấu mũi tên */}</span>
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/4 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Tên đề tài
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/2 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Trạng thái
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
                  {!isLoading ? (
                    props.map((board) => (
                      <tr key={board.detaiid}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:text-base text-sm font-medium text-gray-900 sm:pl-6">
                          {board.detaiid}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-black">{board.tendetai}</td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm">
                        {board.trangthai === 7 
                        ? (
                          <div className="flex items-center space-x-2 border border-red-800 justify-center bg-[#FFD6D6] w-[170px] text-red-600 px-5 py-3 ">
                            <span>Đã thanh lý</span>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="rounded-full h-5 w-5 bg-green-500 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.9 7.9a1 1 0 01-1.415 0l-3.6-3.6a1 1 0 011.415-1.415l3.187 3.186 7.187-7.187a1 1 0 011.415 0z" clipRule="evenodd" />
                            </svg> */}
                          </div>
                        ) 
                        : (
                          board.hoidongphancong ? (
                            <div className="flex items-center space-x-2 border border-green-500 justify-center bg-green-50 w-[170px] text-green-700 px-5 py-3 ">
                                <span>Đã phân công</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="rounded-full h-5 w-5 bg-green-500 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.9 7.9a1 1 0 01-1.415 0l-3.6-3.6a1 1 0 011.415-1.415l3.187 3.186 7.187-7.187a1 1 0 011.415 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            ) : (
                            <div className="flex items-center space-x-2 border border-gray-300 justify-center w-[170px] bg-gray-50 text-gray-700 px-5 py-3">
                                <span>Chưa phân công</span>
                         
                            </div>
                        )
                        )
                        }
           
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                            {board.trangthai === 7 
                            ? ""
                            : (
                              board.hoidongphancong ? (
                                <button
                                 className="bg-gray-600 text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                 onClick={() => handleAssignClick(board, 'phancong')}
                               >
                                 Chỉnh sửa
                               </button>
                                ) : (
                                    <button
                                      className="bg-system text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                      onClick={() => handleClick(board.detaiid)}
                                    >
                                      Phân công
                                    </button>

                                )
                              )
                            }
                            
                         

                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                          {board.trangthai === 7 
                            ? (
                              <button
                                className="bg-gray-600 text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                onClick={() => navigate(`/project-view/${board.detaiid}`)} // Truyền 'thanhly'
                              >
                                Xem chi tiết
                              </button>
                            )
                            : (
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                onClick={() => handleAssignClick(board, 'thanhly')} // Truyền 'thanhly'
                              >
                                Thanh lý
                              </button>
                            )
                          }
                          
                         

                        </td>
                      </tr>
                    ))
                  ) : (
                    Array.from({ length: 1 }).map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap  pl-4 text-sm font-medium text-gray-900 sm:pl-6">
                          <Skeleton.Input active size="small" style={{ width: 226 }} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-6 text-sm text-gray-500">
                          <Skeleton.Input active size="small" style={{ width: 250 }} />
                        </td>
                        <td className="whitespace-nowrap px-3  text-sm text-gray-500">
                          <Skeleton.Input active size="small" style={{ width: 400 }} />
                        </td>
                        <td className="whitespace-nowrap px-3  text-sm text-center">
                          <Skeleton.Input active size="small" style={{ width: 150 }} />
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

      <ModalEditAssignCouncil
        isOpen={isModalAssignOpen}
        toggleModal={toggleModalAssign}
        data={selectedData}
        actionType={actionType} // Truyền trạng thái
      />

    </>
  );
};

export default CouncilAssignmentCard;
