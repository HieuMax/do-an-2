import React, { useContext, useState } from 'react';
import { Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { MarkContext } from '../../../provider/detailProvider';


export const SwitchCom = ({ label, disabled, toggle, data }) => {
    const [ isOpen, setIsOpen ] = useState(true)
    const { handleComment } = useContext(MarkContext)

    const onChange = () => {
        setIsOpen(!isOpen);
    };
    const onChangeComment = (e) => {
        e.preventDefault();
        handleComment(e.target.value)
    }

    return (
        <div className='w-full mt-3 min-h-24'>
            <div className="flex gap-4">
                <span>{label}</span>
                {
                    toggle
                      ? disabled 
                        ? <Switch defaultChecked disabled onChange={onChange} />
                        : <Switch defaultChecked onChange={onChange} />
                      : ""
                }
            </div>
            {
                data && data.data[0]["nhanxet"]
                  ? (<div className="w-full max-w-2xl mt-1 ">
                        <TextArea className='text-base' value={data.data[0]["nhanxet"]}/>
                    </div>)
                  : isOpen 
                    ? (<div className="w-full max-w-2xl mt-1 ">
                        <TextArea className='text-base' placeholder="Nhập lời nhận xét" allowClear onChange={(e) => onChangeComment(e)}/>
                    </div>)
                    : ""
                
            }
        </div>
    )
}
