import React, { useEffect, useState } from 'react'
import { ProgressBar } from '../../components/progress/ProgressBar';
import { ProgressBarVertical } from '../../components/progress/ProgressBarVertical';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadFile, getMarkOfProject, getProjectById, getProposalFile, updateStatusProject } from '../../controller/1.projects/project';
import { ConvertToMoney } from '../../utils/ConvertToMoney';
import { Loading } from '../../utils/Loading';
import { BadgeCheck } from 'lucide-react';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';
import { ProjectGrading } from '../7.projectGrading/ProjectGrading';
import TimelineCom from '../../third-party/components/Data Display/Timeline';
import { UploadCom } from '../../components/fileupload/UploadCom';

const user = {id: "227480100000", name: "Hieu Max"}

const accesstoken = { id: "SV001", role: "sinhvien" }


export const RegisteredProject = ({props}) => {
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);
  const [openModalGrading, setOpenModalGrading] = useState(false)
  const [ data, setData ] = useState()
  const [ proposalFile, setProposalFile ] = useState()
  const [ logicStatus, setLogicStatus ] = useState()
  const [ isConfirmForm, setIsConfirmForm ] = useState(false)
  const location = useLocation();
  const { detaiId } = location.state; 
  const [project, setProject] = useState({})
  const [status, setStatus] = useState() // statusCss of project 
  const [statusCss, setStatusCss] = useState()
  const navigate = useNavigate();
  const [ propsTimeline, setPropsTimeline ] = useState({
    proposal: false
  })
  const [ propsUpfile, setPropsUpfile ] = useState({
    label: "Tài liệu thuyết minh",
    detaiid: detaiId,
    action: false,
    affter_action: () => handleAffterAction(),
  })

  const closeConfirmDialog = () => setIsConfirmForm(false) 
  const handleIsConfirm = () => {

    setPropsUpfile({
        ...propsUpfile,
        action: true
    })
    setInterval(() => {}, [10]);
    clearInterval();
  }

  const handleAffterAction = () => {
    setTimeout(() => {
        setLogicStatus(logicStatus+1)
    }, 500)
    clearTimeout();
    window.location.reload()

  }


  const closeModal= () => {
    setTimeout(() => {
        document.body.style.overflowY = "scroll"
    }, 180)
    setOpenModalConfirm(false)
    setOpenModalReject(false)
  }
  

  const isConfirm = () => {
    updateStatusProject(project.trangthai+1, project.detaiid)
    .then(() => {
        window.scrollTo(0, 0)
        return(
            <div className="h-screen w-full bg-red-300">
                <Loading />
            </div>
        )
    })
    .finally(() => {
        const fetchData = async () => {
            try {
                const projectRes = await getProjectById(detaiId);
                setTimeout(() => {
                    setProject(projectRes)
                }, 500)
                setStatus(setTrangThai(projectRes.trangthai))
                setStatusCss(projectRes.trangthai)
            } catch (error) {
                throw new Error(error)
            }        
        }
        fetchData();
        window.location.reload();
    })
  }

  const isReject = () => {
    
  }

  useEffect(() => {
    if(!openModalConfirm && !openModalReject) return
    document.body.style.overflowY = "hidden"
  }, [openModalConfirm, openModalReject])




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

