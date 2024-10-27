import React, { useEffect, useState, useContext } from 'react';
import ModalEditCouncil from '../modal/ModalEditCouncil';
import ModalAddCouncil from '../modal/ModalAddCouncil';
import ModalDelete from '../modal/ModalDelete';
import { ManagementContext } from '../../context/ManagementContext';
import { Skeleton } from 'antd';

const CouncilListCard = ({ props }) => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedData, setSelectedData] = useState('HD000');
  const { loadingCC, getCouncilsData } = useContext(ManagementContext);
  const [sortOrder, setSortOrder] = useState('desc'); // Thêm trạng thái sắp xếp

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Add Council
  const toggleModalAdd = () => {
    setIsModalAddOpen(!isModalAddOpen);
  };

  const handleAddClick = () => {
    toggleModalAdd();
  };

  // Edit Council
  const toggleModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleEditClick = (board) => {
    setSelectedData(board);
    toggleModalEdit();
  };

  // Delete Council
  const toggleModalDelete = () => {
    setIsModalDeleteOpen(!isModalDeleteOpen);
  };

  const handleDeleteClick = (board) => {
    setSelectedData(board);
    toggleModalDelete();
  };

  const handleDeleteCouncil = () => {
    console.log('hi');
  };
  const handleSort = async () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    await getCouncilsData(newSortOrder)
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
                      Mã hội đồng
                      <span className='text-xs'>{sortOrder === 'desc' ? ' ▲' : ' ▼'} {/* Dấu mũi tên */}</span>

                    </th>
                    <th 
                      scope="col" 
                      className="w-1/4 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Tên hội đồng
                    </th>
                    <th 
                      scope="col" 
                      className="w-1/2 px-3 py-3.5 text-left sm:text-xl text-sm font-semibold text-gray-900"
                    >
                      Mô tả
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
                      <tr key={board.hoidongid}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:text-base text-sm font-medium text-gray-900 sm:pl-6">
                          {board.hoidongid}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-black">{board.tenhoidong}</td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-black">{board.mota}</td>
                        <td className="whitespace-nowrap px-3 py-4 sm:text-base text-sm text-center">
                          <button
                            className="bg-gray-700 text-white px-4 py-2 rounded min-w-[100px] mr-2"
                            onClick={() => handleEditClick(board)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded min-w-[100px]"
                            onClick={() => handleDeleteClick(board)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    Array.from({ length: 6 }).map((_, index) => (
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
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {/* Modal */}
      <ModalAddCouncil isOpen={isModalAddOpen} toggleModal={toggleModalAdd} data={selectedData} />
      <ModalEditCouncil isOpen={isModalEditOpen} toggleModal={toggleModalEdit} data={selectedData} />
      <ModalDelete isOpen={isModalDeleteOpen} toggleModal={toggleModalDelete} data={selectedData} onDelete={handleDeleteCouncil} />
    </>
  );
};

export default CouncilListCard;
