import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon, KeyIcon, LockClosedIcon, ShieldCheckIcon } from '../icons'
import { classNames } from '../helpers'
import { MegaphoneIcon } from '../icons/MegaphoneIcon'
import { QuestionMarkCircleIcon } from '../icons/QuestionMarkCircleIcon'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    isActive: function (path) {
      return this.href === path
    }
  },
  {
    name: 'Passwords',
    href: '/passwords',
    icon: KeyIcon,
    isActive: (path) => {
      for (const p of ['/passwords', '/passwords/create', '/passwords/update']) {
        if (path.includes(p)) {
          return true
        }
      }
    }
  },
  {
    name: 'Secure Notes',
    href: '/secure-notes',
    icon: LockClosedIcon,
    isActive: (path) => {
      for (const p of ['/secure-notes', '/secure-notes/create', '/secure-notes/update']) {
        if (path.includes(p)) {
          return true
        }
      }
    }
  },
  {
    name: 'Backup',
    href: '/backup',
    icon: ShieldCheckIcon,
    isActive: (path) => {
      for (const p of ['/backup']) {
        if (path.includes(p)) {
          return true
        }
      }
    }
  },
  {
    name: 'Vote For Features',
    href: '/vote',
    icon: MegaphoneIcon,
    isActive: (path) => {
      for (const p of ['/vote']) {
        if (path.includes(p)) {
          return true
        }
      }
    }
  },
  {
    name: 'Good To Know',
    href: '/faq',
    icon: QuestionMarkCircleIcon,
    isActive: (path) => {
      for (const p of ['/faq']) {
        if (path.includes(p)) {
          return true
        }
      }
    }
  }
]

function SidebarLink ({ item, pathname, onClick }) {
  return (
    <li key={item.name}>
      <a
        href='#'
        onClick={onClick(item)}
        className={classNames(
          item.isActive(pathname)
            ? 'bg-indigo-700 text-white'
            : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        )}
      >
        <item.icon
          className={classNames(
            item.isActive(pathname)
              ? 'text-white'
              : 'text-indigo-200 group-hover:text-white',
            'h-6 w-6 shrink-0'
          )}
          aria-hidden='true'
        />
        {item.name}
      </a>
    </li>
  )
}

export default function Sidebar () {
  const location = useLocation()
  const nav = useNavigate()

  const linkOnClick = (link) => (e) => {
    e.preventDefault()
    nav(link.href)
  }

  return (
    <div class='min-h-screen h-full w-1/4 max-w-lg'>
      <div className='h-full inset-y-0 z-50 flex flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4'>
          <div className='mt-6 flex h-16 shrink-0 items-center'>
            <div class='flex h-16 shrink-0 items-center text-white font-bold text-4xl tracking-wider drop-shadow-xl'>
              PeerPass
            </div>
          </div>

          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-1'>
                  {navigation.map((item) => (
                    <SidebarLink
                      onClick={linkOnClick}
                      key={item.name}
                      item={item}
                      pathname={location.pathname}
                    />
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
