import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { Loading } from '../../utils/Loading';
import { ListCard } from '../../components/card/ListCard'
import Pagination from '../../utils/Pagination';
import { getAllCouncils } from '../../controller/5.councils/councils';
import { ToastContainer, toast } from 'react-toastify';
import { ManagementContext } from '../../context/ManagementContext';

import 'react-toastify/dist/ReactToastify.css';

const TeacherList = () => {

    const [data, setData] = useState([])
    const {teachers} = useContext(ManagementContext)


    useEffect(() => {
  
        setData(teachers)

    }, [teachers])


    const Log = {
        data: data,
        parent: "TeacherListCard"
    }

  return (
    <div className="h-full ">
        {/* <ToastContainer /> */}
        <div className="h-full max-w-full mt-3 py-3 px-6  flex p-[-12px] flex-col">
            <h1 className="sm:text-2xl text-xl font-bold underline">Danh sách giảng viên</h1>
            <div className="statusButton py-3">
                <div className="" >

                   
                    <div className="h-full max-w-full p-[-3px]">
                        <ListCard props={Log}/>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default TeacherList