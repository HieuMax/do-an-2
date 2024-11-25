import React, { useState, useRef, useEffect } from 'react';
import Pagination from './Pagination';
import { FolderOpen, Filter } from "lucide-react";
import * as XLSX from 'xlsx'; // Import thư viện xlsx
import ModalConfirm from '../../components/modal/ModalConfirm';
import { getQuantityOfDocsByID } from '../../controller/1.projects/project';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProjectProcessList = ({ projects, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [docCounts, setDocCounts] = useState({}); // Lưu số lượng tài liệu theo detaiid

  const navigate = useNavigate()

  const listRef = useRef(null);
  const totalBasic = projects.length;
  
  const filteredProjects = projects.filter(
    (project) => statusFilter === "All" || project.trangthai === Number(statusFilter)
  );
  /* ---------- ------------------------------------------------------------------------------------------ ---------- */
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  useEffect(() => {
    const fetchDocCounts = async () => {
      const counts = {};
      for (const project of projects) {
        try {
          const response = await getQuantityOfDocsByID(project.detaiid);
          counts[project.detaiid] = response?.data?.soluong_tailieu || "Lỗi";
        } catch (error) {
          console.error(`Error fetching docs for detaiid ${project.detaiid}:`, error);
          counts[project.detaiid] = "Lỗi";
        }
      }
      setDocCounts(counts);
    };

    fetchDocCounts();
  }, [projects]);





  /* ---------- ------------------------------------------------------------------------------------------ ---------- */

  const getStatusStyles = (status) => {
    switch (status) {
      case 2:
        return { spanColor: "bg-blue-400", textColor: "text-blue-900", text: "Thuyết minh" };
      case 3:
        return { spanColor: "bg-green-400", textColor: "text-green-900", text: "Thực hiện" };
      case 5:
        return { spanColor: "bg-red-400", textColor: "text-red-900", text: "Báo cáo" };
      default:
        return { spanColor: "bg-gray-400", textColor: "text-gray-900", text: "Không xác định" };
    }
  };

  const statusOptions = [
    { value: "All", label: "Tất cả" },
    { value: 2, label: "Thuyết minh" },
    { value: 3, label: "Thực hiện" },
    { value: 5, label: "Báo cáo" },
  ];

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); 
  };



  const exportToExcel = () => {
    const formattedData = filteredProjects.map(project => ({
      "ID Đề tài": project.detaiid,
      "Tên Đề tài": project.tendetai,
      "Sinh viên": project.sinhvienid,
      "Giảng viên": project.giangvienchunhiemid,
      "Hội đồng": project.hoidongphancong || "Chưa có",
      "Trạng thái": project.trangthai
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredProjects');

    let filterName = "InProgress_Projects_All";
    if (statusFilter === "2") {
        filterName = "InProgress_Projects_Elucidate";
    } else if (statusFilter === "3") {
        filterName = "InProgress_Projects_Implementation";
    } else if (statusFilter === "5") {
        filterName = "InProgress_Projects_Report";
    }

    const fileName = `${filterName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  /* ---------- Confirm Dialog ---------- */
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Kiểm soát mở/đóng dialog xác nhận

  // Hàm mở Confirm Dialog
  const openConfirmDialog = () => setIsConfirmOpen(true);

  // Hàm đóng Confirm Dialog
  const closeConfirmDialog = () => setIsConfirmOpen(false);

  const handleSubmitWithConfirmation = () => {
    
    
    openConfirmDialog()
  };

  const onSubmitHandler = () => {
    exportToExcel()
    toast.success("Đề tài đang được tải xuống !!")
  }

  return (
    <div className=''>

    <ModalConfirm
      isOpen={isConfirmOpen}
      onClose={closeConfirmDialog}
      onConfirm={() => {
        closeConfirmDialog();
        onSubmitHandler();
      }}
      title="Xác nhận xuất danh sách đề tài ra file Excel !!"
      message="Bạn có chắc chắn muốn xuất danh sách đề tài này ra file Excel không ?"
    />
      {/* -----------------------------------------------------------------------------------------------*/}
      {/* -------------------------------------- EXPORT EXCEL FILE --------------------------------------*/}
      {/* -----------------------------------------------------------------------------------------------*/}
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-500 pb-4">
        <div className="flex items-center">
          <span className="inline-block w-2.5 h-2.5 bg-gray-500 rounded-full mr-2"></span>
          <h2 className="text-lg font-semibold text-gray-900">Đang thực hiện</h2>
          <span className="ml-2 bg-gray-200 text-gray-500 text-sm font-semibold rounded-full px-2 py-0.5">{totalBasic}</span>
        </div>
        <button 
          className="bg-system text-white px-4 py-2 rounded" 
          onClick={handleSubmitWithConfirmation}
        >
          Xuất file Excel
        </button>
      </div>
      {/* ------------------------------------------------------------------------------------*/}
      {/* -------------------------------------- FILTER --------------------------------------*/}
      {/* ------------------------------------------------------------------------------------*/}
      <div className='flex justify-between items-center '>
        <div className="relative inline-flex items-center border border-gray-400 rounded">
          <Filter className="absolute left-3 text-gray-500 size-5" />
          <select
            className="pl-9 pr-3 py-2 text-gray-700 bg-transparent border-none focus:outline-none w-44"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="font-semibold text-lg">Kết Quả: {filteredProjects.length}</p>
      </div>
      {/* ------------------------------------------------------------------------------------------*/}
      {/* -------------------------------------- PROJECT LIST --------------------------------------*/}
      {/* ------------------------------------------------------------------------------------------*/}
      <div ref={listRef} className="space-y-4 overflow-y-auto h-[500px] mt-6">
        {/* Danh sách đề tài */}
        {currentProjects.map((project) => {
          const { spanColor, textColor, text } = getStatusStyles(project.trangthai);
          return (
            <div className={'bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between items-center sm:flex-row '} key={project.detaiid}>
              <div className='flex flex-col w-full'>
                <div className="flex items-center mb-2 justify-between">
                  <span className={`px-3 py-1 text-sm font-semibold ${spanColor} rounded-full`}>{project.detaiid}</span>
                  <div className='flex justify-center items-center'>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${spanColor}`}></span>
                    <h2 className={`text-sm font-semibold ${textColor}`}>{text}</h2>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{project.tendetai}</h3>
                <p className="text-gray-500 text-sm">Sinh viên thực hiện: {project.sinhvien}</p>
                <p className="text-gray-500 text-sm">Giảng viên hướng dẫn: {project.giangvienchunhiem}</p>
                <div className='flex justify-between items-center'>
                  <p className="text-gray-500 text-sm">Hội đồng phụ trách: {!project.hoidongphancong ? "Chưa có" : project.hoidongphancong}</p>
                  <p className="text-gray-500 text-sm flex justify-center items-center">
                    <FolderOpen className='size-4 mr-2'/>  
                    {docCounts[project.detaiid] || "Đang tải..."} files
                  </p>
                  <button onClick={() => navigate(`/project-view/${project.detaiid}`)} className="bg-gray-300 text-black px-5 py-1 rounded">Xem</button>
                </div>
              </div>
            </div>
          )}
        )}
      </div>
      {/* ----------------------------------------------------------------------------------------*/}
      {/* -------------------------------------- PAGINATION --------------------------------------*/}
      {/* ----------------------------------------------------------------------------------------*/}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectProcessList;
