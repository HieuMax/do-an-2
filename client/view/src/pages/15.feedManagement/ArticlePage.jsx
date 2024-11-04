// src/App.js

import React from 'react';
import ArticleForm from './ArticleForm';

function ArticlePage() {
  return (
    <div className="">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">Quản Lý Bài Viết</h1>
      </header>
      <main className="p-4">
        <ArticleForm />
      </main>
    </div>
  );
}

export default ArticlePage;
