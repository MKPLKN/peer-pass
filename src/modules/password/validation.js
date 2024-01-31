const Joi = require('joi')

const schema = Joi.object({
  title: Joi.string().required(),
  identifier: Joi.string().allow(''),
  password: Joi.string().allow(''),
  websites: Joi.array().items(Joi.string().domain({ tlds: { allow: true } }).allow('')),
  note: Joi.string().allow('')
})

function validate (attributes) {
  const { error, value } = schema.validate(attributes)

  if (error) {
    throw new Error(`Validation error: ${error.message}`)
  }

  return value
}

module.exports = validate
