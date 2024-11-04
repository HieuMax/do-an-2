import React, { useCallback, useContext, useEffect, useState } from 'react'
import Dropdown from '../../components/dropdown/Dropdown'
import { ListCard } from '../../components/card/ListCard'
import { getAllProjects } from '../../controller/1.projects/project';
import ProjectsContext from '../../provider/projectProvider';
import { Loading } from '../../utils/Loading';
import { InforProjectCard } from '../../components/card/InforProjectCard';
import { Pagination } from 'antd';

export const ProjectList = () => {
    // const [list, setList] = useState(0);
    const [ isLoading, setIsLoading ] = useState(true)
    const [ current, setCurrent ] = useState(1)
    const [ records, setRecords ] = useState()
    const onChangePag = (current) => {
        setIsLoading(true)
        setCurrent(current)
    }
    const {
        state: { projects, list },
        dispatch,
    } = useContext(ProjectsContext);

    useEffect(() => {
        setIsLoading(true)
        async function fetchData() {
            try {
                const projectsData = await getAllProjects(list, current);
                console.log(projectsData)
                setRecords(projectsData.records.count? projectsData.records.count :projectsData.records)
                setTimeout(() => {
                    dispatch({ 
                        type: "LOADED_PROJECTS",
                        payload: projectsData
                    })
                    dispatch({
                        type: "CHANGED_LIST",
                        payload: list
                    })
                    setIsLoading(false)
                }, 1000)
                clearTimeout();
            } catch (error) {
                throw new Error(error)
            }
        }
        fetchData();
    }, [dispatch, current, list])


    const status = [
        {id: 0 ,name: "Danh sách chưa duyệt"},
        {id: 1 ,name: "Danh sách đã duyệt"},
        {id: 2 ,name: "Danh sách đã nộp đề cương"},
        {id: 3 ,name: "Danh sách đã chấm đề cương"}
    ]

    const updateList = (item) => {
        dispatch({
            type: "CHANGED_LIST",
            payload: item.id
        })
    }
    
    // const [log, setLog] = useState({
    //     data: projects? projects.detai: [],
    //     parent: "ListProject"
    // })

    useEffect(() => {
        setIsLoading(true)
    }, [list])

    // useEffect(() => {
    //     console.log(isLoading)
    // }, [isLoading])


  return (
    <div className="py-3 px-3 h-full ">

        <div className="h-full max-w-full  flex p-3 flex-col">
        <h1 className="text-2xl font-bold underline">Trạng thái đề tài</h1>

            <div className="statusButton py-3">
                <div className="" >
                    <div className="w-fit">
                        <Dropdown prop={status} update={updateList}/>
                    </div>
                    <div className="flex max-md:h-full h-16 mt-3 shadow-md border-r border-b box-border p-3 text-lg max-lg:hidden">
                        <div className="grid grid-cols-5 gap-8 items-center w-full justify-between px-3">
                            <div className="px-2 font-bold ">Mã đề tài</div>
                            <div className="line-clamp-1 font-semibold col-span-2 ">Tên đề tài</div>
                            <div className="line-clamp-1 xlp:text-center ">Giảng viên hướng dẫn</div>
                            <div className={`flex justify-center text-center p-2 rounded-md`}>
                                Trạng thái
                            </div>
                        </div>
                    </div>

                    {
                        !isLoading
                        ? 
                        (
                            <>
                                <InforProjectCard props={projects.detai}/>
                                <div className="my-6"><Pagination align='end' total={records} current={current} onChange={onChangePag}/></div>
                            </>
                        )
                        : <Loading />
                    }
                </div>
            </div>
        </div>
    </div>
  )

}
