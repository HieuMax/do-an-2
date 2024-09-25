import React from 'react'

export const NewCard = ({prop}) => {
  const card = prop;
  return (
    <div className=''>
      {card.map((item) => (
        <div className="flex max-md:h-full h-48 mt-3 shadow-md border-r border-b box-border
          hover:bg-gray-100 p-3 cursor-pointer
            " 
            key={item.name}>
          <img src="/view/src/assets/logo.webp" alt="" className='w-4/12 h-auto m-auto max-w-sm'/>
          <div className='py-3 px-6 w-full flex flex-col justify-between'>
            <div className="">
              <div className='text-activity bg-activity w-fit p-1'>{item.activity}</div>
              <div className='font-bold text-xl my-3'>{item.title}</div>
              <div className="max-lg:line-clamp-1 line-clamp-2">
                {item.content}
              </div>
            </div>
            <div className="flex justify-between max-md:flex-col">
              <div className="font-semibold">
                Tác giả: {item.author}
              </div>
              <div className="font-semibold">
                {item.publishDate}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
