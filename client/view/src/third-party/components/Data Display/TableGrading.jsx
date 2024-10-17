import React, { useContext, useEffect, useState } from 'react';
import { InputNumber, Space, Table } from 'antd';
import { MarkContext } from '../../../provider/detailProvider';
import handleTotalMark from '../../../utils/SumArray';

export default function TableGrading ({ props, close, data }) {
    const { handleResMark } = useContext(MarkContext)
    const [mark, setMark] = useState({
        info: Object.values(props).filter((item) => item.STT !== ""), 
        totalMark: "-"
    });
    // useEffect(() => {

    // }, []) 
    useEffect(() => {
        // console.log(data.data[0])
        if (!data) {
          setMark({
              info: Object.values(props).filter((item) => item.STT !== ""),
              totalMark: "-"
          });
        } else {

        }
    }, [close])

    const onChange = (tc) => {
        const TC = mark.info
        const s = TC.filter(item => item.key === tc.key)
        const idx = TC.indexOf(s[0])
        const inp = document.getElementById(`input${tc.key}`).value
        if(Number.parseInt(inp) <= s[0].max && Number.parseInt(inp) > 0) {
            TC[idx].mark = Number.parseInt(inp)
        } else if(Number.parseInt(inp) > s[0].max) {
            TC[idx].mark = s[0].max
        } else {
            TC[idx].mark = 0
        }
        setMark({...mark, info: TC})
        const total = handleTotalMark(mark)
        // console.log(mark.info)
        if(total) {
            setMark({...mark, totalMark: total})
            handleResMark(mark)
        }
    }



    const columns = [
        {
          title: 'STT',
          dataIndex: 'STT',
          key: 'STT',
          align: 'center',
          className: 'font-semibold'
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          className: 'text-base'
        },
        {
          title: 'Điểm tối đa',
          dataIndex: 'max',
          key: 'max',
          align: 'center',
          className: 'text-base'
        },
        {
          title: 'Chấm điểm',
          key: 'grading',
          className: 'text-base',
          align:'center',
          render: (_, record) => (
            <Space size="middle" >
              {
                record.data 
                  ? record.data
                  : record.max == 100 || record.max == 80
                    ? <span>{handleTotalMark()? handleTotalMark() : mark.totalMark}</span> 
                    : <InputNumber min={0} max={record.max} onChange={() => onChange(record)} id={`input${record.key}`} 
                                  value={mark.info[mark.info.indexOf(mark.info.filter(item => item.key === record.key)[0])].mark}
                      />
              }
            </Space>
          ),
        },
      ];

    return(
        <Table columns={columns} dataSource={props} pagination={false}/>
    )
}