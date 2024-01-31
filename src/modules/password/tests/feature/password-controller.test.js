const test = require('brittle')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

test('password/create - it creates a new password for the user', async (t) => {
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const payload = {
    title: 'Test password',
    identifier: '', // Email, username, ....
    password: '',
    websites: [''],
    note: ''
  }
  const response = await app.container.resolve('passwordController').create(payload)
  t.ok(response.success, 'Password creation response is success')
  t.alike(response.password.title, payload.title, 'Password title is correct')
  t.ok(response.password.id, 'Password has an ID')

  const pw = await app.container.resolve('passwordRepository').find(response.password.id)
  t.alike(response.password.id, pw.getAttributes('id'), 'Password ID matches')
  t.alike(response.password.title, pw.getAttributes('title'), 'Password title matches')

  await removeUsers()
})
