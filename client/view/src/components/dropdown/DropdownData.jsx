import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useContext, useEffect, useState } from 'react'
import DepartmentContext from '../../provider/detailProvider';

const parents = ["Project Detail - 1", "Project Detail"]

export default function DropdownData({prop, update, parent, depended}) {
  
  const {
    state: { departments, staffs },
    dispatch,
  } = useContext(DepartmentContext)

  const data = prop
  const [option, setOption] = useState();

  // const handleOption = () => {
  //   if(!data) return
  //   if(parent == parents[0]) setOption(departments[0]);
  //   else if (parent == parents[1] ) setOption(staffs[0] ? staffs[0].hoten : "");
  // }

  const parseOption = (item) => {
    switch(parent) {
      case parents[0]:
        return item.tenkhoa;
      case parents[1]:
        return item.hoten;
      default:
        return;
    }
  }


  useEffect(() => {
    if (!data) return
    setOption(parseOption(data[0]));
  }, [departments, staffs])

  const handleChangeOption = (item) => {
    // const changeOption = parseOption(item);
    // if(changeOption === option) return
    // setOption(changeOption)
    // update(changeOption)
  }

  // const data = {
  //   mota: mota,
  //   tenkhoa,
  //   thanh: thanhvien
  // }

  const parseName = (item, obj) => {
    if (!item) return
    if (parent == parents[0]) {
      switch (obj) {
        case "name":
          return item.tenkhoa ? item.tenkhoa : item
        case "id":
          return item.khoaid
      }
    } else if(parent == parents[1]) {
      switch (obj) {
        case "name":
          return item.hoten ? item.hoten : item
        case "id":
          return item.giangvienid
      }
    }
  }


  return (
    <Menu as="div" className="relative inline-block text-left lg:text-lg w-full">
      <div className="">
        <MenuButton className={`
        ${ parent
            ? ""
            : "text-white bg-system"
         } 
        justify-between inline-flex w-full gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300`}>
          {
            data && data.length > 0 
            ? option
            : ""
          }
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition 
        className=
        {`absolute cursor-pointer z-10 mt-2 w-56 origin-top-right rounded-md bg-white 
        shadow-lg ring-1 ring-black ring-opacity-5 transition 
        focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 
        data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in
        `}
        
      >
        <div className="py-1">
            { data && data.length > 0 
                ?
                data.map(item => {
                  return (
                      <div className="" 
                           key={
                            parseName(item, "id")
                           }
                      >
                        <MenuItem>
                          <a
                          onClick={() => handleChangeOption(item)}
                          className={`
                            ${item && 
                                (parseName(item, "name") === parseName(option, "name")) 
                              ? "bg-gray-300"
                              : ""
                            }
                            block px-4 py-2 text-sm text-gray-700 
                            data-[focus]:bg-system data-[focus]:text-white
                            `}
                          >
                          {
                            parseName(item, "name") 
                          }
                          </a>
                        </MenuItem>
                      </div>
                  )
                })
                : 
                <div className="">
                  <MenuItem>
                    <a className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-system data-[focus]:text-white'
                      onClick={() => setOption("Không có dữ liệu")}
                    >
                      Không có dữ liệu
                    </a>
                  </MenuItem>
                </div>
            }
            
        </div>
      </MenuItems>
    </Menu>
  )
}
