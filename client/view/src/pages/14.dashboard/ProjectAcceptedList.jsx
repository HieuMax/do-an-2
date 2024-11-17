import React, { useState, useRef, useEffect } from 'react';
import Pagination from './Pagination';
import { FolderOpen, Filter } from "lucide-react";
import * as XLSX from 'xlsx'; // Import thư viện xlsx
import ModalConfirm from '../../components/modal/ModalConfirm';
import { getQuantityOfDocsByID, getTotalMarksOfProject } from '../../controller/1.projects/project';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProjectAcceptedList = ({ projects, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [scoreFilter, setScoreFilter] = useState("All"); 

  const [docCounts, setDocCounts] = useState({}); 
  const [totalMarks, setTotalMarks] = useState({}); 

  const listRef = useRef(null);
  const totalBasic = projects.length;
  
  const navigate = useNavigate()

  const filteredProjects = projects.filter((project) => {
    const score = totalMarks[project.detaiid] || 0; 
    switch (scoreFilter) {
      case "excellent":
        return score >= 90;
      case "good":
        return score >= 80 && score < 90;
      case "average":
        return score >= 70 && score < 80;
      case "pass":
        return score >= 50 && score < 70;
      case "fail":
        return score < 50;
      default:
        return true; 
    }
  });
  
  

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


// --------------------------------------------------

  const scoreOptions = [
    { value: "All", label: "Tất cả" },
    { value: "excellent", label: "Xuất sắc" },
    { value: "good", label: "Tốt" },
    { value: "average", label: "Khá" },
    { value: "pass", label: "Đạt" },
    { value: "fail", label: "Không đạt" },
  ];



  const handleMarkChange = (event) => {
    setScoreFilter(event.target.value);
    setCurrentPage(1); 
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

    const fetchTotalMarks = async () => {
      const counts = {};
      for (const project of projects) {
        try {
          const response = await getTotalMarksOfProject(project.detaiid);
          counts[project.detaiid] = response?.totalScore || "0";
        } catch (error) {
          console.error(`Error fetching docs for detaiid ${project.detaiid}:`, error);
          counts[project.detaiid] = "0";
        }
      }
      setTotalMarks(counts);
    };

    fetchDocCounts();
    fetchTotalMarks();
  }, [projects]);

  const getScoreLabel = (score) => {
    if (score >= 90) {
      return { label: "Xuất sắc", color: "text-green-600", bgColor: "bg-[#D1FFD6]" };
    } else if (score >= 80) {
      return { label: "Tốt", color: "text-blue-600", bgColor: "bg-[#D6EFFF]" };
    } else if (score >= 70) {
      return { label: "Khá", color: "text-yellow-600", bgColor: "bg-[#FFF8D6]" };
    } else if (score >= 50) {
      return { label: "Đạt", color: "text-orange-600", bgColor: "bg-[#FFEBD6]" };
    } else {
      return { label: "Không đạt", color: "text-red-600", bgColor: "bg-[#FFD6D6]" };
    }
  };
  
  // -------------------------------------------------------------------------------------

  const exportToExcel = () => {
    if (filteredProjects.length === 0) {
      toast.warning("Không có đề tài nào để xuất ra file Excel!"); 
      return
    }
    toast.success("Đề tài đang được tải xuống !!")

    const formattedData = filteredProjects.map(project => ({
      "ID Đề tài": project.detaiid,
      "Tên Đề tài": project.tendetai,
      "Sinh viên": project.sinhvien,
      "Giảng viên": project.giangvienchunhiem,
      "Hội đồng": project.hoidongphancong || "Chưa có",
      "Điểm số": totalMarks[project.detaiid] || "0"
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredProjects');
  
    let filterName = "Completed_Projects_All";
    if (scoreFilter === "excellent") filterName = "Completed_Projects_Excellent";
    else if (scoreFilter === "good") filterName = "Completed_Projects_Good";
    else if (scoreFilter === "average") filterName = "Completed_Projects_Average";
    else if (scoreFilter === "pass") filterName = "Completed_Projects_Pass";
    else if (scoreFilter === "fail") filterName = "Completed_Projects_Fail";
  
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
      <div className="flex justify-between items-center mb-4 border-b-2 border-[#306BA0] pb-4">
        <div className="flex items-center">
          <span className="inline-block w-2.5 h-2.5 bg-gray-500 rounded-full mr-2"></span>
          <h2 className="text-lg font-semibold text-gray-900">Đã hoàn thành</h2>
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
            value={scoreFilter}
            onChange={handleMarkChange}
          >
            {scoreOptions.map((option) => (
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

          const score = totalMarks[project.detaiid] || 0; // Điểm của đề tài
          const { label, color, bgColor } = getScoreLabel(score); // Lấy đánh giá từ hàm
          return (
            <div className={'bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between items-center sm:flex-row '} key={project.detaiid}>
              <div className='flex flex-col w-full'>
                <div className="flex items-center mb-2 justify-between">
                  <span className={`px-3 py-1 text-sm font-semibold ${bgColor} rounded-full`}>{project.detaiid}</span>
                  <div className='flex justify-center items-center'>
                  <div className={`flex justify-center items-center ${bgColor} rounded-md`}>
                    <h2 className={`text-sm font-semibold p-1 px-2 ${color}`}>{label} - {score}/100</h2>
                  </div>
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
                  <button 
                    className="bg-gray-300 text-black px-5 py-1 rounded"
                    onClick={() => navigate(`/report/${project.detaiid}`)}
                  >
                    Xem
                  </button>
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

export default ProjectAcceptedList;
