import React, { useEffect, useState } from 'react'
import { getReportProject } from '../../controller/1.projects/project';
import { Loading } from '../../utils/Loading';
import ReportListCard from '../../components/card/ReportListCard';
import { Badge, Button } from 'antd';

export const ReportListPending = () => {
    const [ data, setData ] = useState()
    const [ isLoading, setIsLoading ] = useState(true)
    useEffect(() => {
        async function fetchData() {
            try {
                const projectsData = await getReportProject(5);
                const arr = []
                projectsData.detai.forEach((item) => {
                    const obj = {
                        key: item.detaiid,
                        name: item.tendetai,
                        id: item.detaiid,
                        status: item.trangthai == 5 
                                ? <Badge status="default" text="Chưa chấm điểm" size='default'/> 
                                : <Badge status="processing" text="Hoàn thành" size='default'/> ,
                        detail: <Button color="default" href={`/report/${item.detaiid}`}>Xem chi tiết</Button>
                    }
                    arr.push(obj)
                })
                setData(arr)
                setIsLoading(false)
            } catch (error) {
                throw new Error(error)
            }
        }
        fetchData();
    }, [])


  return (
    <div>
        {
            isLoading
            ? <Loading />
            : <ReportListCard props={data}/>
        }
        
    </div>
  )
}
