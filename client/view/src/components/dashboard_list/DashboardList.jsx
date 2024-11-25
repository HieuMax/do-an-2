import React, { useEffect, useState } from 'react'
import { ListCard } from '../../components/card/ListCard'
import axios from 'axios'
import { getAllArticle } from '../../controller/8.articles/article'
import { useAuthStore } from '../../api/authStore'
import { useNavigate } from 'react-router-dom'

const DashboardList = () => {
  
  const [card, setCard ] = useState('')
  const {user} = useAuthStore();
  const getArticlesData = async () => {
    try {
        const response = await getAllArticle();
       
        if(response) {           
            setCard(response)
        } else {
            console.log("error")
        }
        
    } catch (error) {
        console.log(error)

    } 
  }
  const showActions = window.location.pathname === '/feed-management';

  const navigate = useNavigate()

  useEffect(() => {
    getArticlesData()
  },[])

  const Log = {
    data: card,
    parent: "DashBoardList"
  }

  return (
    <div className="p-6 px-7 h-full">
        <div className="flex sm:flex-row sm:w-full flex-col justify-between mb-4">

          <h1 className="text-2xl font-bold underline">Tin tức mới</h1>
          
          {user.vaitro === "Admin" && showActions && 
          (
            <button 
              className="bg-system mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded"
              onClick={() => navigate('/adding-feed')}
            >
              Thêm bài viết mới
            </button>
          )}
        </div>
        

        <div className="h-full mt-6 max-w-full">
          <ListCard props={Log}/>
          {/* <PaginationCustom /> */}
        </div>
    </div>
  )
}

export default DashboardList