// Pagination.jsx
import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center gap-6 justify-center mt-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`p-[6px] rounded-lg border ${currentPage === 1 ? "border-slate-400" : "border-black"} transition-transform duration-300 ease-in-out hover:scale-105`}
      >
        <ArrowLeftIcon strokeWidth={2} className={`h-4 w-4 ${currentPage === 1 ? "text-slate-400" : ""}`} />
      </button>
      <p className="font-medium text-gray-500 transition-opacity duration-300 ease-in-out animate-fade">
        Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
        <strong className="text-gray-900">{totalPages}</strong>
      </p>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`p-[6px] rounded-lg border ${currentPage === totalPages ? "border-slate-400" : "border-black"} transition-transform duration-300 ease-in-out hover:scale-105`}
      >
        <ArrowRightIcon strokeWidth={2} className={`h-4 w-4 ${currentPage === totalPages ? "text-slate-400" : ""}`} />
      </button>
    </div>

    
  );
};

export default Pagination;
