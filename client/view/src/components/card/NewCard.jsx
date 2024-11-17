import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react'
import { Pin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../api/authStore'
import ModalConfirm from '../modal/ModalConfirm';
import { deleteArticle, getAllArticle } from '../../controller/8.articles/article';
import { toast } from 'react-toastify';

export const NewCard = ({prop}) => {
  const card = prop
  const {user} = useAuthStore();
  const navigate = useNavigate(); 

  const [isLoading, setIsLoading] = useState(true)
  const loadSkeleton = () => {
    setIsLoading(false)
  }
  useEffect(() => {
    setTimeout(() => {
      loadSkeleton() 
    }, 800)
    clearTimeout();
  }, [])


  /* ---------- Confirm Dialog ---------- */
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); 
  const [articleToDelete, setArticleToDelete] = useState(null); 

  // Hàm mở Confirm Dialog và lưu ID bài viết cần xóa
  const openConfirmDialog = (articleId) => {
    setArticleToDelete(articleId);
    setIsConfirmOpen(true);
  };

  // Hàm đóng Confirm Dialog
  const closeConfirmDialog = () => setIsConfirmOpen(false);

  const deleteArticleHandler = async () => {
    if (articleToDelete) {
      try {
        const res = await deleteArticle(articleToDelete);
        if(res.success){
          toast.success(res.message)
          
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      } finally {
        setArticleToDelete(null); // Reset lại bài viết cần xóa
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const showActions = window.location.pathname === '/feed-management';

  if(isLoading){
    return <div className="w-full mb-8"><Skeleton active/></div>
  } 

  return (
    <>
    <ModalConfirm
      isOpen={isConfirmOpen}
      onClose={closeConfirmDialog}
      onConfirm={() => {
        closeConfirmDialog();
        deleteArticleHandler();
      }}
      title="Xác nhận xóa bài viết"
      message="Bạn có chắc chắn muốn xóa bài viết này không?"
    />

    <div className="">
      {card.map((item) => (
        <React.Fragment key={item.slug}>
          <Link to={`/article/${item.slug}`} className={`flex flex-col max-md:h-full ${showActions ? "border" : "border-l"} box-border
          hover:bg-gray-100 p-2 cursor-pointer`}>
            <div className='py-1 pb-0 w-full flex justify-between'>
              <div className="flex flex-row text-system-blue ext-[14px]">
                <Pin className='size-5 min-w-5 min-h-5 rotate-45' />
                <div className='ml-2 uppercase'>{item.tieude}</div>
              </div>
            </div>
            <div className="flex justify-end sm:mt-[-10px] mt-0">
              <div className="font-normal italic font text-gray-400">
                Ngày đăng {formatDate(item.ngaydang)}
              </div>
            </div>
          </Link>

          {showActions && (
            <div className="flex sm:flex-row sm:w-full flex-col justify-end mb-4">
              <button
                className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
                onClick={() => navigate(`/editing-feed/${item.id}`)}
              >
                Chỉnh sửa
              </button>
              <button
                className="ml-3 bg-red-500 mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
                onClick={() => openConfirmDialog(item.id)}
              >
                Xóa
              </button>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

    </>

  );
};
