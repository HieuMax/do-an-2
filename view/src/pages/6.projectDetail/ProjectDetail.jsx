import React, { useEffect, useReducer, useState } from 'react'
import Dropdown from '../../components/dropdown/Dropdown'
import { ProgressBar } from '../../components/progress/ProgressBar';
import { ProgressBarVertical } from '../../components/progress/ProgressBarVertical';
import { ComboboxCom } from '../../components/combobox/Combobox';
import Dialog from '../../components/dialog/Dialogs';

const dataGV = [
    {idKhoa: 1, gv: [
        {id: "001", name: "Nguyen A"},
        {id: "002", name: "Tran B"},
        {id: "003", name: "Le Nguyen C"},
    ]},
    {idKhoa: 2, gv: [
        {id: "004", name: "Nguyen ATT"},
        {id: "005", name: "Tran BTT"},
        {id: "006", name: "Le Nguyen CTT"},
    ]},
    {idKhoa: 3, gv: [
        {id: "007", name: "XZZ"},
        {id: "008", name: "XXZZ"},
        {id: "009", name: "ASDXX"},
    ]},
  ]
const linhVuc = [
    {id: 0 ,name: "CNTT"},
    {id: 1 ,name: "KD"},
    {id: 2 ,name: "NCKH"},
    {id: 3 ,name: "ABC"},
    {id: 4 ,name: "Khác"},
  ]
const khoa = [
    {id: 1 ,name: "CNTT"},
    {id: 2 ,name: "KD"},
    {id: 3 ,name: "Cơ điện"},
    {id: 4 ,name: "Máy tính"}
  ]
const user = {id: "227480100000", name: "Hieu Max"}


