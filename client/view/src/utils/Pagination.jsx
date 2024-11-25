import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { NewCard } from '../components/card/NewCard';
import { useState } from 'react';
// import { InforProjectCard } from '../components/card/InforProjectCard';
import CouncilListCard from '../components/card/CouncilListCard';
import CouncilAssignmentCard from '../components/card/CouncilAssignmentCard';
import TeacherListCard from '../components/card/TeacherListCard';

export default function Pagination({prop, parent, currentPage, setCurrentPage, newsPerPage}) {
  const data = prop;
  if (!prop) return
  const totalPages = prop.length%newsPerPage != 0 ? Math.floor(prop.length/newsPerPage) + 1 : prop.length/newsPerPage

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollTo(top)
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollTo(top)

    }
  };

  const generatePageNumbers = (currentPage, totalPages) => {
    const delta = 2; // Số trang hiển thị trước và sau trang hiện tại
    const range = [];
  
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
  
    if (currentPage - delta > 2) {
      range.unshift('...');
    }
  
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }
  
    range.unshift(1); // Trang đầu tiên
    if (totalPages > 1) range.push(totalPages); // Trang cuối cùng (nếu có nhiều hơn 1 trang)
  
    return range;
  };
  
  return (
    <div className='h-full flex flex-col scroll-smooth '>
      <div className="scroll-smooth">
        <div className="">
          {parent == "Home" && <NewCard prop={currentItems} />}
          {parent == "CouncilListCard" && <CouncilListCard props={currentItems}/>}
          {parent == "CouncilAssignmentCard" && <CouncilAssignmentCard props={currentItems}/>}
          {parent == "TeacherListCard" && <TeacherListCard props={currentItems}/>}
        </div>
      </div>
      <div className="flex  items-center justify-between border-t border-gray-200 w-full bg-white px-4 py-3 sm:px-6 ">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{currentItems.length}</span> of{' '}
              <span className="font-medium">{prop.length}</span> results
            </p>
          </div>
          <div>
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2">
              <a
                onClick={handlePreviousPage}
                // href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
              </a>

              <div className="flex justify-center gap-1">
              {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (page !== '...') {
                      setCurrentPage(page);
                      scrollTo(top);
                    }
                  }}
                  className={
                    currentPage === page
                      ? 'relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-system text-white'
                      : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              </div>
              <a
                href="#top"
                onClick={handleNextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
