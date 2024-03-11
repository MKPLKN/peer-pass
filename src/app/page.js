import { useNavigate } from 'react-router'
import { CheckCircleIcon } from '../icons'

export default function Home () {
  const nav = useNavigate()

  return (
    <div className='bg-white'>
      <div className='w-full max-w-7xl '>
        <div className='max-w-2xl mt-12'>
          <p className='text-lg tracking-wider font-semibold leading-8 text-indigo-600'>
            PeerPass
          </p>
          <h1 className='mt-0 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            P2P Password Manager
          </h1>
          <p className='mt-4 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8'>
            Full control in your hands. No more data breaches.
          </p>

          <div class='text-lg text-gray-600 mt-4'>
            <ul>
              <li class='flex items-center mb-4'>
                <CheckCircleIcon class='text-green-600 h-8 w-8 mr-2' />
                <p>
                  All of this is{' '}
                  <a
                    class='text-indigo-600 underline hover:text-indigo-400 font-semibold '
                    href='https://github.com/MKPLKN/peer-pass'
                    target='_blank'
                    rel='noreferrer'
                  >
                    open-sourced
                  </a>{' '}
                </p>
              </li>

              <li class='flex items-center mb-4'>
                <CheckCircleIcon class='text-green-600 h-8 w-8 mr-2' />
                <p>Everything is encrypted by default.</p>
              </li>

              <li class='flex items-center mb-4'>
                <CheckCircleIcon class='text-green-600 h-8 w-8 mr-2' />
                <p>Restore lost/destroyed data using a 24-word seed phrase.</p>
              </li>

              <li class='flex items-center mb-4'>
                <CheckCircleIcon class='text-green-600 h-8 w-8 mr-2' />
                <p>
                  Built using P2P building blocks by{' '}
                  <a
                    class='text-indigo-600 underline hover:text-indigo-400 font-semibold '
                    href='https://holepunch.to/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Holepunch
                  </a>{' '}
                </p>
              </li>

              <li class='flex items-center mb-4'>
                <CheckCircleIcon class='text-green-600 h-8 w-8 mr-2' />
                <p>
                  Built on{' '}
                  <a
                    class='text-indigo-600 underline hover:text-indigo-400 font-semibold '
                    href='https://pears.com'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Pear runtime
                  </a>{' '}
                </p>
              </li>
            </ul>
          </div>

          <div class='mt-8 text-lg text-gray-600 mt-4'>
            <p>
              Missing something? Please{' '}
              <span
                class='text-indigo-600 underline hover:text-indigo-400 font-semibold cursor-pointer'
                onClick={(e) => nav('/vote')}
              >
                send feedback!
              </span>{' '}
              It is more than welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
