import React from 'react'
import { CheckIcon } from 'lucide-react';

export const ProgressBar = ({props, status}) => {
    const progress = [
        {status: 0, name: "Đăng ký đề tài mới"},
        {status: 1, name: "Phê duyệt"},
        {status: 2, name: "Thuyết trình đề cương"},
        {status: 3, name: "Thực hiện"},
        {status: 4, name: "Báo cáo"},
        {status: 5, name: "Nghiệm thu"},
      ]
    // const data = props
    
  return (
    <div className="progressBar mt-3 flex items-center transition-all ">
        <div className="w-12 h-1 bg-system relative rounded-s-2xl rounded-e-none" />
        {progress.map((item) => (
            <div className="flex items-center " key={item.status}>
                <div className={
                    `
                    justify-center flex-col 3xl:flex-row 
                    ${status >= item.status
                        ? "text-black"
                        : "text-gray-400"
                    }
                    font-normal flex items-center 2xl:gap-4 z-10 group max-lg:cursor-pointer
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
                        max-lg:hidden
                        2xl:-mt-3 3xl:mt-0 max-3xl:text-center max-xlp:line-clamp-2'>
                        {item.name}
                    </span>
                    <span className='
                        lg:hidden block bg-red-300
                        absolute mt-10'>
                        {/* {item.name} */}
                        <div
                            className={`
                                absolute left-full rounded-md px-2 py-1 -ml-6
                                bg-system text-white text-sm w-max
                                invisible opacity-20 -translate-y-3 transition-all
                                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                                `}
                        >{item.name}</div>
                    </span>
                </div>

                {item.status < 5 && 
                <div className={`
                    ${status > item.status
                        ? "bg-system"
                        : "bg-gray-300"
                    }
                    max-xlp:w-16 max-lg:w-16
                    w-32 h-1 relative rounded-s-2xl ml-3
                    `} />}
            </div>
        ))}
    </div>
  )
}
