import React, { useEffect, useReducer, useState } from 'react'
import DropdownData from '../../components/dropdown/DropdownData'
import { ProgressBar } from '../../components/progress/ProgressBar';
import { ProgressBarVertical } from '../../components/progress/ProgressBarVertical';
import { ComboboxCom } from '../../components/combobox/Combobox';
import Dialog from '../../components/dialog/Dialogs';
import { getAllDepartments, getDepartmentsById } from '../../controller/3.departments/departments';
import DepartmentContext, { DeparmentReducer, DepartmentInitialState, FileContext } from '../../provider/detailProvider';
import { FileUpload } from '../../components/dialog/FileUpload';
import { message } from 'antd';
import { registNewProject, uploadFile } from '../../controller/1.projects/project';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { Loading } from '../../utils/Loading';
import { useNavigate } from 'react-router-dom';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';

const staticLinhVuc = [
    {id: 0 ,name: "CNTT"},
    {id: 1 ,name: "KD"},
    {id: 2 ,name: "NCKH"},
    {id: 3 ,name: "ABC"},
    {id: 4 ,name: "Khác"},
  ]

const user = {id: "SV001", name: "Hieu Max"}

export const ProjectDetail = ({props}) => {
  const navigate = useNavigate();

  const [khoa, setKhoa] = useState();
  const [giangVien, setGiangVien] = useState();
  const [depended, setDepended] = useState(false)
  const [member, setMember] = useState(false)
  const [memList, setMemList] = useState([])
  const [ linhVuc, setLinhVuc ] = useState(staticLinhVuc)
  const [ GVHD, setGVHD ] = useState()
  const [ isRegist, setIsRegist ] = useState(false);
  const [ finishRegist, setFinishRegist ] = useState(false)

  const [state, dispatch] = useReducer(
    DeparmentReducer,
    DepartmentInitialState
  )
  FileContext
  useEffect(() => {
    const fetchData = async () => {
        const khoa = await getAllDepartments()
        const idDe = Object.values(khoa[0])[0]
        const mentors = await getDepartmentsById(idDe)
        setKhoa(khoa)
        setGiangVien(mentors.staffs)
        dispatch({
            type: "LOADED_DEPARTMENTS",
            payload: khoa
        })
    }
    fetchData();
  }, [])

  const updateList = async (item) => {
    const idDe = Object.values(item)[0]
    const khoa = await getDepartmentsById(idDe)
    setDepended(!depended)
    if(khoa.staffs.length < 1) setGiangVien(-1)
    else setGiangVien(khoa.staffs)
    updateGVHD()
  }

  const updateGVHD = (item) => { setGVHD(item) }

  const handleList = (item) => { setMemList(item) }

  const [source, setSource] = useState(true);

  const removeMember = (id) => {
    const updatedList = memList.filter(item => item.sinhvienid !== id);
    setMemList(updatedList)
  }
  
  const [ isOpenUpload, setIsOpenUpload ] = useState(false)
  
  const toggleUpload = () => {
    setIsOpenUpload(!isOpenUpload)
  }

  const [ fileArray, setFileArray ] = useState([])
  const [ displayFile, setDisplayFile ] = useState([])

  const uploadForm = {
    open: isOpenUpload,
    isOpen: () => toggleUpload(),
    fileArray: fileArray,
    isConfirmToDisplay: () => isConfirmToDisplay(),
    displayFile: displayFile
  }

  const openUploadForm = () => {
    setIsOpenUpload(true)
  }

  const isConfirmToDisplay = () => {
    setDisplayFile(fileArray)
  }

  const handleFile = (arr) => {
    setFileArray(arr)
  }

  const handleLinhVuc = (item) => setLinhVuc(item)

  const registProject = async () => {
    let flag = false;
    if (!source) {
        message.error("Tính năng giảng viên ngoài trường đang được cập nhật - Thử lại sau!")
        return
    }
    const data = {
        tenDeTai: document.getElementById('tenDeTai').value,
        linhVuc: linhVuc.name,
        kinhPhi: document.getElementById('kinhPhi').value,
        thoiGianThucHien: document.getElementById('thoiGianThucHien').value,
        giangVienChuNhiemID: GVHD ? GVHD.giangvienid : "",
        thanhVienThucHien: memList ? memList : 0,
        sinhvienid: user.id,
    }
    // console.log(data)
    // return
    const parseName = (key) => {
        switch(key) {
            case "tenDeTai":
                return "Tên đề tài"
            case "linhVuc":
                return "Lĩnh vực"
            case "kinhPhi":
                return "Kinh phí"
            case "thoiGianThucHien":
                return "Thời gian thực hiện"
            case "giangVienHD":
                return "Giảng viên hướng dẫn"
            case "tailieudexuat":
                return "Chưa tải lên tài liệu đề xuất"
            
        }
    }
    Object.keys(data).forEach(item =>{
        if((data[item] == null || data[item] == "") && item != "thanhVienThucHien") {
            message.error(`Chưa điền thông tin cho ${parseName(item)}`)
            return
        }
        if(item == "kinhPhi") {
            const kinhphi = Number.parseFloat(data[item])
            if (kinhphi < 0 || kinhphi > 100000000) {
                message.error("Kinh phí không hợp lệ") 
                flag = true;
                return
            }
        } else if (item == "thoiGianThucHien") {
            const thoiGian = Number.parseInt(data[item])
            if (thoiGian < 1 || thoiGian > 24) {
                message.error("Thời gian thực hiện không hợp lệ") 
                flag = true;
                return
            }
        }
    })

    if(flag) return

    if(fileArray.length < 1) {
        message.error("Tài liệu đề xuất chưa được chọn")
        return
    }

    const handleUploadFile = async () => {
        const formData = new FormData();
        fileArray.forEach(file => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await uploadFile(formData);
            // console.log(response)
            // data = { ...data, TaiLieuDeXuat: response.filename }
            data.TaiLieuDeXuat = response.filename
            data.originalfilename = response.originalname.originalname
        } catch (error) {
            
        }
    }
    await handleUploadFile();
    try {
        // console.log(data)
        const response = await registNewProject(data)
        if(response.error) {
            return response.error
        }
        if(response.status === 201) {
            NotificationBottomRight("Đăng ký đề tài thành công")
            setFinishRegist(true)
            setTimeout(() => {
                navigate(`/project-list`)
            }, 700)
            clearTimeout()

        } else {
            message.error("Đăng ký thất bại - Thử lại sau")
        }
    } catch (error) {
        throw new Error(error);
    }
  }


  useEffect(() => {
    if(!isRegist) return
    document.body.style.overflowY = "hidden"
  }, [isRegist])

  const cancelRegist = () => {
    setTimeout(() => {
        document.body.style.overflowY = "scroll"
    }, 180)
    setIsRegist(false)
  }
  if(finishRegist) return(
    <Loading />
  )
  return (
    <div className={`${finishRegist ? "hidden" : ""} py-3 px-3 h-full `}>

        <div className="h-full max-w-full  flex p-3 flex-col">
            <h1 className="text-2xl font-bold underline">Đăng ký đề tài</h1>
            
            {/* Progress bar */}
            <div className="max-xix:hidden">
                <ProgressBar status={0}/>
            </div>
            <div className="xix:hidden">
                <ProgressBarVertical status={0} />
            </div>
            {/* Project Information */}
            
            <div className="statusButton py-3 ">
                <div className="bg-blue-00">
                    <div>
                        <label htmlFor="tenDeTai" className="block text-lg font-medium leading-6 text-gray-900">
                            Tên đề tài
                        </label>
                        <div className="mt-2">
                            <input id="tenDeTai" name="tenDeTai" type="text" required placeholder="Thiết kế hệ thống" className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
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
                                <ComboboxCom props={staticLinhVuc} handleLinhVuc={handleLinhVuc}/>
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
                        <DepartmentContext.Provider value = {{ state, dispatch}}>
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
                                            <DropdownData update={updateList} prop={khoa} parent={"Project Detail - 1"}/>
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
                                            {/* <DepartmentContext.Provider value = {{ state, dispatch}}> */}
                                                <DropdownData update={updateGVHD} prop={giangVien} parent={"Project Detail"} depended={depended}/>
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
                        </DepartmentContext.Provider>
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
                    
                    <div className={`
                        ${memList.length>0 
                            ? "block"
                            : "hidden"
                        }
                        mt-6 text-lg font-medium leading-6 text-gray-900
                        `}>
                        <hr className='my-3'/>
                        Sinh viên tham gia thực hiện đề tài
                    </div>
                    {
                        memList.map((item) => (
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
                            <button className="mx-3" onClick={() => removeMember(item.sinhvienid)} >
                                <div className="mt-10 mb-3 float-start" >
                                    <div className="bg-alert text-center px-6 py-1.5 rounded-xl shadow-xl text-lg 
                                        font-semibold text-white cursor-pointer w-fit m-auto hover:bg-alert">
                                        Xóa 
                                    </div>
                                </div>
                            </button>
                        </div>
                        ))
                    }
                    <div className="mt-10 mb-3 float-start" onClick={() => setMember(!member)}>
                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                            font-semibold text-white cursor-pointer w-fit m-auto">
                            Thêm thành viên
                        </div>
                    </div>
                    <Dialog props={member} memList={memList} handleList={handleList}/>
                </div>
            </div>
            <hr />
            {/* File upload */}
            <FileContext.Provider value={{ fileArray, handleFile}}>
            <div className="my-6">
                <div className="flex w-2/3 max-xl:w-full">
                    <div className=" w-4/5 max-w-7xl max-sm:w-full">
                        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                            Tài liệu đề xuất (.doc | .docx | .pdf)
                        </label>
                        <div className="px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                        flex items-center justify-between"
                        onClick={()=> openUploadForm()}

                        >
                            <div 
                            className="file:hidden"
                            id="inputGroupFile02">
                                {displayFile.length > 0
                                 ? displayFile && displayFile.map(item => item.name + " | ")
                                 : "Không có tệp nào được chọn"
                                }
                            </div> 
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
                <div className="">
                    <FileUpload props={uploadForm}/>
                </div>
            </div>
            </FileContext.Provider>

            <div className="" >
                <div className="mt-10 mb-3 float-end" onClick={() => setIsRegist(true)}>
                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                        font-semibold text-white cursor-pointer w-fit m-auto">
                        Đăng ký
                    </div>
                </div>
                <ConfirmDialog open={isRegist} props={""} parent={"Normal"} close={cancelRegist} isConfirm={registProject} titlehead="Đăng ký đề tài mới"/>
            </div>
        </div>
    </div>
  )
}