//   console.log(logicStatus)

  useEffect(() => {
    const fetchData = async () => {
        try {
            const projectRes = await getProjectById(detaiId);
            setTimeout(() => {
                setProject(projectRes)

            }, 500)
            setLogicStatus(projectRes.trangthai)
            setStatus(setTrangThai(projectRes.trangthai))
            setStatusCss(projectRes.trangthai)
        } catch (error) {
            throw new Error(error)
        }        
    }
    fetchData();
    const fetchMark = async () => {
        const datajson = {
          userid: accesstoken.id,
          detaiid: detaiId,
          role: accesstoken.role == "giangvien"? "nguoichamdiem" : "sinhvien"
        }
        const response = await getMarkOfProject(datajson);
        if(response.data.length < 1) {
          setData()
        } else {
          setData(response)
        }
  
      } 
      fetchMark()
      const fetchProposal = async() => {
        const response = await getProposalFile(detaiId);
        // console.log(response !== undefined)
        if(response === undefined || (response && response.length < 1)) {
            setProposalFile()
        } else {
            setProposalFile(response)
            setPropsTimeline({...propsTimeline, proposal: true})
        }
      }
      fetchProposal();

  }, [detaiId])



  const download = (p) => {
    const filename = p.tailieudexuat?  p.tailieudexuat :  p.tailieupath
    const originalname = p.originalfilename
    downloadFile(filename, originalname).then(
        NotificationBottomRight("Tệp đã được tải")
    )
  }

  const closeModalGrading = () => {
    setOpenModalGrading(false)
  }

  return (
    <div className="py-3 px-3 h-full scroll-smooth">
        { project && project.detaiid
            ?
        (<div className="h-full max-w-full  flex p-3 flex-col">
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
                            defaultValue={project.tendetai}
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
                            defaultValue={project.linhvuc}
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
                            defaultValue={project.kinhphi
                                ? ConvertToMoney(project.kinhphi)
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
                            defaultValue={project.thoigianthuchien}
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
                                                
                                                defaultValue={project.hotenGV}
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
                                                defaultValue={project.sdtGV}

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
                                                defaultValue={project.emailGV}
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


            {/* File upload */}
            <div className="my-6">
                <div className="flex w-full max-xl:w-full flex-row-reverse">
                    <div className="mt-3 w-2/3">
                        <TimelineCom props={propsTimeline}/>
                    </div>
                    <div className="w-full">
                        {/* Recommend file*/}
                        <div className=" w-4/5 max-w-7xl max-sm:w-full">
                            <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                Tài liệu đề xuất (.doc | .docx | .pdf)
                            </label>
                            <div className=
                            {`
                                px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                            flex items-center justify-between
                                `
                            }
                            >
                                <div 
                                className="file:hidden"
                                id="inputGroupFile02">
                                    {project.originalfilename
                                    //  ? project && project.map(item => item.originalname + " | ")
                                    ? project && project.originalfilename
                                    : "Không có tệp nào được chọn"
                                    }
                                </div> 
                                <label className={` input-group-text`} htmlFor='inputGroupFile02'>
                                    <div className="" onClick={() => download(project)}>
                                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                            font-semibold text-white cursor-pointer w-fit m-auto">
                                            Download
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {/* Presentation file */}
                        {   
                            project.trangthai >= 2
                                ? accesstoken.role == "sinhvien" && !(proposalFile && proposalFile.originalfilename) && logicStatus == 2
                                  ? <div className="">
                                        <UploadCom props={propsUpfile}/>
                                    </div>

                                  : (<div className=" w-4/5 max-w-7xl max-sm:w-full my-6">
                                        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                            Tài liệu thuyết minh (.doc | .docx | .pdf)
                                        </label>
                                        <div className=
                                        {`
                                            px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                                        flex items-center justify-between
                                            `
                                        }
                                        >
                                            <div 
                                            className="file:hidden"
                                            id="inputGroupFile02">
                                                {
                                                proposalFile && proposalFile.originalfilename
                                                ? proposalFile && proposalFile.originalfilename
                                                : "Không có tệp nào được chọn"
                                                }
                                            </div> 
                                            <label className={` input-group-text`} htmlFor='inputGroupFile02'>
                                                <div className="" onClick={() => download(proposalFile)}>
                                                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                                        font-semibold text-white cursor-pointer w-fit m-auto">
                                                        Download
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>)
                                : ""
                            
                        }
                        {/* Report file */}
                        {
                            project.trangthai > 4
                              ? (<div className=" w-4/5 max-w-7xl max-sm:w-full my-6">
                                    <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                                        Tài liệu báo cáo (.doc | .docx | .pdf)
                                    </label>
                                    <div className=
                                    {`
                                        px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                                    flex items-center justify-between
                                        `
                                    }
                                    >
                                        <div 
                                        className="file:hidden"
                                        id="inputGroupFile02">
                                            {project.originalfilename
                                            //  ? project && project.map(item => item.originalname + " | ")
                                            ? project && project.originalfilename
                                            : "Không có tệp nào được chọn"
                                            }
                                        </div> 
                                        <label className={` input-group-text`} htmlFor='inputGroupFile02'>
                                            <div className="" onClick={() => download(project)}>
                                                <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                                    font-semibold text-white cursor-pointer w-fit m-auto">
                                                    Download
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>)
                              : ""
                        }
                        
                    </div>
                </div>

                {/* Approval */}
                <div className={`${project.trangthai < 2
                    ? "w-full flex justify-end gap-4 mt-8"
                    : "hidden"
                }`} >
                    <div className="bg-red-600 text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                        font-semibold text-white cursor-pointer w-fit "
                        onClick={() => setOpenModalReject(true)}
                    >
                                Từ chối 
                    </div>
                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                        font-semibold text-white cursor-pointer w-fit "
                        onClick={() => setOpenModalConfirm(true)}                    
                    >
                                Duyệt
                    </div>
                    
                    <div className="hidden">
                        <ConfirmDialog open={openModalConfirm} close={closeModal} isConfirm={isConfirm} parent={"Approve"}/>
                        <ConfirmDialog open={openModalReject} close={closeModal} isConfirm={isReject} parent={"Reject"}/>
                    </div>
                </div>

                {/* Grading */}
                {
                    accesstoken.role == "giangvien"
                      ? (<div className={`${project.trangthai < 2 ? "hidden" : ""} w-full flex justify-end gap-4 mt-8`}>
                            <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                                                font-semibold text-white cursor-pointer w-fit "
                                onClick={() => setOpenModalGrading(true)}                    
                            >
                                        Chấm điểm
                            </div>
                            <ProjectGrading open={openModalGrading} close={closeModalGrading} userToken={accesstoken} detaiid={project.detaiid} data={data}/>
                        </div>)
                      : ""
                }
                
                {/* Confirm change */}
                {
                    accesstoken.role == "sinhvien" && logicStatus%2==0
                      ? (<div className={`${project.trangthai < 2 ? "hidden" : ""} w-full flex justify-end gap-4 mt-8`}>
                            <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg hover:bg-red-system-hover
                                                font-semibold text-white cursor-pointer w-fit bg-red-system"
                                    onClick={() => setIsConfirmForm(true)}                    
                            >
                                        Xác nhận thay đổi
                            </div>
                            <div className="z-100">
                                <ConfirmDialog  titlehead={"Xác nhận thay đổi"} parent={"Confirm"} props={""} open={isConfirmForm} close={closeConfirmDialog} isConfirm={handleIsConfirm}/>
                            </div>
                            {/* <ProjectGrading open={openModalGrading} close={closeModalGrading} userToken={accesstoken} detaiid={project.detaiid} data={data}/> */}
                        </div>)
                     : ""
                }
            </div>
        </div>)
            : <div className="h-screen flex justify-center items-center"><Loading /></div>
        }
    </div>
  )
}
