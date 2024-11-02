import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';
import { getMarkOfProject } from '../../../controller/1.projects/project';
import { columnsRecom } from './columnsDisplayRecom';
import { columnsPresent } from './columnsDisplayPresent';

const columns = [columnsRecom, columnsPresent]

const TableViewMarks = ({ open, close, userToken, detaiid, data, form, colIdx }) => {
  const [ dataSource, setDataSource ] = useState([])
  const [ mark, setMark ] = useState()
  
  useEffect(() => {
    const fetchMark = async () => {
        const datajson = {
          userid: JSON.parse(window.localStorage.getItem('userInfo')).userId,
          detaiid: detaiid,
          role: JSON.parse(window.localStorage.getItem('userInfo')).vaitro == "Teacher"? "nguoichamdiem" : "sinhvien",
          type: colIdx == 0 ? "dexuat" : colIdx == 1 ? "thuyetminh" : "baocao"
        }
        try {
          // console.log(datajson)
          if(!datajson.type) return
          const response = await getMarkOfProject(datajson);
          if(response.data.length < 1) {
            setMark()
          } else {
            setMark(response)
          }
        } catch (error) {
          
        }
      } 
      fetchMark()
  }, [colIdx])

  useEffect(() => {
    if(!mark) return
    setDataSource(Array.from(mark.data).map((_,item) => ({
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
      // "diemtc9": _["diemtc9"] && _["diemtc9"],
      comment: _.nhanxet
    })))
  }, [mark])

  useEffect(() => {

    if(!mark) return
    const checkPass = () => {
      let count = 0;
      Array.from(mark.data).forEach((item) => item.diemtailieu >= 60 && count++)
      const checkedSource = dataSource
      checkedSource.push({
        key: "i",
        name: "Kết quả",
        total: count >=3 ? "Đạt" : "Không đạt"
      })
    }
    checkPass()
  }, [dataSource])

  return (
    <div className="">
        <Dialog open={open} onClose={() => close()} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
    
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in 
                    sm:my-8 sm:w-full sm:max-w-7xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 "
                  >
                    <div className="p-3 my-3">
                      <X className='float-end' onClick={() => close()}/>
                      <Table
                          columns={columns[colIdx]}
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
                    </div>
                  </DialogPanel>
                </div>
            </div>
    
        </Dialog>

    </div>
  );
};
export default TableViewMarks;