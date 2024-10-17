import React, { useEffect, useState, useContext } from 'react';

import ModalAssignCouncil from '../modal/ModalAssignCouncil';

import { toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';

const CouncilAssignmentCard = ({ props }) => {
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);

  const [selectedData, setSelectedData] = useState('HD000');
  const { loadingCA } = useContext(ManagementContext);



  // Edit Council
  const toggleModalAssign = () => {
    setIsModalAssignOpen(!isModalAssignOpen);
  };

  const handleAssignClick = (board) => {
    setSelectedData(board);
    toggleModalAssign();
  };



  return (
    <>

      <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">
        <p 
          className=" mt-2 text-2xl font-semibold text-black  sm:w-fit w-3/4 py-2 rounded"
        >
          Danh sách đề tài
        </p>
        <div className="flex sm:flex-row flex-col items-start sm:items-center">
          <label className="block font-bold mr-4">Tìm kiếm đề tài:</label>
          <input
            type="text"
            placeholder="Nhập ID hoặc tên hội đồng..."
            className="border border-gray-300 p-2 rounded flex-1 min-w-32"
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
                      className="w-1/6 px-3 py-3.5 pl-4 pr-3 text-left sm:text-xl text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Mã đề tài
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
                  {!loadingCA ? (
                    props.map((board) => (
                      <tr key={board.detaiid}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:text-base text-sm font-medium text-gray-900 sm:pl-6">
                          {board.detaiid}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-black">{board.tendetai}</td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm">
                        {board.hoidongphancong ? (
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
                        )}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                            <button
                              className="bg-gray-400 text-white px-4 py-2 rounded min-w-[120px] mr-2"
                              onClick={() => handleAssignClick(board)}
                            >
                              Xem đề tài
                            </button>
                            {board.hoidongphancong ? (
                                <button
                                 className="bg-gray-600 text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                 onClick={() => handleAssignClick(board)}
                               >
                                 Xem chi tiết
                               </button>
                            ) : (
                                <button
                                 className="bg-system text-white px-4 py-2 rounded min-w-[120px] mr-2"
                                 onClick={() => handleAssignClick(board)}
                               >
                                 Phân công
                               </button>
                            )}
                         

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

export default CouncilAssignmentCard;
