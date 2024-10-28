import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { toast } from 'react-toastify';

const { Dragger } = Upload;

const UploadFileManagement = ({ fileArray, handleFile }) => {
  const props = {
    multiple: false, 
    accept: ".xlsx, .xls",
    beforeUpload: (file) => {
      // Kiểm tra định dạng file
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Vui lòng chọn file có định dạng .xlsx hoặc .xls');
        return false; // Ngăn chặn upload
      }
      
      handleFile([file]); 
      return false; // Ngăn chặn upload tự động
    },
    onRemove: (file) => {
      handleFile([]);
    },
    fileList: fileArray
  };



  return (
    <>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Chọn hoặc thả file Excel vào đây</p>
      </Dragger>
    </>
  );
};

export default UploadFileManagement;