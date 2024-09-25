import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'

export default function Dropdown({prop, update, parent, defaultOption}) {
  const data = prop
  const [option, setOption] = useState(data[0]);

  const handleChangeOption = (item) => {
    if(item === option) return
    setOption(item)
    update(item)
  }
  useEffect(() => {
    if (defaultOption) {
      setOption(defaultOption)
      // console.log(defaultOption)
    }    
  }, [defaultOption])
  return (
    <Menu as="div" className="relative inline-block text-left lg:text-lg w-full">
      <div className=''>
        <MenuButton className={`${
          parent
            ? ""
            : "text-white bg-system"
        } justify-between inline-flex w-full gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300
        `}>
          {option.name}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition 
        className="absolute cursor-pointer z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
            {
                data.map(item => {
                  return (
                      <div className="" key={item.id}>
                          <MenuItem>
                              <a
                              onClick={() => handleChangeOption(item)}
                              className={`
                                ${item.name === option.name
                                  ? "bg-gray-300"
                                  : ""
                                }
                                block px-4 py-2 text-sm text-gray-700 
                                data-[focus]:bg-system data-[focus]:text-white
                                `}
                              >
                              {item.name}
                              </a>
                          </MenuItem>
                      </div>
                  )
                })
            }
            
        </div>
      </MenuItems>
    </Menu>
  )
}
