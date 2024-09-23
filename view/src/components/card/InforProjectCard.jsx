import React from 'react'
import { BadgeCheck } from 'lucide-react'

export const InforProjectCard = ({props}) => {
  const data = props
  return (
    <div className='w-full lg:text-lg'>
        {data.map((item) => (
            <div className="flex max-md:h-full h-48 mt-3 shadow-md border-r border-b box-border
            hover:bg-gray-100 p-3 rounded-3xl 
              " 
              key={item.id}>
                <div className="grid grid-cols-5 gap-4 items-center w-full justify-between px-3">
                    <div className="col-end-1 px-2 font-bold">{item.id}</div>
                    <div className="line-clamp-1 font-semibold
                     col-span-2 
                    ">{item.name}</div>
                    <div className="line-clamp-1 text-center">{item.mentor}</div>
                    <div className={`
                        ${item.status == 0 
                            ? "bg-gray-200 border-gray-500" 
                            : item.status == 1
                              ? "border-orange-500 bg-orange-200"
                              : item.status == 2
                                ? "bg-gray-200 border-gray-500" 
                                : item.status == 3
                                  ? "bg-green-200 border-green-500"
                                  : "bg-red-200 border-red-500"
                        } 
                        flex justify-center text-center border-2 p-2 rounded-md`}>
                        {
                        item.status == 0
                          ? "GVHD chưa duyệt" 
                          : item.status == 1
                            ? "GVHD đã duyệt"
                            : item.status == 2
                              ? "Chưa chấm điểm"
                              : item.status == 3
                                ? "Đạt"
                                : "Không đạt"
                        }
                        <div className="px-2">
                        {
                        item.status == 0
                          ? "" 
                          : item.status == 1
                            ? <BadgeCheck size={20} color="rgb(249 115 22)"/>
                            : item.status == 2
                              ? ""
                              : item.status == 3
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
        ))}
    </div>
  )
}
