import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFacade } from 'peer-pass-backend'
import {
  ArrowTopRightOnSquareIcon,
  KeyIcon,
  PlusIcon,
  UserIcon
} from '../../icons'
import { copy } from '../../helpers'
import { useNotification } from '../providers'

function EmptyState () {
  const navigate = useNavigate()

  return (
    <div className=' h-full flex items-center justify-center w-full'>
      <div className='text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden='true'
        >
          <path
            vectorEffect='non-scaling-stroke'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-semibold text-gray-900'>
          No Passwords
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Get started by creating your first password
        </p>
        <div className='mt-6'>
          <button
            onClick={() => navigate('/passwords/create')}
            type='button'
            className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <PlusIcon className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' />
            New Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Passwords () {
  const passwordFacade = getFacade('password')
  const { showNotification } = useNotification()

  const navigate = useNavigate()
  const [passwords, setPasswords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function hasWebsites (pw) {
    return pw && pw.websites && pw.websites.length > 0
  }

  const editPassword = (password) => (event) => {
    event.preventDefault()
    const { id } = password
    navigate(`/passwords/edit/${id}`)
  }

  const launchSite = (pw) => (e) => {
    const { websites } = pw
    if (websites && websites.length) {
      window.open(websites[0])
      showNotification({
        title: 'Site Launched!',
        message: `Website "${websites[0]}" launched`
      })
    }
  }
  const copyIdentifier = (pw) => async (e) => {
    await copy(pw.identifier)
    showNotification({
      title: 'Identifier Copied!',
      message: `Username or email from "${pw.title}" copied to clipboard`
    })
  }
  const copyPassword = (pw) => async (e) => {
    await copy(pw.password)
    showNotification({
      title: 'Password Copied!',
      message: `Password from "${pw.title}" copied to clipboard`
    })
  }

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        setLoading(true)
        const response = await passwordFacade.index()
        if (!response.success) {
          throw new Error('Something went wrong')
        }
        setPasswords(response.items)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPasswords()
  }, [])

  return (
    <div class='h-full'>
      {passwords.length < 1 && <EmptyState />}

      {passwords.length > 0 && (
        <div class=''>
          <div class='sm:flex sm:items-center'>
            <div class='sm:flex-auto'>
              <h1 class='text-base font-semibold leading-6 text-gray-900'>
                Passwords
              </h1>
              <p class='mt-2 text-sm text-gray-700'>
                A list of all the passwords in your account including their
                title, and quick actions.
              </p>
            </div>
            <div class='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
              <Link
                to='/passwords/create'
                type='button'
                class='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Add password
              </Link>
            </div>
          </div>
          <div class='mt-8 flow-root'>
            <div class='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div class='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                {loading && 'loading...'}

                {!loading && (
                  <table class='min-w-full divide-y divide-gray-300'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          class='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                        >
                          Title
                        </th>
                        <th
                          scope='col'
                          class='relative py-3.5 pl-3 pr-4 sm:pr-0'
                        >
                          <span class='sr-only'>Actions</span>
                        </th>
                        <th
                          scope='col'
                          class='relative py-3.5 pl-3 pr-4 sm:pr-0'
                        >
                          <span class='sr-only'>Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class='divide-y divide-gray-200'>
                      {passwords.map((pw) => (
                        <tr key={pw.id}>
                          <td class='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0'>
                            {pw.title}
                          </td>
                          <td class='whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-10'>
                            <div class='flex items-center justify-end'>
                              {/* Launch site */}
                              {hasWebsites(pw) && (
                                <button
                                  onClick={launchSite(pw)}
                                  class='mr-2 p-1 rounded-full hover:text-indigo-700 hover:bg-indigo-100'
                                >
                                  <ArrowTopRightOnSquareIcon class='h-5 w-5' />
                                </button>
                              )}

                              {/* Copy Username */}
                              <button
                                onClick={copyIdentifier(pw)}
                                class='mr-2 p-1 rounded-full hover:text-indigo-700 hover:bg-indigo-100'
                              >
                                <UserIcon class='h-5 w-5' />
                              </button>

                              {/* Copy Password */}
                              {pw.password && (
                                <button
                                  onClick={copyPassword(pw)}
                                  class='p-1 rounded-full hover:text-indigo-700 hover:bg-indigo-100'
                                >
                                  <KeyIcon class='h-5 w-5' />
                                </button>
                              )}
                            </div>
                          </td>
                          <td class='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                            {/* Edit */}
                            <a
                              onClick={editPassword(pw)}
                              href='#'
                              class='text-indigo-600 hover:text-indigo-900'
                            >
                              Edit<span class='sr-only'>, {pw.title}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
