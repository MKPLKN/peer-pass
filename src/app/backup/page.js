import { useNavigate } from 'react-router'
import { CloudArrowUpIcon, LockClosedIcon } from '../../icons'

export default function Backup () {
  const nav = useNavigate()

  return (
    <div className='bg-white'>
      <div className=''>
        <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
          Backup <span class='text-indigo-600'>Your</span> Data
        </h2>
        <p className='mt-2 max-w-2xl text-base leading-7 text-gray-600'>
          Full control in your hands. No more data breaches.
        </p>
      </div>

      <div>
        <Example nav={nav} />
      </div>
    </div>
  )
}

const features = [
  {
    href: '/backup/diy',
    name: 'Do It Yourself',
    description:
      'Start the replication network and connect any number of peers to it—your own servers, homelab, friends, whatever. Just make sure some of them are online most of the time to make them useful',
    icon: LockClosedIcon
  },
  {
    href: '/backup/connect-with-me',
    name: 'Replicate With Me',
    description:
      'I have a server cluster running; for a few pennies, you can use that to get your data availability close to 100%. Remember, no matter who you replicate your data with, only your keys can decrypt the data',
    icon: CloudArrowUpIcon
  }
]

function Example ({ nav }) {
  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mt-12 max-w-2xl lg:max-w-2xl'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-1 lg:gap-y-16'>
          {features.map((feature) => (
            <div onClick={(e) => nav(feature.href)} key={feature.name} class='p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-indigo-50'>
              <div className='relative pl-16'>
                <dt className='text-base font-semibold leading-7 text-gray-900'>
                  <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
                    <feature.icon
                      className='h-6 w-6 text-white'
                      aria-hidden='true'
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className='mt-2 text-base leading-7 text-gray-600'>
                  {feature.description}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
