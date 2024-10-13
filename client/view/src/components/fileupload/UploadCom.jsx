import React, { useEffect, useState } from 'react'
import { FileContext } from '../../provider/detailProvider'
import { FileUpload } from '../dialog/FileUpload'
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight'
import { message } from 'antd'
import { uploadFile, uploadProposalfile } from '../../controller/1.projects/project'

export const UploadCom = ({ props }) => {
  const [ isOpenUpload, setIsOpenUpload ] = useState(false)
  const [ fileArray, setFileArray ] = useState([])
  const [ displayFile, setDisplayFile ] = useState([])

  const openUploadForm = () => { setIsOpenUpload(true) }
  const handleFile = (arr) => { setFileArray(arr) }
  const isConfirmToDisplay = () => { setDisplayFile(fileArray) }
  const toggleUpload = () => { setIsOpenUpload(!isOpenUpload) }

  const uploadForm = {
    open: isOpenUpload,
    isOpen: () => toggleUpload(),
    fileArray: fileArray,
    isConfirmToDisplay: () => isConfirmToDisplay(),
    displayFile: displayFile
  }

  useEffect(() => {
    if(!props.action) return
    isConfirmChange()
  }, [props.action])

  const isConfirmChange = async () => {
    const handleUploadFile = async () => {
        const formData = new FormData();
        fileArray.forEach(file => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await uploadFile(formData);
            const filepath = response.filename
            const originalfilename = response.originalname.originalname
            const time = new Date
            const stringTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " - " + 
            time.getDate() + "/" + time.getMonth() + "/" + time.getFullYear()
            if(response.error) {
                return response.error
            }
            const data = {
                tailieupath: filepath,
                detaiid: props.detaiid,
                ngaynop: stringTime,
                originalfilename: originalfilename
            }

            if(response.status === 201) {
                const response = await uploadProposalfile(data)
                if(response.error) {
                    return response.error
                }
                if(response.status === 201) {
                    NotificationBottomRight("Tải lên thành công")
                    props.affter_action();
                 } else {
                    message.error("Thay đổi thất bại - Thử lại sau")
                }
    
            } else {
                message.error("Thay đổi thất bại - Thử lại sau")
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    await handleUploadFile();
  }


  return (
    <FileContext.Provider value={{ fileArray, handleFile}}>
    <div className="my-6">
        <div className={
            `${props 
                ? "w-full"
                : "w-2/3"
            }flex max-xl:w-full`
        }>
            <div className=" w-4/5 max-w-7xl max-sm:w-full">
                <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
                    {
                        props 
                         ? `${props.label} (.doc | .docx | .pdf)`
                         : "Tài liệu đề xuất (.doc | .docx | .pdf)"
                    }
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
  )
}
