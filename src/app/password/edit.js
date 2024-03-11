import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getFacade } from 'peer-pass-backend'
import Spinner from '../../components/Spinner'
import PasswordForm from '../../components/PasswordForm'
import { useNotification } from '../providers'

export default function PasswordsEdit () {
  const passwordFacade = getFacade('password')
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState(null)
  const { showNotification } = useNotification()
  const [passwordData, setPasswordData] = useState({
    title: '',
    identifier: '',
    password: '',
    websites: []
  })
  const [creationError, setCreationError] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    const payload = { ...passwordData, id: password.getAttributes('id') }
    const response = await passwordFacade.update(payload)
    if (!response.success) {
      return setCreationError(
        response?.error?.message || 'Something went wrong!'
      )
    }

    const { title } = payload
    showNotification({
      title: 'Successfully updated!',
      message: `Password "${title}" updated`
    })

    navigate('/passwords')
  }

  const handleDeletion = async (e) => {
    e.preventDefault()
    const payload = { id: password.getAttributes('id') }
    const response = await passwordFacade.destroy(payload)
    if (!response.success) {
      return setCreationError(
        response?.error?.message || 'Something went wrong!'
      )
    }

    showNotification({
      title: 'Successfully deleted!',
      message: `Password "${password.getAttributes('title')}" deleted`
    })

    navigate('/passwords')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prevState) => ({ ...prevState, [name]: value }))
  }

  useEffect(() => {
    async function getPassword (id) {
      const response = await passwordFacade.find(id)
      if (!response.success) {
        return navigate('/passwords')
      }

      const pw = response.item
      for (const key of response.item.fillable) {
        handleChange({ target: { name: key, value: pw.getAttributes(key) } })
      }
      setPassword(pw)
      setLoading(false)
    }
    getPassword(id)
  }, [])

  return (
    <div class=''>
      <div class=''>
        <div class='sm:flex sm:items-center mb-4'>
          <div class='sm:flex-auto'>
            <h1 class='text-lg font-semibold leading-6 text-gray-900'>
              Edit Password
            </h1>
          </div>
        </div>

        {loading && (
          <div class='text-indigo-700 w-full flex items-center justify-center py-12'>
            <Spinner />
          </div>
        )}

        {!loading && (
          <PasswordForm
            passwordData={passwordData}
            onChange={handleChange}
            onSubmit={handleUpdate}
            onDeletion={handleDeletion}
            error={creationError}
            options={{ canDelete: true }}
          />
        )}
      </div>
    </div>
  )
}
