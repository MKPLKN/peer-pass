import { useRpc } from '../../providers/RpcProvider'
import { useState } from 'react'
import { classNames, getOption } from '../../helpers'
import Modal from '../../components/Modal'
import { useNotification } from '../providers'

export default function VoteForFeatures () {
  const { showNotification } = useNotification()
  const { rpcModel } = useRpc()
  // Vote
  const [clickedVote, setClickedVote] = useState({})
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [voteInProgress, setVoteInProgress] = useState(false)
  // Feedback
  const [feedbackInput, setFeedbackInput] = useState('')
  const [feedbackInProgress, setFeedbackInProgress] = useState(false)

  const features = [
    {
      name: 'Connect With Me',
      slug: 'connect-with-me',
      description:
        'Plug-n-play backup services for $0.99/month, payable in BTC/USDt'
    },
    {
      name: 'Multi-device ID',
      slug: 'secure-notes',
      description:
        'You can use the same account in multiple devices concurrently'
    },
    {
      name: 'Secure Notes',
      slug: 'secure-notes',
      description:
        'Store wider range of data + share a piece of information P2P'
    },
    {
      name: 'Browser extension(s)',
      slug: 'browser-ext',
      description:
        'Auto-fill login forms on websites'
    }
  ]

  async function voteOnClick (e, feature, vote) {
    e.preventDefault()
    setClickedVote({ ...feature, vote })
    setConfirmModalOpen(true)
  }

  async function handleVote () {
    try {
      if (voteInProgress) return
      setVoteInProgress(true)
      const rawPayload = Buffer.from(
        JSON.stringify({
          key: rpcModel.key,
          feature: clickedVote.slug,
          value: clickedVote.vote === 1 ? 1 : 0
        })
      )

      const respRaw = await rpcModel.rpc.request(
        Buffer.from(getOption('PEERTOPEERHUB_COM'), 'hex'),
        'vote',
        rawPayload
      )
      const resp = JSON.parse(respRaw.toString('utf-8'))
      setConfirmModalOpen(false)
      setTimeout(() => {
        setVoteInProgress(false)
        setClickedVote({})
        if (resp.success) {
          showNotification({
            type: 'success',
            title: 'Vote registerd!',
            message: `You voted "${
              clickedVote.vote === 1 ? 'YES' : 'NO'
            }" successfully`
          })
        } else {
          showNotification({
            type: 'error',
            title: 'FAILED!',
            message: 'Your vote could not be registered, try again later.'
          })
        }
      }, 250)
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'FAILED!',
        message: 'Your vote could not be registered, try again later.'
      })
      setConfirmModalOpen(false)
      setTimeout(() => {
        setVoteInProgress(false)
        setClickedVote({})
      }, 250)
    }
  }

  const validFeedback = () =>
    String(feedbackInput).length <= 240 && String(feedbackInput).length >= 12

  async function handleFeedback (e) {
    e.preventDefault()
    if (!validFeedback()) return

    try {
      if (feedbackInProgress) return
      setFeedbackInProgress(true)
      const rawPayload = Buffer.from(
        JSON.stringify({
          key: rpcModel.key,
          feedback: feedbackInput
        })
      )

      const respRaw = await rpcModel.rpc.request(
        Buffer.from(getOption('PEERTOPEERHUB_COM'), 'hex'),
        'feedback',
        rawPayload
      )
      const resp = JSON.parse(respRaw.toString('utf-8'))

      if (resp.success) {
        setFeedbackInput('')
        showNotification({
          type: 'success',
          title: 'Feedback sent!'
        })
      } else {
        showNotification({
          type: 'error',
          title: 'FAILED!',
          message: 'Your feedback could not be sent, try again later.'
        })
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'FAILED!',
        message: 'Your vote could not be registered, try again later.'
      })
      setFeedbackInProgress(false)
    }
  }

  return (
    <div className='bg-white'>
      {/* CONFIRM VOTE MODAL START */}
      <Modal open={confirmModalOpen}>
        <div class='bg-white sm:w-full sm:max-w-xl'>
          <div>
            <div class='mt-3 text-center sm:mt-5'>
              <div class='text-sm text-gray-500'>
                <h3
                  class='text-base font-semibold leading-6 text-gray-900'
                  id='modal-title'
                >
                  Are You Sure?
                </h3>

                <p class='my-2'>
                  You're voting "{clickedVote.vote === 1 ? 'YES' : 'NO'}" to
                  feature "{clickedVote.name}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
          <button
            type='button'
            class=''
            className={classNames(
              clickedVote.vote === 1
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-red-600 hover:bg-red-500',
              'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
            )}
            onClick={handleVote}
          >
            {!voteInProgress && (
              <span>Confirm {clickedVote.vote === 1 ? 'YES' : 'NO'}</span>
            )}
            {voteInProgress && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                class='animate-spin w-5 h-5'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                />
              </svg>
            )}
          </button>
          <button
            type='button'
            onClick={() => setConfirmModalOpen(false)}
            class='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
          >
            Cancel
          </button>
        </div>
      </Modal>
      {/* CONFIRM VOTE MODAL END */}

      <div className=''>
        <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
          Vote <span class='text-indigo-600'>For</span> Features
        </h2>
        <p className='mt-2 max-w-2xl text-base leading-7 text-gray-600'>
          Let me know which features make sense to you; also, any kind of
          feedback is more than welcome.
        </p>
      </div>

      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                  >
                    Feature
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Description
                  </th>
                  <th
                    scope='col'
                    className='relative py-3.5 pl-3 pr-4 sm:pr-0 text-sm font-semibold text-gray-900'
                  >
                    Vote
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {features.map((feature) => (
                  <tr key={feature.name}>
                    <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                      {feature.name}
                    </td>
                    <td className='px-3 py-4 text-sm text-gray-500'>
                      {feature.description}
                    </td>
                    <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                      <a
                        href='#'
                        onClick={(e) => voteOnClick(e, feature, 1)}
                        className='text-indigo-600 hover:text-indigo-900 mr-4'
                      >
                        Yes
                      </a>
                      <a
                        href='#'
                        onClick={(e) => voteOnClick(e, feature, 0)}
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        No
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='mt-12 pt-12 border-t border-gray-200'>
        <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
          Send Feedback
        </h2>
        <p>
          The message should be at least 12 characters, but no more than 240
          characters long.
        </p>
        <div class='mt-4'>
          <div className='flex items-start space-x-4'>
            <div className='min-w-0 flex-1'>
              <form onSubmit={handleFeedback} className='relative'>
                <div className='overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                  <label htmlFor='comment' className='sr-only'>
                    What's on your mind?
                  </label>
                  <textarea
                    rows={3}
                    name='comment'
                    id='comment'
                    className='block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6'
                    placeholder="What's on your mind?"
                    defaultValue=''
                    value={feedbackInput}
                    onChange={(e) =>
                      String(feedbackInput).length < 240
                        ? setFeedbackInput(e.target.value)
                        : setFeedbackInput(
                          e.target.value.length < feedbackInput.length
                            ? e.target.value
                            : feedbackInput
                        )}
                  />

                  {/* Spacer element to match the height of the toolbar */}
                  <div className='py-2' aria-hidden='true'>
                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                    <div className='py-px'>
                      <div className='h-9' />
                    </div>
                  </div>
                </div>

                <div className='absolute inset-x-0 bottom-0 flex items-center justify-between py-2 pl-3 pr-2'>
                  <div className='flex-shrink-0'>
                    <button
                      type='submit'
                      className={classNames(
                        !validFeedback()
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500',
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      )}
                    >
                      Send
                    </button>
                  </div>

                  <div class='text-xs'>
                    <p>{String(feedbackInput).length}/240</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
