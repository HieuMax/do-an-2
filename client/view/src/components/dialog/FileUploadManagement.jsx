import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX để xử lý file Excel
import UploadFileManagement from '../../third-party/components/Data Entry/UploadFileManagement';
import { toast } from 'react-toastify';

export const FileUploadManagement = ({ isOpen, onClose, setFileList, setFileName, resetFileArray }) => {
  const [open, setOpen] = useState(false);
  const [fileArray, setFileArray] = useState([]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const close = () => {
    setOpen(false);
    onClose();
    setFileArray([]);
    setFileName([]);
    setFileList([]);

  };
  const closeConfirm = () => {
    setOpen(false);
    onClose();

  };
  // Hàm xử lý đọc file Excel
  const handleFile = (files) => {
    // Kiểm tra xem file có phải là đối tượng Blob không
    setFileArray(files);
    setFileName(files)
    // Đọc và parse file Excel  
    const reader = new FileReader();
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Truyền dữ liệu Excel ra ngoài thông qua setFileList
      setFileList(parsedData);
    };
  };

  const isConfirmUpload = () => {
    if (fileArray.length < 1) {
      toast.warn('Chưa có file nào được chọn')
      return;
    }
    if(resetFileArray){
      setFileArray([]);

    }
    closeConfirm();
  };

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0 h-screen ">
          <DialogPanel transition className="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                Upload file
              </DialogTitle>
              <div className="my-6">
                <UploadFileManagement fileArray={fileArray} handleFile={handleFile} />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={isConfirmUpload}
                className="w-full inline-flex justify-center rounded-md bg-system px-3 py-2 text-white font-semibold shadow-sm sm:w-auto">
                Xác nhận
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full inline-flex justify-center rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:mt-0 sm:w-auto">
                Hủy
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
