import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFacade, userFacade } from 'peer-pass-backend'
import { useAuth } from '../../providers/AuthProvider'

function RestoreUser () {
  const { getUser, restore, login } = useAuth()
  const [restoreUser, setRestoreUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    seed: ''
  })
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setRestoreUser((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    restore(restoreUser).then(async () => {
      const { username, password } = restoreUser
      login({ username, password }).then(async () => {
        await getUser()
      }).catch(() => {
        setErrorMsg('Restore succeed, but login failed. Please, try again.')
      })
    }).catch((e) => {
      setErrorMsg('An error occurred during user restoration.')
    })
  }

  return (
    <div class='flex min-h-full flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      <div class='w-full max-w-sm space-y-10'>
        <div>
          <h2 class='mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Restore User
          </h2>
          <p class='text-center text-sm text-gray-500'>
            Username and password are used to encrypt the seed on your local
            filesystem. After restoring, you can then login using the same
            username and password.
          </p>
        </div>
        <form class='space-y-6' onSubmit={handleSubmit}>
          <div class='relative -space-y-px rounded-md shadow-sm'>
            <div class='pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300' />
            <div>
              <label for='username' class='sr-only'>
                Username
              </label>
              <input
                type='text'
                name='username'
                id='username'
                required=''
                class='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Username'
                value={restoreUser.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label for='password' class='sr-only'>
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                autocomplete='current-password'
                required=''
                class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Password'
                value={restoreUser.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label for='confirm-password' class='sr-only'>
                Confirm Password
              </label>
              <input
                type='password'
                name='confirmPassword'
                id='confirm-password'
                required=''
                class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Confirm Password'
                value={restoreUser.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label for='seed' class='sr-only'>
                Seed phrase
              </label>
              <input
                type='password'
                name='seed'
                id='seed-phrase'
                required='true'
                class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Seed phrase'
                value={restoreUser.seed}
                onChange={handleChange}
              />
            </div>
          </div>

          {errorMsg && (
            <div class='border border-red-400 p-2 rounded-md'>
              <p class='text-red-400 text-center text-sm'>{errorMsg}</p>
            </div>
          )}
          <div>
            <button
              type='submit'
              class='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Restore User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateUserTab () {
  const { login, getUser } = useAuth()
  const [createUser, setCreateUser] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [invalid, setInvalid] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const [seed, setSeed] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCreateUser((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setInProgress(true)

    await new Promise(resolve => setTimeout(() => resolve(), 0))
    const response = await userFacade.create(createUser)

    if (!response.success) {
      setInProgress(false)
      return setInvalid(response.error.message)
    }

    const loginRes = await login({ username: createUser.username, password: createUser.password })
    if (!loginRes.success) {
      setInProgress(false)
      return setInvalid('User creation succeed, but login failed. Please, try login again.')
    }
    setInProgress(false)
    setSeed(response.seed)
    setUserCreated(true)
  }

  const goHome = async () => {
    await getUser()
  }

  return (
    <div>
      {!userCreated && (
        <div class='flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
          <div class='w-full max-w-sm space-y-10'>
            <div>
              <h2 class='mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                Create User
              </h2>

              <p class='text-center text-sm text-gray-500'>
                Username and password are used to encrypt the seed on your local
                filesystem.
              </p>
            </div>
            <form class='space-y-6' onSubmit={handleSubmit}>
              <div class='relative -space-y-px rounded-md shadow-sm'>
                <div class='pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300' />
                <div>
                  <label for='username' class='sr-only'>
                    Username
                  </label>
                  <input
                    type='text'
                    name='username'
                    id='username'
                    required=''
                    class='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Username'
                    value={createUser.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for='password' class='sr-only'>
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    autocomplete='current-password'
                    required=''
                    class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Password'
                    value={createUser.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for='confirm-password' class='sr-only'>
                    Confirm Password
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    id='confirm-password'
                    required=''
                    class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Confirm Password'
                    value={createUser.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {invalid && (
                <div className='border border-red-400 p-2 rounded-md'>
                  <p className='text-red-400 text-center text-sm'>{invalid}</p>
                </div>
              )}

              <div>
                <button
                  type='submit'
                  class='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  {inProgress && (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      class='animate-spin w-6 h-6 mr-2'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                      />
                    </svg>
                  )}

                  {inProgress && 'Creating...'}
                  {!inProgress && 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userCreated && (
        <div class='flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
          <div class='w-full max-w-sm space-y-10'>
            <div>
              <h2 class='mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                User Created!
              </h2>

              <p class='text-center text-sm text-gray-500'>
                Here is your mnemonic, make sure you store it securely. This
                will never be shown again. You can use this to restore your data
                at any given moment.
              </p>

              <div class='mt-4 bg-gray-50 border border-gray-100 p-4 rounded-lg shadow-xl'>
                <code>{seed}</code>
              </div>

              <div className='mt-12'>
                <button
                  type='button'
                  className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={goHome}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoginTab () {
  const { login, getUser } = useAuth()
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  const [invalidLogin, setInvalidLogin] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await login(loginData)
    if (!res.success) return setInvalidLogin(true)
    await getUser()
  }

  return (
    <div class='flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div class='w-full max-w-sm space-y-10'>
        <div>
          <h2 class='mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Login
          </h2>
        </div>
        <form class='space-y-6' action='#' method='POST' onSubmit={handleLogin}>
          <div class='relative -space-y-px rounded-md shadow-sm'>
            <div class='pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300' />
            <div>
              <label for='username' class='sr-only'>
                Username
              </label>
              <input
                id='username'
                name='username'
                required=''
                class='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Username'
                value={login.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label for='password' class='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autocomplete='current-password'
                required=''
                class='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Password'
                value={login.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {invalidLogin && (
            <div className='border border-red-400 p-2 rounded-md'>
              <p className='text-red-400 text-center text-sm'>
                Incorrect username/password. If you have not yet created a user,
                you can do so in the "Create User" tab.
              </p>
            </div>
          )}

          <div>
            <button
              type='submit'
              class='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AuthPage () {
  const [tabs] = useState([
    { name: 'Login', href: '#', current: false },
    { name: 'Create', href: '#', current: false },
    { name: 'Restore', href: '#', current: false }
  ])
  const [activeTab, setActiveTab] = useState(tabs[0])

  const tabOnClick = (tab) => (e) => {
    e.preventDefault()
    setActiveTab(tab)
  }

  return (
    <div className='mx-auto max-w-md'>
      <div>
        <div className='block'>
          <nav
            className='isolate flex divide-x divide-gray-200 rounded-lg shadow'
            aria-label='Tabs'
          >
            {tabs.map((tab, tabIdx) => (
              <a
                key={tab.name} // Added a key here for React's list rendering
                href='#'
                onClick={tabOnClick(tab)}
                className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 ${
                  tab.name === activeTab.name
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                } ${tabIdx === 0 ? 'rounded-l-lg' : ''} ${
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : ''
                }`}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden='true'
                  className={`${
                    tab.name === activeTab.name
                      ? 'bg-indigo-500'
                      : 'bg-transparent'
                  } absolute inset-x-0 bottom-0 h-0.5`}
                />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {activeTab.name === 'Login' && <LoginTab />}
      {activeTab.name === 'Create' && <CreateUserTab />}
      {activeTab.name === 'Restore' && <RestoreUser />}
    </div>
  )
}

export default AuthPage
