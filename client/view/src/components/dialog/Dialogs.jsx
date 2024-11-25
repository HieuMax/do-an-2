import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserPlus } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'
import { getStudentsById } from '../../controller/4.students/students'

const data = {
    title: "Thêm thành viên",
}


export default function DialogCom({props, handleList, memList}) {
  const [open, setOpen] = useState(false)
  const [prevent, setPrevent] = useState(true)

  const [member, setMember] = useState({})
  useEffect(() => {
    if (prevent) {
        setPrevent(false);
        return
    }
    setOpen(!open)
  }, [props])

  const [input, setInput] = useState(false);
  const [valid, setValid] = useState(true);
  const [exist, setExist] = useState(false);
  const [mem, setMem] = useState();
 
  const [value, setValue] = useState()

  const [openModal, setOpenModal] = useState(false);

  const handleChange = (item) => {
    setValue(item)
  }

  // get data from fetch with skeleton loading
  const handleSearch = async () => {
    if (!value) return
    const mem = await fetchData();
    if (mem.sinhvienid) {
        setValid(true)
        setInput(true)
        setMember(mem)
    } else {
        setInput(true)
        setValid(false)
    };
  }

  const fetchData = async() => {
    if (!value) return
    const validValue = await getStudentsById(value)
    // console.log(validValue)
    return validValue.sinhvien
  }


  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
        onCloseForm();
    }, 300)
    clearTimeout();
  }

  const handleAdd = () => {
    const mem = member;
    const obj = memList.filter((item) => item.sinhvienid === mem.sinhvienid)
    if(obj.length > 0) {
        setExist(true);
    } else setExist(false);
    setOpenModal(true)
  }
  const closeModal = () => setOpenModal(false)
  
  const isConfirm = () => {
    const mem = member;
    const memArr = memList.filter((item) => item !== mem)
    memArr.push(mem)
    handleList(memArr)
    handleClose();
  }

  const searchedMember = {
    valid: valid,
    input: input,
    exist: exist
  }

  const onCloseForm = () => {
    setValid(true)
    setInput(false)
    setExist(false)
    setValue()
    setMem();
  }

  useEffect(() => {

  }, [memList])

  
  return (
    <div className="">
        <Dialog open={open} onClose={() => handleClose()} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-system sm:mx-0 sm:h-10 sm:w-10">
                                <UserPlus aria-hidden="true" className="h-6 w-6 text-white" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                    {data.title}
                                </DialogTitle>
                                <div className="my-2 w-full">
                                    <div className="mt-3">
                                        <label htmlFor="" className="block text-base font-medium leading-6 text-gray-900">
                                            Mã số sinh viên 
                                        </label>
                                        <div className="flex items-center w-full justify-between flex-wrap">
                                            <input
                                                id='idMember'
                                                placeholder='Nhập mã số sinh viên'
                                                onChange={(e) => handleChange(e.target.value)}
                                                className={`
                                                    ${(input && valid) && "bg-green-200 ring-green-500 "} sm:w-2/3 block px-3 w-full rounded-md py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6
                                                    `}
                                            />
                                            
                                            <div onClick={() => handleSearch()} className=
                                            "mt-3 cursor-pointer min-w-16 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-2 sm:w-auto">
                                                Tìm
                                            </div>
                                            <span className={
                                                `${valid
                                                    ? "hidden"
                                                    : "sm:block"
                                                }
                                                text-red-500
                                                `
                                            }>Không tìm thấy, vui lòng thử lại.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`
                                    ${(valid && input) ? "block" : "hidden"}
                                    w-full text-base mt-6  
                                    `}>
                                    <hr className='my-3'/>
                                    <span className='font-semibold'>Thông tin thành viên</span>
                                    <div className="mt-6 flex flex-col">
                                        <span className='text-gray-400'>Họ tên</span>
                                        <span>{member.hoten}</span>
                                    </div>
                                    <div className="mt-6 flex flex-col">
                                        <span className='text-gray-400'>Lớp</span>
                                        <span>{member.class}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-6">
                        <button
                            type="button"
                            onClick={() => handleAdd()}
                            className="inline-flex min-w-16 w-full justify-center rounded-md bg-system px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-system-500 sm:ml-3 sm:w-auto"
                        >
                            Thêm
                        </button>
                        <div className="hidden">
                            <ConfirmDialog open={openModal} close={closeModal} isConfirm={isConfirm} props={searchedMember}/>
                        </div>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => handleClose()}
                            className="mt-3 inline-flex min-w-16 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Hủy
                        </button>
                    </div>
                </DialogPanel>
                </div>
            </div>
        </Dialog>
    </div>
  )
}
