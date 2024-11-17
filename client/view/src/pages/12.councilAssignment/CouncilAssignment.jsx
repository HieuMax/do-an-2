import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { Loading } from '../../utils/Loading';
import { ListCard } from '../../components/card/ListCard'
import Pagination from '../../utils/Pagination';
import { getAllCouncils } from '../../controller/5.councils/councils';
import { ToastContainer, toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';
import Dropdown from '../../components/dropdown/Dropdown';
import { useDebounce } from '../../utils/useDebounce';

import 'react-toastify/dist/ReactToastify.css';

const CouncilAssignment = () => {

    const [data, setData] = useState([])
    const {projects, departmentsContext} = useContext(ManagementContext)
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 

    const debouncedSearchValue = useDebounce(searchValue, 500);


    
    useEffect(() => {
        setData(projects)

    }, [projects])


    const Log = {
        data: filteredProjects,
        parent: "CouncilAssignmentCard"
    }   

    const status = [
        {id: 0, name: "Chọn đề tài "},
        {id: 1, name: "Chưa phân công "},
        {id: 2, name: "Đã phân công "},
        {id: 3, name: "Đã thanh lý "},

    ]

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };
    const handleStatusChange = (selectedDept) => {
        setSelectedStatus(selectedDept)
        setCurrentPage(1); 

    };


    useEffect(() => {
        let filteredByProject = projects.filter(project => project.trangthai < 7);

        if (selectedStatus && selectedStatus.id == "1") {
            filteredByProject = projects.filter(project => project.hoidongphancong === null && project.trangthai !== 7);
        }
        if (selectedStatus && selectedStatus.id == "2") {
            filteredByProject = projects.filter(project => project.hoidongphancong !== null && project.trangthai !== 7);
        }
        if (selectedStatus && selectedStatus.id == "3") {
            filteredByProject = projects.filter(project => project.trangthai === 7);
        }
        const searchResult = filteredByProject.filter(project =>
          project.detaiid.toLowerCase().includes(debouncedSearchValue.toLowerCase()) || 
          project.tendetai.toLowerCase().includes(debouncedSearchValue.toLowerCase())
        );

        setFilteredProjects(searchResult);

    }, [projects, selectedStatus, debouncedSearchValue]);


  return (
    <div className="h-full ">
        {/* <ToastContainer /> */}
        <div className="h-full max-w-full mt-3 py-3 px-6  flex p-[-12px] flex-col">
            <h1 className="sm:text-2xl text-xl font-bold underline">Phân công hội đồng</h1>
            <div className="statusButton py-3">
                <div className="" >

                    <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">
                        <p 
                        className=" mt-1 text-2xl font-semibold text-black  sm:w-fit w-3/4 py-2 rounded"
                        >
                        Danh sách đề tài
                        </p>
                       
                    </div>



                    <div className="flex sm:flex-row flex-col items-start sm:items-center mb-5">
                        <label className="block font-bold mr-4">Tìm kiếm đề tài:</label>
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-blue-950 transition-colors duration-200">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleInputChange}
                                placeholder="Nhập mã hoặc tên đề tài..."
                                className="p-2 flex-1 outline-none w-56 text-sm"
                            />
                            <div className="p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="w-fit">
                        {status.length > 0 && <Dropdown prop={status} update={handleStatusChange} />}
                    </div>

                    <div className="h-full max-w-full p-[-3px]">
                        <ListCard props={Log} currentPage={currentPage} setCurrentPage={setCurrentPage} newsPerPage={6}/>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default CouncilAssignment
