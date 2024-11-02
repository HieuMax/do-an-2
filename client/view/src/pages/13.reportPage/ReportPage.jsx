import React, { useEffect, useState } from 'react';
import { Alert, Badge, Descriptions, Statistic, Table, Tabs } from 'antd';
import CountUp from 'react-countup';
import { DisplayFileUploaded } from '../../components/project_detail/DisplayFileUploaded';
import { downloadFile, getMarkOfProject, getProjectById, getReportFile } from '../../controller/1.projects/project';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBottomRight from '../../third-party/components/Notification/NotificationBottomRight';
import { Loading } from '../../utils/Loading';
import { ProjectGrading } from '../7.projectGrading/ProjectGrading';
import { columnsReport } from '../../third-party/components/Data Display/columnsDisplayReport';
const formatter = (value) => <CountUp end={value} separator="," />;
export const ReportPage = () => {

  const user = JSON.parse(window.localStorage.getItem('userInfo'))
  const [ reportFile, setReportFile ] = useState()
  const [ project, setProject ] = useState({})
  const navigate = useNavigate();
  const [ items, setItems ] = useState([])
  const [ isLoading, setIsLoading ] = useState(true)
  const location = useLocation();
  const [ dataSource, setDataSource ] = useState()

  const [ data, setData ] = useState()
  const [ total, setTotal ] = useState()
  const [ openModalGrading, setOpenModalGrading ] = useState(false)
  const closeModalGrading = () => setOpenModalGrading(false)

  const accesstoken = 
  { 
    id: user.userId,
    role: user.vaitro=="Student"?"sinhvien" : "giangvien"
  }

  const { detaiId } = location.state 
    ? location.state
    : {detaiId: location.pathname.substring(location.pathname.lastIndexOf('/')+1)}; 
    
  const download = (p) => {
    const filename = p.tailieudexuat?  p.tailieudexuat :  p.tailieupath
    const originalname = p.originalfilename
    downloadFile(filename, originalname).then(
        NotificationBottomRight("Tệp đã được tải")
    )
  }
  


  useEffect(() => {
    setItems([
      { key: '1', label: 'Mã đề tài', span: 1, children: project.detaiid, className:"font-semibold" },
      { key: '2', label: 'Tên đề tài', span: 2, children: project.tendetai, className:"font-semibold" },
      { key: '3', label: 'Lĩnh vực', children: project.linhvuc },
      { key: '4', label: 'Kinh phí (vnđ)', children: <Statistic title="" value={project.kinhphi} precision={2} formatter={formatter} /> },
      { key: '5', label: 'Thời gian thực hiện (tháng)', children: <Statistic title="" value={project.thoigianthuchien} formatter={formatter} /> },
      { key: '6', label: 'Người hướng dẫn', span: 3, className:"font-semibold",  children: 
        (
          <>
            <span className='font-thin text-base'>Họ tên: </span> <span className='text-base'>{project.hotenGV}</span>
            <br />
            <span className='font-thin text-base'>Số điện thoại: </span> <span className='text-base'>{project.sdtGV}</span>
            <br />
            <span className='font-thin text-base'>Email: </span> <span className='text-base'>{project.emailGV}</span>
          </>
        )
      },
      { key: '7', label: 'Trạng thái', children: <Badge status="processing" text="Hoàn thành" size='default'/>, span: 3, },
      { key: '8', label: 'Tài liệu',  children: <DisplayFileUploaded title={"Tài liệu báo cáo"} project={reportFile} download={download}/>, span: 2 },
      { key: '9', label: 'Ngày nộp báo cáo', children: reportFile && reportFile.ngaynop, span: 1, },
      { key: '10', label: 'Sinh viên tham gia thực hiện', span: 3, 
        children: (
          project.data && project.data.length > 0 ?
            project.data.map((item) => (
            <div className="w-full my-3 py-1" key={item.sinhvienid}>
                <span className='font-thin text-base'>Mã số sinh viên: </span> <span className='text-base'> {item.sinhvienid}</span>
                <br />
                <span className='font-thin text-base'>Họ tên: </span> <span className='text-base'>{item.hoten}</span>
                <br />
                <hr />
            </div>
            ))
            : "Không có sinh viên đồng thực hiện"
        )
      },
    ])
    setTimeout(() => setIsLoading(false), [500])
    clearTimeout()
  }, [project])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
          const projectRes = await getProjectById(detaiId);
          setTimeout(() => {
              setProject(projectRes)
          }, 500)
      } catch (error) {
          throw new Error(error)
      }        
    }
    fetchData();

    const fetchReport = async() => {
      const response = await getReportFile(detaiId);
      console.log(response)
      if(response === undefined || (response && response.length < 1)) {
          setReportFile()
      } else {
          setReportFile(response)
      }
    }
    fetchReport();

    const fetchMark = async () => {
      const datajson = {
        userid: accesstoken.id,
        detaiid: detaiId,
        role: accesstoken.role == "giangvien"? "nguoichamdiem" : "sinhvien",
        type: "baocao"
      }
      if(!datajson.type) return
      const response = await getMarkOfProject(datajson);
      if(response.data && response.data.length < 1) {
        setData()
      } else {
        setData(response)
      }
    } 
    fetchMark()
  }, [])

  useEffect(() => {
    if(!data) return
    setDataSource(Array.from(data.data).map((_,item) => ({
      key: item,
      name: _.nguoichamdiem,
      total: _.diemtailieu,
      "diemtc1": _["diemtc1"],
      "diemtc2": _["diemtc2"],
      "diemtc3": _["diemtc3"],
      "diemtc4": _["diemtc4"],
      "diemtc5": _["diemtc5"],
      "diemtc6": _["diemtc6"],
      "diemtc7": _["diemtc7"],
      "diemtc8": _["diemtc8"],
      "diemtc9": _["diemtc9"],
      comment: _.nhanxet
    })))

    const checkPass = () => {
      let count = 0;
      let total = 0;
      Array.from(data.data).forEach((item) => {
        item.diemtailieu >= 60 && count++
        total += item.diemtailieu
      })
      // const checkedSource = dataSource
      // checkedSource.push({
      //   key: "i",
      //   name: "Kết quả",
      //   total: count >=3 ? "Đạt" : "Không đạt"
      // })
      setTotal({ count: count, total: total/5})
    }
    checkPass()

  }, [data])

  return (
    <div className="py-3 px-3 scroll-smooth h-full max-w-full  flex p-3 flex-col gap-4">
      {
        isLoading
          ? <div className="m-auto min-h-full"><Loading /></div>
          : (
            <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold underline">Báo cáo & Nghiệm thu đề tài</h1>
              <div className="inline-flex justify-center rounded-md min-w-16 max-w-fit bg-gray-600 px-3 py-2 cursor-pointer
                  text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500
                  sm:w-auto" onClick={() => navigate(-1)}>
                    Trở về
              </div>
            </div>
            <Descriptions title="Thông tin đề tài báo cáo"  className='w-full text-base' bordered items={items} />
            </>
          )
      }

      { /* Table view all marks */
        dataSource 
          ? 
          <>
            <hr className='my-6' />
            <div className="my-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ">
              <h1 className='text-lg font-medium leading-6 text-gray-900'>Bảng điểm tổng hợp của đề tài</h1>
            </div>
            {/* <h1 className=''>Bảng điểm tổng hợp của đề tài</h1> */}
            <Table
            columns={columnsReport}
            dataSource={dataSource}
            scroll={{
                x: 1500
            }}
            pagination={false}
            rowClassName={"odd:bg-gray-50"}
            // antd site header height
            sticky={{
                offsetHeader: 5,
            }}
            
            />

            <Alert
            className='my-3'
              message="Đề tài đã hoàn tất quy trình và được nghiệm thu"
              description={`Tổng điểm đề tài: ${total.total} - Được ${total.count} / 5 thành viên hội đồng chấm điểm đạt`}
              type="info"
            />
            
          </>
          :
          ( 
            user.vaitro == "Teacher"
              ? (<div className={`w-full flex justify-end gap-4 mt-8`}>
                      <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-base font-semibold text-white cursor-pointer w-fit " onClick={() => setOpenModalGrading(true)}>
                         {/* Grading button */}
                        {
                          data
                          ? "Xem điểm"
                          : "Chấm điểm"
                        }
                      </div>
                      <ProjectGrading open={openModalGrading} close={closeModalGrading} userToken={accesstoken} detaiid={project.detaiid} data={data} form={"Grading-report"}/>
                  </div>)
              : ""
          )
      }
      
    </div>
    );
}
export default ReportPage;