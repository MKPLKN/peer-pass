import React, { useState, useEffect } from 'react'
import Switch from './Switch'

export default function PasswordGenerator ({ generatedPassword, setGeneratedPassword }) {
  const [passwordLength, setPasswordLength] = useState(60)
  const [useCapital, setUseCapital] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)

  useEffect(() => {
    generatePassword()
  }, [passwordLength, useCapital, useDigits, useSymbols]) // Dependencies

  const generatePassword = () => {
    const letterChars = 'abcdefghijklmnopqrstuvwxyz'
    const capitalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digitChars = '0123456789'
    const symbolChars = '@!$%&*'
    // const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let validChars = letterChars
    if (useCapital) validChars += capitalChars
    if (useDigits) validChars += digitChars
    if (useSymbols) validChars += symbolChars

    let newPassword = ''
    for (let i = 0; i < passwordLength; i++) {
      newPassword += validChars.charAt(
        Math.floor(Math.random() * validChars.length)
      )
    }
    setGeneratedPassword(newPassword)
  }

  return (
    <div class='text-sm text-gray-500'>
      <h3
        class='text-base font-semibold leading-6 text-gray-900'
        id='modal-title'
      >
        Password Generator
      </h3>

      {generatedPassword && (
        <div class='mt-2 mb-6 h-24 text-lg font-semibold bg-indigo-50 px-4 rounded-lg flex items-center justify-center text-gray-700 break-all'>
          {generatedPassword}
        </div>
      )}

      <div class='mt-2'>
        <label class='w-full flex items-center justify-between'>
          <span>Length</span>
          <div class='flex items-center'>
            <input
              type='range'
              min='8'
              max='60'
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
            />
            <p class='ml-2'>{passwordLength}</p>
          </div>
        </label>
      </div>

      <div class='mt-2'>
        <label class='w-full flex items-center justify-between'>
          <span>Use capital letters (A-Z)</span>
          <Switch
            name='Use letters'
            enabled={useCapital}
            setEnabled={setUseCapital}
          />
        </label>
      </div>

      <div class='mt-2'>
        <label class='w-full flex items-center justify-between'>
          <span>Use Digits (0-9)</span>
          <Switch
            name='Use digits'
            enabled={useDigits}
            setEnabled={setUseDigits}
          />
        </label>
      </div>

      <div class='mt-2'>
        <label class='w-full flex items-center justify-between'>
          <span>Use Symbols (@!$%&*)</span>
          <Switch
            name='Use symbols'
            enabled={useSymbols}
            setEnabled={setUseSymbols}
          />
        </label>
      </div>
    </div>
  )
}
