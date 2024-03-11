import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import Sidebar from './Sidebar'
import Footer from './Footer'
import AuthPage from '../app/auth/page'
import Notification from './Notification'
import Home from '../app/page'
// Password
import Passwords from '../app/password/page'
import PasswordsCreate from '../app/password/create'
import PasswordsEdit from '../app/password/edit'
// Backup
import Backup from '../app/backup/page'
import BackupDiy from '../app/backup/diy'
import BackupConnectWithMe from '../app/backup/connect-with-me'
// Secure Notes
import SecureNotes from '../app/notes/page'
// Vote
import VoteForFeatures from '../app/vote/page'
// FAQ
import FAQ from '../app/faq/page'
import { classNames } from '../helpers'

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated()) {
    return <Element {...rest} />
  }

  return <Navigate to='/auth' replace />
}

const GuestRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated()) {
    return <Element {...rest} />
  }

  return <Navigate to='/' replace />
}

export function Layout ({ children } = {}) {
  const { isAuthenticated } = useAuth()
  return (
    <Router>
      <Notification />

      <div class='flex flex-wrap w-full'>
        {isAuthenticated() && <Sidebar />}

        <main
          className={classNames(
            isAuthenticated() ? 'w-3/4' : 'w-full mx-auto',
            'bg-white max-w-4xl min-h-screen flex flex-col'
          )}
        >
          <div className='p-12 flex-1'>
            <Routes>
              <Route path='/auth' element={<GuestRoute element={AuthPage} />} />
              <Route path='/' element={<ProtectedRoute element={Home} />} />

              {/* Password routes */}
              <Route
                path='/passwords'
                element={<ProtectedRoute element={Passwords} />}
              />
              <Route
                path='/passwords/create'
                element={<ProtectedRoute element={PasswordsCreate} />}
              />
              <Route
                path='/passwords/edit/:id'
                element={<ProtectedRoute element={PasswordsEdit} />}
              />

              {/* Secure Notes */}
              <Route
                path='/secure-notes'
                element={<ProtectedRoute element={SecureNotes} />}
              />

              {/* Backup routes */}
              <Route
                path='/backup'
                element={<ProtectedRoute element={Backup} />}
              />
              <Route
                path='/backup/diy'
                element={<ProtectedRoute element={BackupDiy} />}
              />
              <Route
                path='/backup/connect-with-me'
                element={<ProtectedRoute element={BackupConnectWithMe} />}
              />

              {/* Vote routes */}
              <Route
                path='/vote'
                element={<ProtectedRoute element={VoteForFeatures} />}
              />

              {/* FAQ */}
              <Route path='/faq' element={<ProtectedRoute element={FAQ} />} />
            </Routes>
          </div>

          <Footer />
        </main>
      </div>
    </Router>
  )
}
