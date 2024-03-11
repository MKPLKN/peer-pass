import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import PasswordGenerator from './PasswordGenerator'
import { ExclamationTriangleIcon, KeyIcon } from '../icons'
import { classNames } from '../helpers'

export default function PasswordForm ({
  passwordData,
  onChange,
  onSubmit,
  onDeletion,
  error,
  options
}) {
  const navigate = useNavigate()
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)

  const canDelete = () => options?.canDelete || false

  function cancelOnClick () {
    navigate('/passwords')
  }

  function onGeneratePassword (e) {
    e.preventDefault()
    setOpen(true)
  }

  const handleChange = (e) => {
    onChange(e)
  }

  function fillPassword () {
    setOpen(false)
    handleChange({ target: { name: 'password', value: generatedPassword } })
  }

  function onWebsiteChange (index, event) {
    const newWebsites = [...passwordData.websites]
    newWebsites[index] = event.target.value
    handleChange({ target: { name: 'websites', value: newWebsites } })
  }

  // @TODO: Allow users CRUD many websites
  // - if user has > 1 site the "launch site" icon on the index page should show a list of sites
  function addWebsiteField () {
    const newWebsites = [...passwordData.websites, '']
    handleChange({ target: { name: 'websites', value: newWebsites } })
  }

  function removeWebsiteField (index) {
    const newWebsites = passwordData.websites.filter((_, i) => i !== index)
    handleChange({ target: { name: 'websites', value: newWebsites } })
  }

  // Deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [delConfirmation, setDelConfirmation] = useState('')
  function openDeleteModal (e) {
    e.preventDefault()
    setDeleteModalOpen(true)
  }
  function handleDeletion (e) {
    onDeletion(e)
  }

  return (
    <div>
      {/* DELETE PASSWORD MODAL START */}
      <Modal open={deleteModalOpen}>
        <div class='bg-white sm:w-full sm:max-w-xl'>
          <div>
            <div class='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
              <ExclamationTriangleIcon
                className='h-10 w-10 text-red-600'
                aria-hidden='true'
              />
            </div>
            <div class='mt-3 text-center sm:mt-5'>
              <div class='text-sm text-gray-500'>
                <h3
                  class='text-base font-semibold leading-6 text-gray-900'
                  id='modal-title'
                >
                  Are You Sure?
                </h3>

                <p class='my-2'>
                  You're deleting "{passwordData.title}" password and its data.
                  Type "delete" to the input below, and confirm your action.
                </p>

                {/*  */}
                <div class='rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                  <input
                    type='text'
                    name='delete'
                    id='delete'
                    class='block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder='type "delete" to continue'
                    value={delConfirmation}
                    onChange={(e) => setDelConfirmation(e.target.value)}
                  />
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </div>

        <div class='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
          <button
            type='button'
            class=''
            className={classNames(
              delConfirmation !== 'delete'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500',
              'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
            )}
            onClick={handleDeletion}
            disabled={delConfirmation !== 'delete'}
          >
            Delete Password
          </button>
          <button
            type='button'
            onClick={() => setDeleteModalOpen(false)}
            class='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
          >
            Cancel
          </button>
        </div>
      </Modal>
      {/* DELETE PASSWORD MODAL END */}

      {/* PASSWORD GENERATOR MODAL START */}
      <Modal open={open}>
        <div class='bg-white sm:w-full sm:max-w-xl'>
          <div>
            <div class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100'>
              <KeyIcon className='h-6 w-6 text-indigo-600' aria-hidden='true' />
            </div>
            <div class='mt-3 text-center sm:mt-5'>
              <PasswordGenerator
                generatedPassword={generatedPassword}
                setGeneratedPassword={setGeneratedPassword}
              />
            </div>
          </div>
        </div>

        <div class='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
          <button
            type='button'
            class='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
            onClick={fillPassword}
          >
            Fill Password
          </button>
          <button
            type='button'
            onClick={() => setOpen(false)}
            class='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
          >
            Cancel
          </button>
        </div>
      </Modal>
      {/* PASSWORD GENERATOR MODAL END */}

      <form onSubmit={onSubmit}>
        <div class='rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
          <label for='title' class='block text-xs font-medium text-gray-900'>
            Title *
          </label>
          <input
            type='text'
            name='title'
            id='title'
            class='block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
            placeholder='Title *'
            value={passwordData.title}
            onChange={onChange}
          />
        </div>

        <div>
          <div class='border-b border-gray-200 bg-white py-5'>
            <h3 class='text-base font-semibold leading-6 text-gray-900'>
              Login Details
            </h3>
          </div>
          <div class='rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <label
              for='identifier'
              class='block text-xs font-medium text-gray-900'
            >
              Email or Username
            </label>
            <input
              type='text'
              name='identifier'
              id='identifier'
              class='block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
              placeholder='Email or Username'
              value={passwordData.identifier}
              onChange={onChange}
            />
          </div>
          <div class='mt-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <label
              for='password'
              class='block text-xs font-medium text-gray-900'
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              class='block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
              placeholder='Password'
              value={passwordData.password}
              onChange={onChange}
            />

            <div class='flex justify-between w-full text-xs text-indigo-400 border-t border-t-gray-200 mt-2 pt-2'>
              <div>
                <a
                  href='#'
                  onClick={onGeneratePassword}
                  class='hover:underline'
                >
                  Generate password
                </a>
              </div>
              <div
                class='cursor-pointer hover:underline'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword && 'Hide'}
                {!showPassword && 'Show'}
              </div>
            </div>
          </div>
        </div>

        {/* WEBSITES START */}
        <div>
          <div class='border-b border-gray-200 bg-white py-5'>
            <h3 class='text-base font-semibold leading-6 text-gray-900'>
              Websites
            </h3>
          </div>
          <div class='rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <label
              for='identifier'
              class='block text-xs font-medium text-gray-900'
            >
              Website Address
            </label>
            <input
              type='text'
              name='website-0'
              id='website-0'
              class='block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
              placeholder='Website Address'
              value={passwordData.websites[0]}
              onChange={(e) => onWebsiteChange(0, e)}
            />
          </div>
        </div>
        {/* WEBSITES END */}

        <div class='flex items-center justify-between mt-6'>
          <div class=''>
            <button
              type='submit'
              class='rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Save
            </button>
            <button
              onClick={cancelOnClick}
              type='button'
              class='ml-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            >
              Cancel
            </button>
          </div>

          {canDelete() && (
            <div>
              <a
                href='#'
                onClick={openDeleteModal}
                class='text-sm text-red-400 hover:text-red-600 hover:underline'
              >
                Delete
              </a>
            </div>
          )}
        </div>
        {error && (
          <div className='mt-4 border border-red-400 p-2 rounded-md'>
            <p className='text-red-400 text-center text-sm'>{error}</p>
          </div>
        )}
      </form>
    </div>
  )
}
