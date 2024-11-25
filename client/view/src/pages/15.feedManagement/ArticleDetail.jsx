import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { getArticleBySlug } from '../../controller/8.articles/article';
import 'react-quill-new/dist/quill.snow.css';
import parse from "html-react-parser";
import { useNavigate } from 'react-router-dom';

const ArticleDetail = () => {

    
    const {slug} = useParams();
    const [content, setContent] = useState('')

    const [content2, setContent2] = useState('')
    const getArticleData = async () => {
        try {
        
            const response = await getArticleBySlug(slug);
            if(response) {           
                setContent(response.data)       
                setContent2(response.data.content)   
            } else {
                console.log("error")
            }
        } catch (error) {
            console.log(error)

        } 
    }
    const navigate = useNavigate()
    
    useEffect(() => {
        getArticleData()
    },[slug])


  return (
    <div>
      <div className="Article-view w-full  p-8 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <h2 className="text-2xl font-bold border-b border-gray-400 pb-2 mb-5">
        {content.tieude}
        </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <p>{content.mota}</p>
            </div>
          <div className="sm:col-span-full">
            <div className="ql-snow">
              <div className="ql-editor p-0" >
                {content2 ? parse(content2) : 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <button onClick={() => navigate(-1)} className='mb-10 bg-gray-600 hover:bg-gray-500 mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded'>Trở về</button>
      </div>
    </div>

  )
}

export default ArticleDetail
