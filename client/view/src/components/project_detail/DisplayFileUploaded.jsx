import React from 'react'

export const DisplayFileUploaded = ({ title, project, download }) => {
  return (
    <div className=" w-4/5 max-w-7xl max-sm:w-full mb-6">
        <label htmlFor="" className="block text-lg font-medium leading-6 text-gray-900">
           {title} (.doc | .docx | .pdf)
        </label>
        <div className=
        {`
            px-3 w-full rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
        flex items-center justify-between
            `
        }
        >
            <div 
            className="file:hidden"
            id="inputGroupFile02">
                {project && project.originalfilename
                //  ? project && project.map(item => item.originalname + " | ")
                ? project && project.originalfilename
                : "Không có tệp nào được chọn"
                }
            </div> 
            <label className={` input-group-text`} htmlFor='inputGroupFile02'>
                <div className="" onClick={() => download(project)}>
                    <div className="bg-system text-center px-3 py-2 rounded-xl shadow-xl text-lg 
                        font-semibold text-white cursor-pointer w-fit m-auto">
                        Download
                    </div>
                </div>
            </label>
        </div>
    </div>
  )
}
