import React, { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Loading } from '../../utils/Loading'

export const InforProjectCard = ({props}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
      setData(props);
  }, [props]);
  
  return (
    <div className='w-full lg:text-lg'>
        {
          data
          ? data.map((item) => (
            <div className="flex max-md:h-full h-48 mt-3 shadow-md border-r border-b box-border
            hover:bg-gray-100 p-3 rounded-3xl 
              " 
              key={item.detaiid}>
                <div className="grid grid-cols-5 gap-4 items-center w-full justify-between px-3">
                    <div className="col-end-1 px-2 font-bold">{item.detaiid}</div>
                    <div className="line-clamp-1 font-semibold
                     col-span-2 ml-6
                    ">{item.tendetai}</div>
                    <div className="line-clamp-1 text-center">{item.hotengiangvien}</div>
                    <div className={`
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
                        flex justify-center text-center border-2 p-2 rounded-md`}>
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
                        <div className="px-2">
                        {
                        item.trangthai == 0
                          ? "" 
                          : item.trangthai == 1
                            ? <BadgeCheck size={20} color="rgb(249 115 22)"/>
                            : item.trangthai == 2
                              ? ""
                              : item.trangthai == 3
                                ? ""
                                : ""
                        }
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-system h-max text-center p-3 rounded-xl shadow-xl text-lg 
                        font-semibold text-white cursor-pointer w-max bg-btn-system">
                        Xem chi tiết
                        </div>
                    </div>
                </div>
          </div>
        ))
        : <Loading />
        }
        
    </div>
  )
}
