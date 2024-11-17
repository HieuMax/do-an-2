import { generateSlug } from "../../utils/generateSlug";
import { Plus } from "lucide-react";
import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import parse from "html-react-parser";
// import { uploadImageToCloudinary, addNewArticle } from "../../controller/8.article/article";
import { uploadImageToCloudinary, addNewArticle } from "../../controller/8.articles/article";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion,  AnimatePresence  } from 'framer-motion';
import { getArticleById, updateArticle } from "../../controller/8.articles/article";

export default function Home() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const reactQuillRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true); 
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); 

  const { id } = useParams(); 
  const showActions = window.location.pathname.includes("/editing-feed");
  const showActions2 = window.location.pathname === '/adding-feed';


  const navigate = useNavigate()
  const [initialArticleData, setInitialArticleData] = useState({});

  useEffect(() => {
    if (id && showActions) {
      loadArticleData(id); 
    } else {
      if(!showActions2){
        navigate(-1)
      } 
      return
    }
  }, [id]);

  const loadArticleData = async (id) => {
    try {
      const response = await getArticleById(id);
      if (response.success) {
        const article = response.data;
        setTitle(article.tieude);
        setSlug(article.slug);
        setDescription(article.mota);
        setContent(article.content);
        setInitialArticleData({
          tieude: article.tieude,
          slug: article.slug,
          mota: article.mota,
          content: article.content
        })
      } else {
        navigate(-1)
      }
    } catch (error) {
      console.error("Error loading article:", error);
    }
  };

  function handleTitle(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const autoSlug = generateSlug(newTitle);
    setSlug(autoSlug);

    // Xóa lỗi nếu người dùng đã điền tên hội đồng
    if (errors.tieude) {
      setErrors((prev) => ({ ...prev, tieude: '' }));
    }
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


     
    let newErrors = {};
    // Validate each field
    if (!title) newErrors.tieude = 'Vui lòng nhập tiêu đề bài viết';
    if (!slug) newErrors.slug = 'Slug chưa được tạo';
    if (!description) newErrors.mota = 'Vui lòng nhập mô tả bài viết';
    if (!content) newErrors.noidung = 'Vui lòng nhập nội dung bài viết';

    // If there are any errors, set errors state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Reset errors if no errors found
    setErrors({});

    const hasChanges = (
      title !== initialArticleData.tieude ||
      slug !== initialArticleData.slug ||
      description !== initialArticleData.mota ||
      content !== initialArticleData.content 
    );
  
    if (!hasChanges) {
      toast.info('Không có thay đổi nào được cập nhật.');
      return;
    }

    setIsVisible(true)
    const currentDate = new Date().toISOString().split('T')[0]; 

    const newArticle = {
      title,
      slug,
      description,
      content: content, 
      date: currentDate,
    };

    try {
      // const response = await addNewArticle(newArticle)
      const response = id
      ? await updateArticle(id, newArticle)
      : await addNewArticle(newArticle)

      if(response.success){
        setSuccessMessage({
          message: id ? "Bài viết đã được cập nhật thành công!" : "Bài viết mới đã được thêm thành công!",
          link: `/article/${slug}`,
        });
        toast.success(response.message)

        setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        if(!id){
          setContent('')
          setTitle('')
          setDescription('')
          setSlug('')
        } else {
          await loadArticleData(id)
        }
      }
      else {
        toast.error(response.message)

      }
      
    } catch (error) {
      console.error('API request error:', error.response ? error.response.data : error.message);
    }
  }


  const handleSlugChange = (e) => {
    const value = e.target.value;
    
    const validSlug = value.replace(/[^a-zA-Z0-9-]/g, '');  // Loại bỏ ký tự đặc biệt và space
    
    setSlug(validSlug);
  
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: '' }));
    }
  };
  
  const handleMotaChange = (e) => {
    const value = e.target.value;
    
    setDescription(value);
  
    if (errors.mota) {
      setErrors((prev) => ({ ...prev, mota: '' }));
    }
  };



  const uploadToCloudinary = async (file) => {
    
    const formData = new FormData();
    formData.append("articleImage", file);
    setIsLoading(true);
    const res = await uploadImageToCloudinary(formData)
    const url = res.data;
    setIsLoading(false);
    return url
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {

        const file = input.files[0];

        const formData = new FormData()
        file && formData.append("articleImage",file)
        
        const url = await uploadToCloudinary(file);
        console.log(url)
        const quill = reactQuillRef.current;

        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  // Custom Toolbar
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"], // Add image button
        [{ "code-block": true }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "indent",
    "image",
    "code-block",
    "color",
  ];

  return (
    <div>

      <AnimatePresence> {/* Bọc trong AnimatePresence */}
        {successMessage && isVisible && (
          <motion.div
            className="fixed top-0 left-0 w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3"
            initial={{ y: -100, opacity: 0 }} // Bắt đầu ngoài màn hình và mờ dần
            animate={{ y: 0, opacity: 1 }} // Hiển thị thông báo với vị trí ban đầu
            exit={{ y: -100, opacity: 0 }} // Ẩn đi sau khi hết thời gian
            transition={{ duration: 0.5, ease: "easeOut" }} // Thời gian hiệu ứng
          >
            <div className="ml-20 flex justify-center">
              <p>{successMessage.message}</p>
              <Link to={successMessage.link} className="text-blue-500 underline pl-1">
                Xem bài viết
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg flex items-center">
            <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> 
            Loading...
          </div>
        </div>
      )}


      <h2 className="text-4xl text-center font-semibold py-4">
        Thêm bài viết mới vào hệ thống.
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Article Editor */}
        <div className="w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5">
            Chỉnh sửa bài viết
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Title */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold leading-6 text-gray-900 mb-2"
                >
                Tiêu đề bài viết
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleTitle}
                    type="text"
                    value={title}
                    name="title"
                    id="title"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Nhập tiêu đề bài viết"
                  />
                  {errors.tieude && (
                    <p className="mt-1 text-sm text-red-600">{errors.tieude}</p>
                  )}
                </div>
              </div>
              {/* Slug */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="slug"
                  className="block text-sm font-bold leading-6 text-gray-900 mb-2"
                >
                  Bài viết slug
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleSlugChange}
                    type="text"
                    value={slug}
                    name="slug"
                    id="slug"
                    autoComplete="slug"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Chỉnh sửa slug bài viết"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Mô tả bài viết
                </label>
                <textarea
                  id="description"
                  rows="4"
                  onChange={handleMotaChange}
                  value={description}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nhập mô tả bài viết"
                >
                </textarea>
                {errors.mota && (
                  <p className="mt-1 text-sm text-red-600">{errors.mota}</p>
                )}
              </div>
              {/* Content */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="content"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Nội dung bài viết
                </label>
                <ReactQuill
                  ref={reactQuillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                />
                 {errors.noidung && (
                    <p className="mt-1 text-sm text-red-600">{errors.noidung}</p>
                  )}
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-bold text-center text-white rounded-lg bg-system"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span> {id ? "Cập nhật bài viết" : "Tạo bài viết mới"}</span>
            </button>
          </form>
        </div>

        {/* Article View */}
        <div className="Article-view w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5">
            Preview bài viết
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Title */}
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-bold leading-6 text-gray-900 mb-2">
                Tiêu đề bài viết
              </h2>
              <div className="mt-2">
                <p className="text-2xl font-normal">{title}</p>
              </div>
            </div>
            {/* Slug */}
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-bold leading-6 text-gray-900 mb-2">
                Bài viết slug
              </h2>
              <div className="mt-2">
                <p>{slug}</p>
              </div>
            </div>
            {/* Description */}
            <div className="sm:col-span-2">
              <h2 className="block mb-2 text-sm font-bold text-gray-900">
                Mô tả bài viết
              </h2>
              <p>{description}</p>
            </div>
            <div className="sm:col-span-full">
              <h2 className="block mb-2 text-sm font-bold text-gray-900">
                Nội dung bài viết
              </h2>
              <div className="ql-snow">
              <div className="ql-editor p-0" >
                {parse(content)}

              </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
