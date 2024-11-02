import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import TableGrading from '../../third-party/components/Data Display/TableGrading'
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';
import NotificationBottomRight_err from '../../third-party/components/Notification/NotificationBottomRight_err';
import { Tag } from 'antd';
import { SwitchCom } from '../../third-party/components/Data Entry/Switch';
import { MarkContext } from '../../provider/detailProvider';
import { markProject } from '../../controller/1.projects/project';
import handleTotalMark from '../../utils/SumArray';
import { gradingProposalForm } from './formGradeProposal';
import { gradingRecomForm } from './formGradeRecom';
import { gradingReportForm } from './formGradeReport';




export const ProjectGrading = ({ open, close, userToken, detaiid, data, form }) => {

  const [ resTotal, setResTotal ] = useState()
  const [ total, setTotal ] = useState()
  const [ comment, setComment ] = useState()
  const [ isConfirmForm, setIsConfirmForm ] = useState(false)
  const [ isConfirm, setIsConfirm ] = useState(false)

  // Depend on form
  const [ gradingForm, setGradingForm ] = useState({});
  const [ typeForm, setTypeForm ] = useState()
  const closeGradeForm = () => { setIsConfirmForm(false) }

  //////////////////////////////////////////////////////////////
  // Handle user mark project //////////////////////////////////
  //////////////////////////////////////////////////////////////
  const handleIsConfirm = async () => {
    const total = handleTotalMark(resTotal)
    if(!total) {
      NotificationBottomRight_err("Chưa điền đầy đủ")
      return
    }
    if(!total) return
    setTotal(total)
    
    const data = {
      nguoichamdiem: userToken.id,
      mark: total,
      comment: comment,
      detaiid: detaiid,
      type: typeForm,
      diemtc1: resTotal.info[0]["mark"],
      diemtc2: resTotal.info[1]["mark"],
      diemtc3: resTotal.info[2]["mark"],
      diemtc4: resTotal.info[3]["mark"],
      diemtc5: resTotal.info[4]["mark"],
      diemtc6: resTotal.info[5]["mark"],
      diemtc7: resTotal.info[6]["mark"],
      diemtc8: resTotal.info[7]["mark"],
    }
    if(typeForm == "BaoCao") {
      data.diemtc9 = resTotal.info[8]["mark"]
    }
    // console.log(data)
    try {
      const response = await markProject(data)
      if(response.error) {
          return response.error
      }
      if(response.status === 201) {
        NotificationBottomRight("Chấm điểm thành công")
        setIsConfirm(true)
      } else if(response.status === 401){
        NotificationBottomRight_err("Không thuộc hội đồng chấm điểm")
      }
    } catch (error) {
        throw new Error(error);
    }

  }

  const handleResMark = (mark) => setResTotal(mark)
  const handleComment = (comment) => setComment(comment)
    
  useEffect(() => {
    if (!open) {
        document.body.style.overflowY = "scroll"
    } else
    document.body.style.overflowY = "hidden"
    if(form == "Grading-proposal") {
      setGradingForm(gradingProposalForm(data));
      setTypeForm("ThuyetMinh")
    } else if (form == "Grading-recom") {
      setGradingForm(gradingRecomForm(data));
      setTypeForm("DeXuat")
    } else if (form == "Grading-report") {
      setGradingForm(gradingReportForm(data));
      setTypeForm("BaoCao")
    }
  }, [open])



  return (
  <div className="">
  <Dialog open={open} onClose={() => close()} className="relative z-50">
      <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in 
              sm:my-8 sm:w-full sm:max-w-7xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            
              <div className="float-end mr-3 mt-3" onClick={() => close()}>
                <X size={30} />
              </div>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                      <div className="my-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <h1 className='text-lg font-medium leading-6 text-gray-900'>Tiêu chí chấm điểm thuyết minh đề tài</h1>
                      </div>

                  </div>
                <MarkContext.Provider value={{ handleResMark, handleComment }}>
                  <div className="">
                      <TableGrading props={gradingForm} close={open} data={data}/>
                      {/* {
                        console.log(data && data.data)
                      } */}
                      {/* comment */}
                      <div className="w-full flex justify-between gap-4 mt-8 items-end">
                        <div className="my-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-10/12">
                          <SwitchCom label={"Nhận xét"} toggle={false} data={data}/>
                        </div>
                        {
                          !(data && data.data && !data.data.length > 0)
                            ? (<div className={`bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                            font-semibold text-white cursor-pointer w-fit h-fit my-3 mr-9
                            ${data? "hidden": "block"}
                            ${isConfirm? "hidden" : "block"}
                                            `}
                                                onClick={() => setIsConfirmForm(true)}
                            >
                                        Xác nhận
                            </div>)
                            : ""
                        }
                        {
                          data && data.data && data.data.length > 0
                            ? (<Tag color={`${data.data[0]["diemtailieu"] >= 60? "green" : "red" }`} key={'grading-tag'} className='font-semibold flex justify-center items-center text-lg my-3 px-3 py-2 mr-9'>
                              {data.data[0]["diemtailieu"]} / 100
                            </Tag>)
                            : 
                            isConfirm && total 
                              ? (<Tag color={`${total >= 60? "green" : "red" }`} key={'grading-tag'} className='font-semibold flex justify-center items-center text-lg my-3 px-3 py-2 mr-9'>
                                {total} / 100
                              </Tag>)
                              : ""
                        }
                    </div>
                  </div>
                </MarkContext.Provider>
              </div>
                {
                  !(data && data.data && !data.data.length > 0)
                    ?(<div className="z-100">
                      <ConfirmDialog  titlehead={"Xác nhận chấm điểm"} parent={"Confirm"} props={""} open={isConfirmForm} close={closeGradeForm} isConfirm={handleIsConfirm}/>
                    </div>)
                    : ""
                }
                
          </DialogPanel>
          </div>
      </div>

  </Dialog>
  </div>
  )
}
