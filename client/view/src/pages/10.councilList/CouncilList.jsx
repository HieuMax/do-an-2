import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { Loading } from '../../utils/Loading';
import { ListCard } from '../../components/card/ListCard'
import Pagination from '../../utils/Pagination';
import { getAllCouncils } from '../../controller/5.councils/councils';
import { ToastContainer, toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';
import ModalAddCouncil from '../../components/modal/ModalAddCouncil';
import { useDebounce } from '../../utils/useDebounce';

import 'react-toastify/dist/ReactToastify.css';

const CouncilList = () => {

    const [data, setData] = useState([])
    const {councils} = useContext(ManagementContext)

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const [filteredCouncils, setFilteredCouncils] = useState([]);
    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        setData(councils)
    }, [councils])


    const Log = {
        data: filteredCouncils,
        parent: "CouncilListCard"
    }


      // ------------------ Input Search Teacher ------------------

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };



    useEffect(() => {
        let filteredByDepartment = councils;

        const searchResult = filteredByDepartment.filter(council =>
        council.hoidongid.toLowerCase().includes(debouncedSearchValue.toLowerCase()) || 
        council.tenhoidong.toLowerCase().includes(debouncedSearchValue.toLowerCase())
        );
        setFilteredCouncils(searchResult);
    }, [councils, debouncedSearchValue]);

    const toggleModalAdd = () => {
        setIsModalAddOpen(!isModalAddOpen);
    };

    const handleAddClick = () => {
        toggleModalAdd();
    };




  return (
    <div className="h-full ">
        {/* <ToastContainer /> */}
        <div className="h-full max-w-full mt-3 py-3 px-6  flex p-[-12px] flex-col">
            <h1 className="sm:text-2xl text-xl font-bold underline">Danh sách hội đồng</h1>
            <div className="statusButton py-3">
                <div className="" >

                   <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-5">
                        <button 
                        onClick={handleAddClick} 
                        className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
                        // disabled={loadingCC}
                        >
                        Thêm hội đồng
                        </button>
                    </div>
                    
                    <div className="flex sm:flex-row flex-col items-start sm:items-center">
                        <label className="block font-bold mr-4">Tìm kiếm hội đồng:</label>
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-blue-950 transition-colors duration-200">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleInputChange}
                                placeholder="Nhập mã hoặc tên hội đồng..."
                                className="p-2 flex-1 outline-none w-56 text-sm"
                            />
                            <div className="p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                        </div>
                    </div>


                    <div className="h-full max-w-full p-[-3px]">
                        <ListCard props={Log}/>
                    </div>

                    <ModalAddCouncil isOpen={isModalAddOpen} toggleModal={toggleModalAdd} />
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default CouncilList
