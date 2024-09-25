import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/dropdown/Dropdown'
import { ListCard } from '../../components/card/ListCard'

export const ProjectList = () => {
    const [list, setList] = useState(0);
    const data = [
        {id: "Project 1", name: "Thiết kees hệ thống", mentor: "Nguyen A", status: 0 },
        {id: "Project 2", name: "Minh hoa hệ thống", mentor: "Nguyen A", status: 1},
        {id: "Project 3", name: "Minh hoa hệ thống 2", mentor: "Nguyen A", status: 2},
        {id: "Project 4", name: "Minh hoa hệ thống 3", mentor: "Nguyen A", status: 3},
        {id: "Project 5", name: "Minh hoa hệ thống 4", mentor: "Nguyen Tran Le Phuong Le", status: 4},
        {id: "Project 6", name: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ab incidunt vel eligendi veritatis, quam pariatur sed dolores. Sed in enim architecto quos alias eveniet laborum ea possimus debitis dolor!", mentor: "Nguyen A", status: 0} 
    ]
    const status = [
        {id: 0 ,name: "Danh sách chưa duyệt"},
        {id: 1 ,name: "Danh sách đã duyệt"},
        {id: 2 ,name: "Danh sách đã nộp đề cương"},
        {id: 3 ,name: "Danh sách đã chấm đề cương"}
    ]
    const updateList = (item) => {
        setList(item.id)
    }
    const [log, setLog] = useState({
        data: data,
        parent: "ListProject"
    })

    useEffect(() => {
        const dataFill = data.filter(item => (item.status === list || (item.status >= 3 && list == 3 )))
        setLog({
            data: dataFill,
            parent: log.parent
        })
    }, [list])

  return (
    <div className="py-3 px-3 h-full ">

        <div className="h-full max-w-full  flex p-3 flex-col">
        <h1 className="text-2xl font-bold underline">Trạng thái đề tài</h1>

            <div className="statusButton py-3">
                <div className="" >
                    <div className="w-fit">
                        <Dropdown prop={status} update={updateList}/>
                    </div>
                    <div className="flex max-md:h-full h-16 mt-3 shadow-md border-r border-b box-border p-3 text-lg">
                        <div className="grid grid-cols-5 gap-4 items-center w-full justify-between px-3">
                            <div className="col-end-1 px-2 font-bold">Mã đề tài</div>
                            <div className="line-clamp-1 font-semibold col-span-2 ">Tên đề tài</div>
                            <div className="line-clamp-1 text-center">Giảng viên hướng dẫn</div>
                            <div className={`flex justify-center text-center p-2 rounded-md`}>
                                Trạng thái
                            </div>
                        </div>
                    </div>
                    <ListCard props={log} />
                </div>
            </div>
        </div>
    </div>
  )

}
