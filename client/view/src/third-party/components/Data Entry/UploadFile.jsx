import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

const UploadFile = ({ fileArray, handleFile }) => {
//   fileArray
  const props = {
    name: 'file',
    multiple: true,
    accept: ".doc, .docx, .pdf",
    action: 'http://localhost:8000/api/projects/preparefile',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    //   console.log(info)
      handleFile(info.fileList)
    //   fileArray = info
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
//   fileArray = props
//   console.log(fileArray)
  return (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Chọn hoặc thả file vào đây để tải lên</p>
    <p className="ant-upload-hint">
      Chỉ chấp nhận các file ".doc | .docx | .pdf"
    </p>
  </Dragger>
)}
export default UploadFile;