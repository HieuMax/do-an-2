import React, { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Loading } from '../../utils/Loading'
import { useNavigate } from 'react-router-dom';

export const InforProjectCard = ({props}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
      setData(props);
  }, [props]);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/project-list/${id}`, { state: { detaiId: id } })
  }
  return (
    <div className='w-full lg:text-lg'>
        {
          data
          ? data.map((item) => (
            <div className="flex max-md:h-full h-48 mt-3 shadow-md border-r border-b box-border
            hover:bg-gray-100 p-3 rounded-3xl flex-col max-lg:h-full
              " 
              key={item.detaiid}>
                <div className="grid grid-cols-5 gap-8 sm:items-center w-full h-full justify-between px-3
                   max-lg:grid-cols-3 max-sm:flex max-sm:flex-col
                ">
                    <div className="lg:px-2 font-semibold flex flex-col lg:text-base">
                      <span className='lg:hidden'>Mã đề tài</span>
                      {item.detaiid}
                    </div>
                    <div className="line-clamp-2 font-semibold col-span-2 max-lg:items-center flex flex-col max-lg:hidden">
                      <span className='lg:hidden'>Tên đề tài</span>
                      <span className='max-lg:line-clamp-1'>{item.tendetai}</span>
                    </div>
                    {/* <div className="flex justify-between col-span-2"> */}
                      <div className="line-clamp-1 xlp:text-center flex flex-col max-lg:col-span-1 lg:text-base max-sm:hidden">
                        <span className='lg:hidden font-semibold'>GVHD</span>
                        {item.hotengiangvien}
                      </div>
                      <div className={` lg:text-base max-sm:hidden
                          ${item.trangthai == 0 
                              ? "bg-gray-200 border-gray-500" 
                              : item.trangthai == 1
                                ? "border-orange-500 bg-orange-200"
                                : item.trangthai == 2
                                  ? "bg-gray-200 border-gray-500" 
                                  : item.trangthai == 3
                                    ? "bg-green-200 border-green-500"
                                    : "bg-red-200 border-red-500"
                          }  
                          max-lg:col-span-1
                          flex justify-center text-center border-2 py-2 rounded-md text-base`}>
                          {
                          item.trangthai == 0
                            ? "GVHD chưa duyệt" 
                            : item.trangthai == 1
                              ? "GVHD đã duyệt"
                              : item.trangthai == 2
                                ? "Chưa chấm điểm"
                                : item.trangthai == 3
                                  ? "Đạt"
                                  : "Không đạt"
                          }
                          
                          {
                          item.trangthai == 0
                            ? "" 
                            : item.trangthai == 1
                              ?  (<div className="max-lg:hidden -mr-3 ml-3">
                                  <BadgeCheck size={20} color="rgb(249 115 22)"/>
                                </div>)
                              : item.trangthai == 2
                                ? ""
                                : item.trangthai == 3
                                  ? ""
                                  : ""
                          }
                          
                      </div>
                    {/* </div> */}
                    <div className="flex justify-between col-span-2 sm:hidden max-525:flex-col gap-4">
                      <div className="line-clamp-1 xlp:text-center flex flex-col max-lg:col-span-1 lg:text-base">
                        <span className='lg:hidden font-semibold'>GVHD</span>
                        {item.hotengiangvien}
                      </div>
                      <div className={` lg:text-base
                          ${item.trangthai == 0 
                              ? "bg-gray-200 border-gray-500" 
                              : item.trangthai == 1
                                ? "border-orange-500 bg-orange-200"
                                : item.trangthai == 2
                                  ? "bg-gray-200 border-gray-500" 
                                  : item.trangthai == 3
                                    ? "bg-green-200 border-green-500"
                                    : "bg-red-200 border-red-500"
                          }  
                          max-lg:col-span-1 max-sm:px-2
                          flex justify-center text-center border-2 py-2 rounded-md text-base`}>
                          {
                          item.trangthai == 0
                            ? "GVHD chưa duyệt" 
                            : item.trangthai == 1
                              ? "GVHD đã duyệt"
                              : item.trangthai == 2
                                ? "Chưa chấm điểm"
                                : item.trangthai == 3
                                  ? "Đạt"
                                  : "Không đạt"
                          }
                          
                          {
                          item.trangthai == 0
                            ? "" 
                            : item.trangthai == 1
                              ?  (<div className="max-lg:hidden -mr-3 ml-3">
                                  <BadgeCheck size={20} color="rgb(249 115 22)"/>
                                </div>)
                              : item.trangthai == 2
                                ? ""
                                : item.trangthai == 3
                                  ? ""
                                  : ""
                          }
                          
                      </div>
                    </div>

                    <div className="line-clamp-2 font-semibold col-span-3 flex flex-col lg:hidden">
                      <span className='lg:hidden'>Tên đề tài</span>
                      <span className='max-lg:line-clamp-1'>{item.tendetai}</span>
                    </div>
              </div>
                    <div className="flex justify-end items-end mr-3 max-lg:mt-6 max-lg:mr-0" onClick={() => handleClick(item.detaiid)}>
                        <div className="bg-system h-max text-center p-3 rounded-xl shadow-xl text-base 
                        font-semibold text-white cursor-pointer w-max bg-btn-system max-sm:w-full">
                        Xem chi tiết
                        </div>
                    </div>
          </div>
        ))
        : <Loading />
        }
        
    </div>
  )
}
