import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import ProjectProcessList from './ProjectProcessList';
import ProjectAcceptedList from './ProjectAcceptedList';
import * as XLSX from 'xlsx';
import { ResponsiveContainer } from 'recharts';
import { Filter, ChartLine } from "lucide-react";
import { getAllProjectsDashboard } from '../../controller/1.projects/project';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [yearFilter, setYearFilter] = useState('Năm Nay');
  const [projectLength, setProjectLength] = useState(0)

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const [processData, setProcessData] = useState({})
  const [filterProcessData, setFilterProcessData] = useState({})

  const [acceptedData, setAcceptedData] = useState({})
  const [filterAcceptedData, setFilterAcceptedData] = useState({})
  
  const getArticlesData = async () => {
    try {
      const response = await getAllProjectsDashboard();
      if (response) {

        const filteredPieData = processPieChartData(response.detai);
        const filteredBarData = processBarChartData(response.detai);
        setPieData(filteredPieData);
        setBarData(filteredBarData) ;

        const filteredProcessData = filterDeTaiInProgress(response.detai);
        const filteredAcceptedData = filterDeTaiAccepted(response.detai);
        setProcessData(filteredProcessData);
        setAcceptedData(filteredAcceptedData);  

      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticlesData();
  }, []);

  // Hàm xử lý dữ liệu cho PieChart
  const processPieChartData = (data) => {
    const fields = ["KT", "CNTT", "MT", "Khác"];
    const totalKinhPhi = { "KT": 0, "CNTT": 0, "MT": 0, "Khác": 0 };

    data.forEach(({ linhvuc, kinhphi }) => {
      const kinhPhiNumber = parseFloat(kinhphi);
      const key = fields.includes(linhvuc) ? linhvuc : "Khác";
      totalKinhPhi[key] += kinhPhiNumber;
    });

    return fields.map((key) => ({
      name: key,
      value: totalKinhPhi[key],
      color: generateColor(key),
    }));
  };

  // Hàm xử lý dữ liệu cho BarChart
  const processBarChartData = (data) => {
    const fields = ["KT", "CNTT", "MT", "Khác"];
    const countByField = { "KT": 0, "CNTT": 0, "MT": 0, "Khác": 0 };

    data.forEach(({ linhvuc }) => {
      const key = fields.includes(linhvuc) ? linhvuc : "Khác";
      countByField[key] += 1;
    });

    return fields.map((key) => ({
      name: key,
      value: countByField[key],
      color: generateColor(key),
    }));
  };

  const filterDeTaiInProgress = (deTaiList) => {
    const validStatuses = [2, 3, 5];
     return deTaiList
    .filter(deTai => validStatuses.includes(deTai.trangthai))
    .sort((a, b) => {
      const numA = parseInt(a.detaiid.replace('DT', '')); 
      const numB = parseInt(b.detaiid.replace('DT', '')); 
      return numA - numB; 
    });
  };
  
  const filterDeTaiAccepted = (deTaiList) => {
    const validStatuses = [6];
     return deTaiList
    .filter(deTai => validStatuses.includes(deTai.trangthai))
    .sort((a, b) => {
      const numA = parseInt(a.detaiid.replace('DT', '')); 
      const numB = parseInt(b.detaiid.replace('DT', '')); 
      return numA - numB; 
    });
  };

  // Hàm generateColor giữ nguyên
  const generateColor = (field) => {
    const colors = {
      'KT': '#306BA0',
      'CNTT': '#D58D49',
      'MT': '#7BD785',
      'Khác': '#292D32',
    };
    return colors[field] || '#ccc';
  };

  const projects = [
    { id: "DT01", title: "Thiết kế hệ thống quản lý đề tài nghiên cứu", status: "Xét duyệt", student: "Tommy Xiaomi", teacher: "Nguyễn Văn A", council: "Chưa có", kinhphi: 10 },
    { id: "DT02", title: "Thiết kế hệ thống quản lý đề tài nghiên cứu", status: "Thuyết minh", student: "Tommy Xiaomi", teacher: "Nguyễn Văn A", council: "Chưa có" },

  ];

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data); 
    const workbook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects'); 
    XLSX.writeFile(workbook, 'Projects.xlsx'); // Ghi workbook ra file Excel
  };
  



  return (
    <>


    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Tổng kinh phí cho các dự án */}
        <div className="bg-white border-t shadow-gray-400 shadow-md rounded-lg p-6">
          <div className='border-b-[0.5px] border-gray-200 m-[-24px]'>
            <h1 className='py-2 text-xl font-semibold px-6'>Tổng kinh phí cho các dự án</h1>
          </div>
          <div className="flex justify-between items-center mb-4 mt-11">
            <div className='p-2'>
              <h2 className="text-lg text-gray-500 font-medium">Tổng kinh phí cho các dự án</h2>
              <p className="text-lg font-bold">120.000.000 vnđ</p>
            </div>
            <div className="relative inline-flex items-center border rounded border-gray-400">
              <Filter className="absolute left-3 text-gray-500 size-5" />
              <select
                className="pl-9 pr-3 py-2 text-gray-700 bg-transparent border-none focus:outline-none"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="All Time">All Time</option>
                <option value="Last Year">Last Year</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between flex-col md:flex-row items-center md:items-start">
            <ResponsiveContainer width="100%" height={250}  >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} vnđ`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="md:ml-8 mt-6 md:mt-0 md:w-4/5">
              <p className="text-lg font-medium mb-2">Lĩnh vực</p>
              <ul>
                {pieData.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span
                      className="inline-block w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Số lượng đề tài đăng ký mới */}
        <div className="bg-white border-t shadow-gray-400 shadow-md rounded-lg p-6">
          <div className='border-b-[0.5px] border-gray-200 m-[-24px]'>
            <h1 className='py-2 text-xl font-semibold px-6'>Số lượng đề tài đăng ký mới</h1>
          </div>
          <div className="flex justify-between items-center  mt-11">
            <div className='p-2'>
              <h2 className="text-lg text-gray-500 font-medium">Tổng số đề tài đăng ký mới</h2>
              <p className="text-lg font-bold">{projectLength} đề tài</p>
            </div>
            <div className="relative inline-flex items-center border rounded border-gray-400">
              <Filter className="absolute left-3 text-gray-500 size-5" />
              <select
                className="pl-9 pr-3 py-2 text-gray-700 bg-transparent border-none focus:outline-none"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="All Time">All Time</option>
                <option value="Last Year">Last Year</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>
          <div className='p-2 py-0 flex justify-start items-center'>
            <div className='bg-[#75B07B] size-6 flex items-center justify-center rounded'>
              <ChartLine className=' text-[#FFFFFF] size-5' />

            </div>
            <p className="text-green-600 ml-2">Tăng 83.86% so với năm trước</p>

          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart className="ml-[-35px] mt-4" data={barData}>
              <CartesianGrid vertical={false} strokeWidth={1} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 36]} /> {/* Giới hạn tối đa của Y là 20 */}
              <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [`${value} đề tài`, '']} />
              <Bar dataKey="value" barSize={10} label={{ position: 'top' }}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 mt-8">Danh sách đề tài</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Đang thực hiện */}
        <div className=" border-t shadow-gray-400 shadow-md rounded-lg p-6 bg-white">  
          {/* Danh sách đề tài */}
          {processData.length > 0 && <ProjectProcessList projects={processData} itemsPerPage={6} />}
        </div>

        {/* Đã hoàn thành */}
        <div className=" border-t shadow-gray-400 shadow-md rounded-lg p-6 bg-white">  
          {/* Danh sách đề tài */}
          {processData.length > 0 && <ProjectAcceptedList projects={acceptedData} itemsPerPage={6} />}
        </div>
      </div>

    </div>
    </>

  );
};

export default DashboardPage;
