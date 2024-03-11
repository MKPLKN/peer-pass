import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFacade } from 'peer-pass-backend'
import { useNotification } from '../providers'
import PasswordForm from '../../components/PasswordForm'

const PasswordsCreate = () => {
  const passwordFacade = getFacade('password')
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [passwordCreate, setPasswordCreate] = useState({
    title: '',
    identifier: '',
    password: '',
    websites: []
  })
  const [creationError, setCreationError] = useState('')

  const handleCreation = async (e) => {
    e.preventDefault()
    const response = await passwordFacade.create(passwordCreate)

    if (!response.success) {
      return setCreationError(
        response?.error?.message || 'Something went wrong!'
      )
    }

    showNotification({
      title: 'Successfully saved!',
      message: 'New password created'
    })

    navigate('/passwords')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswordCreate((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
    <div class=''>
      <div class=''>
        <div class='sm:flex sm:items-center mb-4'>
          <div class='sm:flex-auto'>
            <h1 class='text-lg font-semibold leading-6 text-gray-900'>
              Create Password
            </h1>
          </div>
        </div>

        <PasswordForm
          passwordData={passwordCreate}
          onChange={handleChange}
          onSubmit={handleCreation}
          error={creationError}
        />

      </div>
    </div>
  )
}

export default PasswordsCreate
