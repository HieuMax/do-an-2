import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'


export const ComboboxCom = ({props}) => {
  const data = props

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(data[0])

  const filteredData =
    query === ''
      ? data
      : data.filter((data) => {
          return data.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="h-full">
      <Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
        <div className="relative ">
          <ComboboxInput
            className={clsx(
              'w-full  rounded-lg border-2 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            )}
            displayValue={(data) => data?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-5 group-data-[hover]:fill-gray-500" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[var(--input-width)] rounded-xl  border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {filteredData.map((data) => (
            <div className="hover:text-white" key={data.id}>
              <ComboboxOption
                key={data.id}
                value={data}
                className="group flex cursor-default bg-white items-center gap-2 rounded-lg  hover:bg-[#306BA0] hover:text-white"
              >
                <div className="flex items-center gap-2 hover:bg-[#306BA0] hover:text-white w-full py-1.5 px-3 group-data-[selected]:bg-gray-300 group-data-[selected]:hover:bg-[#306BA0]">
                  <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                  <span className="text-sm/6 ">{data.name}</span>
                </div>
              </ComboboxOption>
            </div>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}