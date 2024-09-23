import React from 'react'
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

export const ProgressBarVertical = ({props, status}) => {
  const progress = [
    {status: 0, name: "Đăng ký đề tài mới"},
    {status: 1, name: "Phê duyệt"},
    {status: 2, name: "Thuyết trình đề cương"},
    {status: 3, name: "Thực hiện"},
    {status: 4, name: "Báo cáo"},
    {status: 5, name: "Nghiệm thu"},
  ]
  return (
    <div className="progressBar mt-3 flex items-center transition-all ">
        <div className="flex items-center border-gray-300 min-w-56 break-words border-2 p-3 rounded-xl cursor-pointer group">
            {/* <div className="w-12 h-1 bg-system relative rounded-s-2xl rounded-e-none flex flex-col" /> */}
            <div className="flex items-center w-full justify-between">
                <div className={
                    `
                    justify-center flex-row text-black
                    font-normal flex items-center 2xl:gap-4 z-10
                    `
                }>
                    <div className={`
                        ${status >=6 && "bg-system"}
                        border-bg-system
                        flex justify-center items-center rounded-full w-8 h-8 text-center
                        border-2 mr-3
                        `}>{status<6 
                            ? status + 1
                            : <CheckIcon size={20} color='white'/>
                        }
                    </div>
                    <span className='
                        max-3xl:text-center'>
                        {progress.filter((item) => (item.status == status))[0]
                         ? progress.filter((item) => (item.status == status))[0].name
                         : "Hoàn thành"}
                    </span>
                </div>
                <div className="">
                    <ChevronRightIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </div>
            </div>
            <div className="flex flex-col z-10
                left-72
                absolute top-52 -mt-3 max-md:top-52 max-md:left-64 ml-3 max-sm:left-28 max-sm:top-56 rounded-lg px-2 py-3
                bg-white border-r-2 border-b-2 shadow-xl text-white text-sm w-max
                invisible opacity-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            ">
                {progress.map((item) => (
                    <div className="flex items-start flex-col" key={item.status}>
                        <div className={
                            `
                            justify-center flex-row 
                            ${status >= item.status
                                ? "text-black"
                                : "text-gray-400"
                            }
                            font-normal flex items-center 2xl:gap-4 z-10 group
                            `
                        }>
                            <div className={`
                                ${status > item.status && "bg-system border-bg-system"}
                                ${status == item.status && "border-bg-system"}
                                flex justify-center items-center rounded-full w-8 h-8 text-center
                                border-2 
                                `}>
                            {status > item.status 
                            ? <CheckIcon size={20} color='white'/>
                            : item.status+1
                            }
                            </div>
                            <span className='

                                2xl:-mt-3 3xl:mt-0 max-3xl:text-center max-xlp:line-clamp-2'>
                                {item.name}
                            </span>
                        </div>

                        {item.status < 5 && 
                        <div className={`
                            ${status > item.status
                                ? "bg-system"
                                : "bg-gray-300"
                            }
                            w-1 h-8 relative rounded-s-2xl ml-3
                            `} />}
                    </div>
                ))}

            </div>
        </div>

    </div>
  )
}
