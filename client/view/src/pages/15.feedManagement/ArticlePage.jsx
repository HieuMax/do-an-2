// src/App.js

import React from 'react';
import ArticleForm from './ArticleForm';
import { useNavigate } from 'react-router-dom';

function ArticlePage() {

  const navigate = useNavigate()

  return (
    <div className="">
      <main className="p-4">
        <ArticleForm />
        <div className='flex justify-end'>
          <button onClick={() => navigate(-1)} className='mb-10 bg-gray-600 hover:bg-gray-500 mt-2 font-semibold text-white px-4 sm:w-fit w-3/4 py-2 rounded'>Trở về</button>
        </div>
      </main>
    </div>
  );
}

export default ArticlePage;
