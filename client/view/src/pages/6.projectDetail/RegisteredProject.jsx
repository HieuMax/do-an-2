import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadFile, getMarkOfProject, getProjectById, getProposalFile, projectPermission, updateStatusProject } from '../../controller/1.projects/project';
import { Loading } from '../../utils/Loading';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';
import { ProjectGrading } from '../7.projectGrading/ProjectGrading';
import TimelineCom from '../../third-party/components/Data Display/Timeline';
import { UploadCom } from '../../components/fileupload/UploadCom';
import TableViewMarks from '../../third-party/components/Data Display/TableViewMarks';
import { DisplayProjectDetail } from '../../components/project_detail/DisplayProjectDetail';
import { DisplayFileUploaded } from '../../components/project_detail/DisplayFileUploaded';
import ModalAssignCouncil from '../../components/modal/ModalAssignCouncil';
import { useAuthStore } from '../../api/authStore';
import { getNotify, sendMessToAdmin } from '../../controller/7.notify/notify';


export const RegisteredProject = ({props}) => {
  const navigate = useNavigate();
  // const { user } = useAuthStore()
  const user = JSON.parse(window.localStorage.getItem('userInfo'))
  const accesstoken = 
  { 
    // id: user.vaitro=="Student"?user.sinhvienid : user.giangvienid,
    id: user.userId,
    role: user.vaitro=="Student"?"sinhvien" : "giangvien"
  }

  const location = useLocation();
  const { isAssign } = location.state || {}; // Đặt giá trị mặc định là một object rỗng

  // data
  const { detaiId } = location.state 
    ? location.state
    : {detaiId: location.pathname.substring(location.pathname.lastIndexOf('/')+1)}; 
  // --------------------------------------------------------------
  // ------------------------- DATA -------------------------------
  // --------------------------------------------------------------
  const [ data, setData ] = useState()
  const [ project, setProject ] = useState({})
  const [ logicStatus, setLogicStatus ] = useState()
  const [ proposalFile, setProposalFile ] = useState()
  const [ reportFile, setReportFile ] = useState()

  // --------------------------------------------------------------
  // ------------------------ Open modal --------------------------
  // --------------------------------------------------------------
  const [ openModalConfirm, setOpenModalConfirm ] = useState(false);
  const [ openModalReject, setOpenModalReject ] = useState(false);
  const [ openModalGrading, setOpenModalGrading ] = useState(false)
  const [ isConfirmForm, setIsConfirmForm ] = useState(false)

  // --------------------------------------------------------------
  // ----------------------- Close modal --------------------------
  // --------------------------------------------------------------
  const closeModal= () => {
    setTimeout(() => {
        document.body.style.overflowY = "scroll"
    }, 180)
    setOpenModalConfirm(false)
    setOpenModalReject(false)
  }
  
  const closeConfirmDialog = () => setIsConfirmForm(false) 

  // --------------------------------------------------------------
  // ------------------------- Form -------------------------------
  // --------------------------------------------------------------
  const [ viewRecomForm, setViewRecomForm ] = useState(false)
  const [ gradingForm, setGradingForm ] = useState()
  
  // --------------------------------------------------------------
  // ------------------------ Loading -----------------------------
  // --------------------------------------------------------------
  const [ loading, setLoading ] = useState(false) 
  const action_click_timeline = () => {
    setViewRecomForm(true)
 }

  // --------------------------------------------------------------
  // -------------------- Display timeline ------------------------
  // --------------------------------------------------------------
  const [ propsTimeline, setPropsTimeline ] = useState({
    proposal: false,
    report: false,
    status: logicStatus,
    action_click_timeline: () => action_click_timeline()
  })

  // --------------------------------------------------------------
  // -------------------- Props when up file ----------------------
  // --------------------------------------------------------------
  const [ propsUpfile, setPropsUpfile ] = useState({
    // label: "Tài liệu thuyết minh",
    label: "",
    detaiid: detaiId,
    action: false,
    affter_action: () => handleAffterAction(),
  })
  

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

  // --------------------------------------------------------------
  // ------------------- Props report when up file ----------------
  // --------------------------------------------------------------



  // --------------------------------------------------------------
  // ------------------------ Mentor Approve ----------------------
  // --------------------------------------------------------------
  const isConfirm = () => {
    const t = document.getElementById('sinhVienChuNhiem') // change after 
    updateStatusProject(1, detaiId)
    .then(() => {
        window.scrollTo(0, 0)
    })
    .finally(async () => {
        NotificationBottomRight("Duyệt thành công")
        await getNotify(t.value, "Approval project", "sinhvien")
        await sendMessToAdmin("Assign council to project")
    })
    setTimeout(() => {
        window.location.reload();
    }, 1500)
    clearTimeout()
    setLoading(true)
  }



  useEffect(() => {
    if(!openModalConfirm && !openModalReject) return
    document.body.style.overflowY = "hidden"
  }, [openModalConfirm, openModalReject])


  const [councilAssigned, setCouncilAssigned] = useState(false)

  // --------------------------------------------------------------
  // -------------------------- Get DATA --------------------------
  // --------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
        try {
            const projectRes = await getProjectById(detaiId);
            setTimeout(() => {
                setProject(projectRes)
            }, 500)
            setLogicStatus(projectRes.trangthai)
        } catch (error) {
            throw new Error(error)
        }        
    }
    fetchData();

    const fetchProposal = async() => {
      const response = await getProposalFile(detaiId);
      if(response === undefined || (response && response.length < 1)) {
          setProposalFile()
      } else {
          setProposalFile(response)
          setPropsTimeline({...propsTimeline, proposal: true})
      }
    }
    fetchProposal();
  }, [detaiId, councilAssigned])

  // --------------------------------------------------------------
  // -------------------- Get form for grading --------------------
  // --------------------------------------------------------------
  useEffect(() => {
    if(logicStatus == 1) {
        setGradingForm("Grading-recom")
    } else if (logicStatus == 2) {
        setGradingForm("Grading-proposal")
    } 
    setPropsTimeline({
        ...propsTimeline,
        status: logicStatus
    })
    setPropsUpfile({
      ...propsUpfile,
      label: logicStatus == 3? "Tài liệu báo cáo" : "Tài liệu thuyết minh",
    })
    const fetchMark = async () => {
        const datajson = {
          userid: accesstoken.id,
          detaiid: detaiId,
          role: accesstoken.role == "giangvien"? "nguoichamdiem" : "sinhvien",
          type: logicStatus == 1 ? "dexuat" : "thuyetminh"
        }
        // console.log(datajson)
        if(!datajson.type) return
        const response = await getMarkOfProject(datajson);
        // console.log(response)
        if(response.data && response.data.length < 1) {
          setData()
        } else {
          setData(response)
        }
      } 
      fetchMark()
  }, [logicStatus])


  // --------------------------------------------------------------
  // -------------------- Func to download file -------------------
  // --------------------------------------------------------------
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
  


  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);

  const handleAssignClick = () => {
    toggleModalAssign();
  };
  const toggleModalAssign = () => {
    setIsModalAssignOpen(!isModalAssignOpen);
  };
  const toggleCouncilAssigned = () => {
    setCouncilAssigned(!councilAssigned)
  }
  if(isAssign && project.hoidongphancong && user.vaitro == "Admin" || project.hoidongphancong && user.vaitro == "Admin"){
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <p className='text-4xl w-full text-center mb-4'>Đề tài: {project.tendetai} </p>
            <div className="text-2xl flex items-center space-x-2 border border-green-500 justify-center bg-green-50  text-green-700 px-5 py-3 ">
              <span className='pr-2'>Đã được phân công</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="rounded-full h-5 w-5 bg-green-500 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.9 7.9a1 1 0 01-1.415 0l-3.6-3.6a1 1 0 011.415-1.415l3.187 3.186 7.187-7.187a1 1 0 011.415 0z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="mt-4 inline-flex justify-center rounded-md min-w-16 max-w-fit bg-gray-600 px-3 py-2 cursor-pointer
            text-2xl font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500
            sm:w-auto" 
                onClick={() => navigate('/council-assignment')}
            >
                Trở về
            </div>
        </div>
    )

  }
 
  const isReject = () => {
    ///////////////////////////////
    /////////////////////////////// Reject Project 
    ///////////////////////////////
  }


  return (

    <div className="py-3 px-3 h-full scroll-smooth">
        {}
        {
            loading 
            ? <div className="h-screen m-auto"><Loading /></div>
            : (
                <div className="h-full max-w-full  flex p-3 flex-col">
                    <DisplayProjectDetail action={() => projectLoading()} />

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
                                      project.trangthai >= 3 
                                      ? accesstoken.role == "sinhvien" && !(reportFile && reportFile.originalfilename) && logicStatus == 3
                                        ? <div className=""><UploadCom props={propsUpfile}/></div>
                                        : <div className=""><DisplayFileUploaded title={"Tài liệu báo cáo"} project={reportFile} download={download}/></div>
                                      : ""
                                    }
                                </div>
                            </div>

                            {/* Approval */}
                            {
                              logicStatus == 0 && accesstoken.role=="giangvien" || accesstoken.role == "quanly"
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
                                isAssign && !project.hoidongphancong
                                ?
                                    <div 
                                        className={`w-full flex justify-end gap-4 mt-8`}
                                          
                                    >
                                        <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg font-semibold text-white cursor-pointer w-fit " onClick={handleAssignClick}>
                                            Phân công
                                          
                                        </div>
                                        <ModalAssignCouncil isOpen={isModalAssignOpen} toggleModal={toggleModalAssign} data={detaiId} toggleAssigned={toggleCouncilAssigned}/>

                                    </div>
                                : 
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
