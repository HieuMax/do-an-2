// src/components/ArticleForm.jsx

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('technology');
  const [status, setStatus] = useState('draft');
  const [publishDate, setPublishDate] = useState(new Date());
  const [isPreview, setIsPreview] = useState(false); // State để kiểm soát chế độ xem trước

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newArticle = {
      title,
      content,
      category,
      status,
      publishDate,
    };

    try {
      await axios.post('/api/articles', newArticle);
      alert('Bài viết đã được lưu thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu bài viết:', error);
      alert('Đã xảy ra lỗi khi lưu bài viết.');
    }
  };

  const handlePreview = () => {
    setIsPreview(true); // Bật chế độ xem trước
  };

  const handleEdit = () => {
    setIsPreview(false); // Tắt chế độ xem trước
  };
  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block'],
      ],
    //   handlers: {
    //     image: handleImageUpload, // Xử lý ảnh
    //   },
    },
  };
  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm Bài Viết Mới</h2>
      
      {isPreview ? (
        // Hiển thị chế độ xem trước
        <div className="preview">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="italic text-gray-500 mb-4">Danh mục: {category}</p>
          <p className="mb-4">Ngày xuất bản: {publishDate.toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: content }} className="content mb-4" />
          <button
            onClick={handleEdit}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Chỉnh sửa
          </button>
        </div>
      ) : (
        // Form nhập bài viết
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border mb-4"
            placeholder="Nhập tiêu đề bài viết"
            required
          />

          <label className="block mb-2">Nội dung:</label>
          <ReactQuill  modules={modules} value={content} onChange={setContent} className="mb-4" />

          <label className="block mb-2">Danh mục:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border mb-4"
          >
            <option value="technology">Công nghệ</option>
            <option value="sports">Thể thao</option>
            <option value="entertainment">Giải trí</option>
          </select>

          <label className="block mb-2">Trạng thái:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border mb-4"
          >
            <option value="draft">Nháp</option>
            <option value="published">Đã xuất bản</option>
          </select>

          <label className="block mb-2">Ngày xuất bản:</label>
          <DatePicker
            selected={publishDate}
            onChange={(date) => setPublishDate(date)}
            className="w-full p-2 border mb-4"
          />

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handlePreview}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Xem trước
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Lưu Bài Viết
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleForm;
