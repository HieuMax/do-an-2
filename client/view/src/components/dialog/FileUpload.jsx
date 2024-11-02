import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useContext, useEffect, useState } from 'react'
import UploadFile from '../../third-party/components/Data Entry/UploadFile'
import { message } from 'antd';
import { FileContext } from '../../provider/detailProvider';


export const FileUpload = ({ props }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const { fileArray, handleFile } = useContext(FileContext);

  const close = () => {
    setOpen(false)
    props.isOpen();
  }

  const cancel = () => {
    if(props.displayFile.length < 1 && fileArray.length < 1) {
        handleFile([])
    } else {
        handleFile(props.displayFile)
    }
    close()
  }

  const isConfirmUpload = async () => {
    if(fileArray && fileArray.length < 1) {
        message.error(`Tải lên thất bại: Không có tệp nào được chọn.`);
        return
    }
    message.success(`Tải lên thành công.`);
    props.isConfirmToDisplay();
    props._enableBtnConfirmChange();
    close()
  }

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                File upload
                            </DialogTitle>
                            <div className="my-6 w-full">
                                <div className="h-full">
                                    <UploadFile fileArray={fileArray} handleFile={handleFile}/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Button */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-6">
                    <button
                        type="button"
                        onClick={() => isConfirmUpload()}
                        className="inline-flex min-w-16 w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-system-500 sm:ml-3 sm:w-auto"
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        data-autofocus
                        onClick={() => cancel()}
                        className="mt-3 inline-flex min-w-16 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Hủy
                    </button>
                </div>
            </DialogPanel>
            </div>
        </div>
    </Dialog>
  )
}
