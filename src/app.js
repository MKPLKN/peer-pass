import fs from 'fs'
import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import { Layout } from './components/Layout'
import { authFacade, userFacade, getFacade, beforeStart, databaseFacade } from 'peer-pass-backend'

/**
 * Development Setup
 *
 */
async function beforeDevStop () {
  try {
    // fs.rmSync('./dev-users', { recursive: true })
    await databaseFacade.teardown({})
    await (getFacade('rpc')).teardown()
  } catch (error) {
    fs.writeFileSync('./log', Buffer.from(error.message))
  }
}

async function beforeDevStart () {
  const { autoCreate, autoLogin, fakePws, testUser, testPw, devUsersDir } = Pear.config.options
  beforeStart({ devUsersDir: devUsersDir || './dev-users' })
  if (autoCreate) {
    await userFacade.create({ username: testUser, password: testPw, confirmPassword: testPw })
  }
  if (autoLogin) {
    await authFacade.login({ username: testUser, password: testPw })
  }

  // Fake some data
  if (fakePws) {
    const passwords = [
      { title: 'Fake', identifier: 'example@email.com', password: 'fake-pw', websites: ['https://pears.com'] },
      { title: 'Fake 2', identifier: 'example@email.com', password: 'fake-pw-2' }
    ]
    for (const pw of passwords) {
      await getFacade('password').create(pw)
    }
  }
}

/**
 * Start app
 *
 */
async function start () {
  if (Pear.config.flags.dev) {
    process.on('SIGINT', beforeDevStop)
    Pear.teardown(beforeDevStop)
    await beforeDevStart()
  }

  const App = () => (
    <Providers>
      <div className='flex w-full h-full'>
        <Layout> </Layout>
      </div>
    </Providers>
  )

  const root = createRoot(document.getElementById('app'))
  root.render(<App />)
}
start()
