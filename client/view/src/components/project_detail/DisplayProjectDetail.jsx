import { BadgeCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ProgressBar } from '../progress/ProgressBar'
import { ProgressBarVertical } from '../progress/ProgressBarVertical'
import { ConvertToMoney } from '../../utils/ConvertToMoney'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProjectById } from '../../controller/1.projects/project'
import { Loading } from '../../utils/Loading'

export const DisplayProjectDetail = ({ action }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState() // statusCss of project 
  const [statusCss, setStatusCss] = useState()
  const [project, setProject] = useState({})
  const location = useLocation();
  const { detaiId } = location.state 
    ? location.state
    : {detaiId: location.pathname.substring(location.pathname.lastIndexOf('/')+1)}; 
    
  const setTrangThai = (trangThai) => {
    switch(trangThai) {
        case 0: 
            return trangThai + 1
        case 1:
            return trangThai
        case 2: 
            return trangThai
        case 3: 
            return 3
        case 4:
            return 2
        default:
            return
    }
  }
  useEffect(() => {
    const fetchData = async () => {
        try {
            const projectRes = await getProjectById(detaiId);
            setTimeout(() => {
                setProject(projectRes)
                action()
            }, 500)
            setStatus(setTrangThai(projectRes.trangthai))
            setStatusCss(projectRes.trangthai)
        } catch (error) {
            throw new Error(error)
        }        
      }
      fetchData();
  }, [])

//   useEffect(() => {
//     console.log(project && project)
//   }, [project])

  return (
    <div className="h-full max-w-full  flex p-3 flex-col">
        {project && project.detaiid
          ?
          <>
          <h1 className="text-2xl font-bold underline">Thông tin đề tài</h1>
        <div className="md:flex md:justify-between items-center my-3 ">
            <div className="inline-flex justify-center rounded-md min-w-16 max-w-fit bg-gray-600 px-3 py-2 cursor-pointer
            text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500
            sm:w-auto" 
                onClick={() => navigate(-1)}
            >
                Trở về
            </div>
            {/* not responsive - not match statusCss */}
            <div className="">
                <div className={` lg:text-base max-sm:hidden w-full px-3 min-w-24
                    ${statusCss == 0 
                        ? "bg-gray-200 border-gray-500" 
                        : statusCss == 1
                        ? "border-orange-500 bg-orange-200"
                        : statusCss == 2
                            ? "border-blue-500 bg-blue-200"
                            : statusCss == 3
                            ? "bg-gray-200 border-gray-500" 
                            : statusCss == 4 
                                ? "bg-green-200 border-green-500"
                                : "bg-red-200 border-red-500"
                    }  
                    max-lg:col-span-1
                    flex justify-center text-center border-2 py-2 rounded-md text-base`}>
                    {
                    statusCss == 0
                    ? "GVHD Chưa duyệt" 
                    : statusCss == 1
                        ? "GVHD đã duyệt"
                        : statusCss == 2
                        ? "Đề tài được duyệt"
                        : statusCss == 3
                            ? "Chưa chấm điểm"
                            : statusCss == 3 
                                ? "Đạt"
                                : "Không đạt"
                    }
                    
                    {
                    statusCss == 0
                    ? "" 
                    : statusCss == 1
                        ?  (<div className="max-lg:hidden -mr-3 ml-3">
                            <BadgeCheck size={20} color="rgb(249 115 22)"/>
                        </div>)
                        : statusCss == 2
                        ? ""
                        : statusCss == 3
                            ? ""
                            : ""
                    }
                    
                </div>
            </div> 
        </div>

        {/* Progress bar */}
        <div className="max-xix:hidden">
            <ProgressBar status={status}/>
        </div>
        <div className="xix:hidden">
            <ProgressBarVertical status={status} />
        </div>
        {/* Project Information */}
        <div className="statusButton py-3 ">
            <div className="bg-blue-00">
                <div>
                    <label htmlFor="tenDeTai" className="block text-lg font-medium leading-6 text-gray-900">
                        Tên đề tài
                    </label>
                    <div className="mt-2">
                        <input
                        defaultValue={project && project.tendetai}
                        disabled
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>

            <div className="flex w-full py-3 max-xl:flex-wrap max-md:flex-col">
                <div className='w-1/2 max-md:w-full'>
                    <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                        Lĩnh vực
                    </label>
                    <div className="mt-2 w-2/3 py-1.5">
                        <input
                        id="linhVuc"
                        name="linhVuc"
                        disabled
                        defaultValue={project && project.linhvuc}
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className='w-1/2 flex flex-col max-md:w-full'>
                    <label htmlFor="kinhPhi" className="block text-lg font-medium leading-6 text-gray-900">
                        Kinh phí (đ)
                    </label>
                    <div className="mt-2 w-2/3 py-1.5">
                        <input
                        id="kinhPhi"
                        name="kinhPhi"
                        disabled
                        defaultValue={project && project.kinhphi
                            ? ConvertToMoney(project && project.kinhphi)
                            : ""
                        }
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className='w-1/2 flex flex-col max-md:w-full'>
                    <label htmlFor="thoiGianThucHien" className="block text-lg font-medium leading-6 text-gray-900">
                            Thời gian thực hiện (Tháng)
                    </label>
                    <div className="mt-2 w-2/3 py-1.5">
                        <input
                        id="thoiGianThucHien"
                        name="thoiGianThucHien"
                        disabled
                        defaultValue={project && project.thoigianthuchien}
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

            </div>
            <hr />
            <div className="my-6 py-3">
                <div className='w-full flex flex-col '>
                    <div className="flex flex-col ">
                        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                            Giảng viên hướng dẫn
                        </label>
                    </div>
                    <div className={`
                        mt-2 w-full flex max-md:flex-col`}>

                        <div className="w-full ">
                            <div className={`w-12/12 max-xl:w-full py-1.5 `}>
                                <div className={`grid grid-flow-col gap-4 py-3 max-lg:flex max-lg:flex-col`}>
                                    <div className="w-2/3 max-xl:w-full">
                                        <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                            Họ tên người hướng dẫn
                                        </label>
                                        <input
                                            id="tenNgHD"
                                            name="tenNgHD"
                                            type="text"
                                            
                                            defaultValue={project && project.hotenGV}
                                            disabled
                                            placeholder="Họ tên người hướng dẫn"
                                            className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                        />
                                    </div>
                                    <div className="w-2/3 max-xl:w-full">
                                        <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                            Số điện thoại
                                        </label>
                                        <input
                                            id="sdtNgHD"
                                            name="sdtNgHD"
                                            type="tel"
                                            disabled
                                            defaultValue={project && project.sdtGV}

                                            className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                        />
                                    </div>
                                    <div className="w-2/3 max-xl:w-full">
                                        <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email
                                        </label>
                                        <input
                                            id="emailNgHD"
                                            name="emailNgHD"
                                            type="email"
                                            
                                            disabled
                                            defaultValue={project && project.emailGV}
                                            className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />                         
            
            <div className="my-6">
                <div className="flex w-2/3 max-xl:w-full">
                    <div className=" w-4/5 max-w-7xl max-sm:w-full">
                        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                            Sinh viên chủ nhiệm đề tài
                        </label>
                        <div className="grid grid-flow-col gap-4 max-md:flex-col max-md:flex">
                            <div className="mt-3 col-span-1">
                                <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                    Mã số sinh viên
                                </label>
                                <input
                                    id='sinhVienChuNhiem'
                                    disabled
                                    value={project && project.sinhvienid}
                                    className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                />
                            </div>
                            <div className="mt-3 col-span-1">
                                <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                    Họ tên sinh viên
                                </label>
                                <input
                                    disabled
                                    value={project && project.hoten}
                                    className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={`
                    ${project.data && project.data.length>0 
                        ? "block"
                        : "hidden"
                    }
                    mt-6 text-lg font-medium leading-6 text-gray-900
                    `}>
                    <hr className='my-3'/>
                    Sinh viên tham gia thực hiện đề tài
                </div>
                { project.data &&
                    project.data.map((item) => (
                    <div className="flex w-2/3 max-xl:w-full" key={item.sinhvienid}>
                        <div className=" w-4/5 max-w-7xl max-sm:w-full">
                            <div className="grid grid-flow-col gap-4 max-md:flex-col max-md:flex">
                                <div className="mt-3 col-span-1">
                                    <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                        Mã số sinh viên
                                    </label>
                                    <input
                                        disabled
                                        value={item.sinhvienid}
                                        className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                    />
                                </div>
                                <div className="mt-3 col-span-1">
                                    <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                        Họ tên sinh viên
                                    </label>
                                    <input
                                        disabled
                                        value={item.hoten}
                                        className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                }

            </div>
        </div>
        <hr />
          </>
          : <div className="h-screen flex justify-center items-center"><Loading /></div>
        }
        
    </div>
  )
}
