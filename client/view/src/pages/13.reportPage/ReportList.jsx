import React, { useEffect, useState } from 'react'
import { getReportProject } from '../../controller/1.projects/project';
import { Loading } from '../../utils/Loading';
import { Badge, Button, Pagination, Table } from 'antd';
import { columns } from './columns';

export const ReportList = ({ prop }) => {
    const [ data, setData ] = useState()
    const [ isLoading, setIsLoading ] = useState(true)
    const [ current, setCurrent ] = useState(1)
    const [ records, setRecords ] = useState()
    const onChangePag = (current) => {
        setIsLoading(true)
        setCurrent(current)
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const projectsData = await getReportProject(prop, current);
                // console.log(projectsData)
                const arr = []
                setRecords(projectsData.records.count)
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
    }, [current])

  return (
    <div>
        {
            isLoading
            ? <Loading />
            : (
                <div className='min-w-full'>
                    <div className="">
                        <Table id='table' columns={columns} pagination={false} dataSource={data} />
                    </div>
                    <div className="my-6">
                        <Pagination align='end' total={records} current={current} onChange={onChangePag}/>
                    </div>
                </div>
            )   
        }
        
    </div>
  )
}