export const ProjectDetail = ({props}) => {
    
  const [list, setList] = useState(0);
  const [member, setMember] = useState(false)
  const updateList = (item) => {
    if (item.id == list) return
    item.id != list ? setList(item.id) : ""
    let data = []
    dataGV.map(khoa => {
        (khoa.idKhoa === item.id) ? data = khoa.gv : ""
    })
    if (data.length < 1) data.push({id: -1, name: "Không có dữ liệu"})
    setGVHD(data)
  }

  const updateGVHD = (item) => {
    // setGVHD()
  }
  const updateMember = () => {

  }


  const [source, setSource] = useState(true);
  const [GVHD, setGVHD] = useState(dataGV[0].gv)

  const [status, setStatus] = useState(0)

  return (
    <div className="py-3 px-3 h-full ">

        <div className="h-full max-w-full  flex p-3 flex-col">
            <h1 className="text-2xl font-bold underline">Đăng ký đề tài</h1>
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
                            id="tenDeTai"
                            name="tenDeTai"
                            type="text"
                            required
                            // autoComplete=""
                            placeholder="Thiết kế hệ thống"
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
                        <div className="mt-2 w-3/4 max-xl:w-3/4">
                            <div className="w-full py-1.5">
                                <ComboboxCom props={linhVuc}/>
                            </div>
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
                            type="number"
                            step={1000}
                            required
                            autoComplete="cc-number"
                            placeholder="1,000,000"
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
                            type="number"
                            min={1}
                            max={24}
                            maxLength={2}
                            required
                            autoComplete="cc-number"
                            placeholder="6"
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
                            <div className="flex justify-between w-fit my-3 max-sm:flex-col">
                                <div className="flex w-fit cursor-pointer mr-12 max-sm:mb-3" onClick={() => setSource(true)} >
                                    <div className={`
                                        ${source
                                            ? "bg-system"
                                            : "border-gray-500 "
                                        }
                                        border-2 w-3 p-3 rounded-full mr-3`}/>
                                    Trong trường
                                </div>
                                <div className="flex w-fit cursor-pointer" onClick={() => setSource(false)}>
                                    <div className={`
                                        ${source
                                            ? "border-gray-500 "
                                            : "bg-system"
                                        }
                                        border-2 w-3 p-3 rounded-full mr-3`}/>
                                    Ngoài trường
                                </div>
                            </div>
                        </div>
                        <div className={`
                            ${source
                                ? ""
                                : "flex-col"
                            }
                            mt-2 w-full flex max-md:flex-col`}>
                            <div className="w-1/3 mr-6  max-xl:w-3/4 max-lg:w-full ">
                                <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                    Đơn vị - {
                                        source
                                          ? "Khoa"
                                          : "Trường giảng viên công tác"
                                    }
                                </label>
                                <div className={
                                    ` ${source
                                        ? ""
                                        : "hidden"
                                    }
                                    w-full py-1.5`
                                }>
                                    <Dropdown update={updateList} prop={khoa} parent={"Project Detail"}/>
                                </div>
                                <div className={`mt-2
                                    ${source
                                        ? "hidden"
                                        : "block"
                                    }
                                    `}>
                                    <input
                                    id="tenGVHD"
                                    name="tenGVHD"
                                    type="text"
                                    required
                                    placeholder="Trường công tác"
                                    className='my-3
                                        block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`
                                    '
                                    />
                                </div>
                            </div>
                            <div className="w-full ">
                                <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                    {source 
                                      ? "Giảng viên"
                                      : "Thông tin liên hệ"
                                    }
                                </label>
                                <div className={`
                                    ${source
                                        ? "w-1/3 max-xl:w-3/4"
                                        : "w-full"
                                    } py-1.5 `}>
                                    <div className={`
                                        ${source 
                                            ? "block"
                                            : "hidden"
                                        }
                                        `}>
                                        <Dropdown update={updateGVHD} prop={GVHD} parent={"Project Detail"} defaultOption={list}/>
                                    </div>
                                    <div className={`
                                        ${source
                                            ? "hidden"
                                            : "grid grid-flow-col gap-4 py-3 max-lg:flex max-lg:flex-col"
                                        }
                                        `}>
                                        <div className="">
                                            <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                                Họ tên người hướng dẫn
                                            </label>
                                            <input
                                                id="tenNgHD"
                                                name="tenNgHD"
                                                type="text"
                                                required
                                                placeholder="Họ tên người hướng dẫn"
                                                className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                            />
                                        </div>
                                        <div className="">
                                            <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="sdtNgHD"
                                                name="sdtNgHD"
                                                type="tel"
                                                required
                                                placeholder="Số điện thoại người hướng dẫn"
                                                className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                            />
                                        </div>
                                        <div className="">
                                            <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                                Email
                                            </label>
                                            <input
                                                id="emailNgHD"
                                                name="emailNgHD"
                                                type="email"
                                                required
                                                placeholder="Email người hướng dẫn"
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
                                        disabled
                                        value={user.id}
                                        className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                    />
                                </div>
                                <div className="mt-3 col-span-1">
                                    <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                        Họ tên sinh viên
                                    </label>
                                    <input
                                        disabled
                                        value={user.name}
                                        className='block px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mb-3 float-start" onClick={() => setMember(!member)}>
                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                            font-semibold text-white cursor-pointer w-fit m-auto">
                            Thêm thành viên
                        </div>
                    </div>
                    <Dialog props={member} returnData={updateMember}/>
                </div>
            </div>
            <hr />
            {/* File upload */}
            <div className="my-6">
                <div className="flex w-2/3 max-xl:w-full">
                    <div className=" w-4/5 max-w-7xl max-sm:w-full">
                        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                            Tài liệu đề xuất (.doc | .docx | .pdf)
                        </label>
                        <div className="px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                        flex items-center justify-between">
                            <input 
                            type="file" 
                            className="file:hidden"
 
                            name='file'
                            id="inputGroupFile02"/> 
                            <label className="input-group-text" htmlFor='inputGroupFile02'>
                                <div className="">
                                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                        font-semibold text-white cursor-pointer w-fit m-auto">
                                        Upload
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
