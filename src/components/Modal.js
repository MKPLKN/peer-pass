import { Fragment } from 'react'
import { Transition } from '@headlessui/react'

export default function Modal ({ open, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <div
        class='relative z-10'
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div class='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div class='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-md sm:p-6'
            >
              <div class=''>{children}</div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition.Root>
  )
}
