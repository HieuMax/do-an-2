import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { downloadFile, getMarkOfProject, getProjectById, getProposalFile, updateStatusProject } from '../../controller/1.projects/project';
import { Loading } from '../../utils/Loading';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';
import { ProjectGrading } from '../7.projectGrading/ProjectGrading';
import TimelineCom from '../../third-party/components/Data Display/Timeline';
import { UploadCom } from '../../components/fileupload/UploadCom';
import TableViewMarks from '../../third-party/components/Data Display/TableViewMarks';
import { DisplayProjectDetail } from '../../components/project_detail/DisplayProjectDetail';
import { DisplayFileUploaded } from '../../components/project_detail/DisplayFileUploaded';

const user = {id: "227480100000", name: "Hieu Max"}

const accesstoken = { id: "GV001", role: "giangvien" }


export const RegisteredProject = ({props}) => {
  const location = useLocation();
  const { detaiId } = location.state; 
  // data
  const [ data, setData ] = useState()
  const [ project, setProject ] = useState({})
  const [ logicStatus, setLogicStatus ] = useState()
  const [ proposalFile, setProposalFile ] = useState()

  // Open modal
  const [ openModalConfirm, setOpenModalConfirm ] = useState(false);
  const [ openModalReject, setOpenModalReject ] = useState(false);
  const [ openModalGrading, setOpenModalGrading ] = useState(false)
  const [ isConfirmForm, setIsConfirmForm ] = useState(false)

  // Form
  const [ viewRecomForm, setViewRecomForm ] = useState(false)
  const [ gradingForm, setGradingForm ] = useState()
  
  // Loading
  const [ loading, setLoading ] = useState(false) 
  const action_click_timeline = () => {
    setViewRecomForm(true)
 }

  const [ propsTimeline, setPropsTimeline ] = useState({
    proposal: false,
    status: logicStatus,
    action_click_timeline: () => action_click_timeline()
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
  
  // Mentor Approve
  const isConfirm = () => {
    updateStatusProject(1, detaiId)
    .then(() => {
        window.scrollTo(0, 0)
    })
    .finally(() => {
        NotificationBottomRight("Duyệt thành công")
    })
    setTimeout(() => {
        window.location.reload();
    }, 1500)
    clearTimeout()
    setLoading(true)
  }

  const isReject = () => {
    
  }

  useEffect(() => {
    if(!openModalConfirm && !openModalReject) return
    document.body.style.overflowY = "hidden"
  }, [openModalConfirm, openModalReject])


  useEffect(() => {
    const fetchData = async () => {
        try {
            const projectRes = await getProjectById(detaiId);
            setTimeout(() => {
                setProject(projectRes)

            }, 500)
            setLogicStatus(projectRes.trangthai)
            // setStatus(setTrangThai(projectRes.trangthai))
            // setStatusCss(projectRes.trangthai)
        } catch (error) {
            throw new Error(error)
        }        
    }
    fetchData();
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



  useEffect(() => {
    if(logicStatus == 1) {
        setGradingForm("Grading-recom")
    } else if (logicStatus == 2) {
        setGradingForm("Grading-proposal")
    } else return
    setPropsTimeline({
        ...propsTimeline,
        status: logicStatus
    })
    const fetchMark = async () => {
        const datajson = {
          userid: accesstoken.id,
          detaiid: detaiId,
          role: accesstoken.role == "giangvien"? "nguoichamdiem" : "sinhvien",
          type: "thuyetminh"
        }
        if(!datajson.type) return
        const response = await getMarkOfProject(datajson);
        // console.log(response)
        if(response.data.length < 1) {
          setData()
        } else {
          setData(response)
        }
      } 
      fetchMark()
    //   console.log(logicStatus)
    //   console.log(accesstoken.role)
  }, [logicStatus])


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

  const [ isLoaded, setIsLoaded ] = useState(false)
  const projectLoading = () => setIsLoaded(true)
  
  return (

    <div className="py-3 px-3 h-full scroll-smooth">
        {
            loading 
            ? <div className="h-screen m-auto"><Loading /></div>
            : (
                <div className="h-full max-w-full  flex p-3 flex-col">
                    <DisplayProjectDetail user={user} action={() => projectLoading()} />

                    {/* File upload */}
                    {
                        isLoaded
                        ? 
                        <div className="my-6">
                            <div className="flex w-full max-xl:w-full flex-row-reverse">
                                <div className="mt-3 w-2/3">
                                    <TimelineCom props={propsTimeline}/>
                                </div>
                                <div className="w-full">
                                    {/* Recommend file*/}
                                    <DisplayFileUploaded title={"Tài liệu đề xuất"} project={project} download={download}/>

                                    {/* Presentation file */}
                                    {   
                                        project.trangthai >= 2
                                            ? accesstoken.role == "sinhvien" && !(proposalFile && proposalFile.originalfilename) && logicStatus == 2
                                                ? <div className=""><UploadCom props={propsUpfile}/></div>
                                                : <div className=""><DisplayFileUploaded title={"Tài liệu thuyết minh"} project={proposalFile} download={download} /></div>
                                            : ""
                                    }
                                    {/* Report file */}
                                    { 
                                        project.trangthai > 4 
                                        ? <div className=""><DisplayFileUploaded title={"Tài liệu báo cáo"} project={{}} download={download}/></div>
                                        : ""
                                    }
                                </div>
                            </div>

                            {/* Approval */}
                            {
                                logicStatus == 0 || accesstoken.role == "quanly"
                                ? <div className="w-full flex justify-end gap-4 mt-8" >
                                    <div className="bg-red-600 text-center px-3 py-2 rounded-xl shadow-xl text-lg font-semibold text-white cursor-pointer w-fit " onClick={() => setOpenModalReject(true)}>
                                        Từ chối 
                                    </div>
                                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg font-semibold text-white cursor-pointer w-fit " onClick={() => setOpenModalConfirm(true)}>
                                        Duyệt
                                    </div>
                                    
                                    <div className="hidden">
                                        <ConfirmDialog open={openModalConfirm} close={closeModal} isConfirm={isConfirm} parent={"Approve"}/>
                                        <ConfirmDialog open={openModalReject} close={closeModal} isConfirm={isReject} parent={"Reject"}/>
                                    </div>
                                </div>
                                : ""
                            }

                            {/* View mark */}
                            {
                                <TableViewMarks open={viewRecomForm} close={() => setViewRecomForm(false)} detaiid={detaiId} userToken={user}/>
                            }

                            {/* Grading */}
                            {
                                accesstoken.role == "giangvien" && logicStatus >= 1
                                ? (<div className={`w-full flex justify-end gap-4 mt-8`}>
                                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg font-semibold text-white cursor-pointer w-fit " onClick={() => setOpenModalGrading(true)}>
                                            {/* Chấm điểm */}
                                            {
                                                logicStatus == 1
                                                ? "Phê duyệt"
                                                : logicStatus == 2
                                                ? "Chấm điểm"
                                                : ""
                                            }
                                        </div>
                                        <ProjectGrading open={openModalGrading} close={closeModalGrading} userToken={accesstoken} detaiid={project.detaiid} data={data} form={gradingForm}/>
                                    </div>)
                                : ""
                            }
                            
                            {/* Confirm change */}
                            {
                                accesstoken.role == "sinhvien" && logicStatus%2==0
                                ? (<div className={`${project.trangthai < 2 ? "hidden" : ""} w-full flex justify-end gap-4 mt-8`}>
                                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg hover:bg-red-system-hover font-semibold text-white cursor-pointer w-fit bg-red-system" onClick={() => setIsConfirmForm(true)}>
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
                        : ""
                    }
                    
                </div>
            )
        }
        

    </div>
  )
}
