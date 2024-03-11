import { useNavigate } from 'react-router'

export default function BackupConnectWithMe () {
  const nav = useNavigate()

  return (
    <div className='bg-white'>
      <div className='mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8'>
        <div className='mx-auto mt-20 max-w-2xl text-center sm:mt-24'>
          <p className='text-base font-semibold leading-8 text-indigo-600'>
            Coming Soon (if there is demand)
          </p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Replicate With Me
          </h1>
          <p className='mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8'>
            Managing backups/servers is not something that everyone loves to do.
            That's why I figured it may be a nice little feature to offer
            plug-n-play type of backup services for super cheap like $0.99/month
            or something. What you think?{' '}
            <span
              onClick={(e) => nav('/vote')}
              class='text-indigo-600 underline hover:text-indigo-400 font-semibold cursor-pointer'
            >
              Give a vote!
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
