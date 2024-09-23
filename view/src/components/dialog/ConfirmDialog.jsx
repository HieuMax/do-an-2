import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

export default function ConfirmDialog({open, close, isConfirm, props}) {
  let [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
    close()
  }
  const onClickConfirm = (status) => {
    isConfirm(status)
    closeModal();
    console.log('click ')
  }
  
  // useEffect(() => {
  //   closeModal();

  // }, [isConfirm])

  function openModal() {
    setIsOpen(true)
  }

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Xác nhận thêm thành viên
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {props.valid && props.input
                        ? "Thành viên này sẽ được thêm vào thực hiện đề tài "
                        : "Lỗi"
                      }
                      
                    </p>
                  </div>

                  <div className="mt-4 justify-center gap-4 flex">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md min-w-16 w-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => closeModal()}  
                    >
                      {props.valid && props.input
                        ? "Hủy"
                        : "Xác nhận"
                      }
                    </button>
                    <button
                      type="button"
                      className={`
                        ${props.valid && props.input
                          ? "block"
                          : "hidden"
                        }
                        inline-flex justify-center rounded-md border border-transparent bg-system px-4 py-2 text-sm font-medium text-white hover:bg-system focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                        `}
                      onClick={() => onClickConfirm(true)}
                    >
                      Xác nhận
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

